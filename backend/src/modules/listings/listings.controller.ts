import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';

export const searchListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      destination,
      category,
      minPrice,
      maxPrice,
      minRating,
      verifiedOnly,
      hasDiscount,
      sortBy = 'featured',
      limit = '12',
      page = '1',
    } = req.query;

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (search) {
      const q = String(search).toLowerCase();
      where.OR = [
        { title: { contains: q } },
        { shortDescription: { contains: q } },
        { destination: { name: { contains: q } } },
        { category: { name: { contains: q } } },
      ];
    }

    if (destination) {
      where.destination = {
        OR: [
          { slug: String(destination) },
          { id: String(destination) },
          { name: { contains: String(destination) } }
        ]
      };
    }

    if (category) {
      where.category = {
        OR: [
          { slug: String(category) },
          { id: String(category) },
          { name: { contains: String(category) } }
        ]
      };
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice as string);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice as string);
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating as string) };
    }

    if (verifiedOnly === 'true') {
      where.provider = { verificationStatus: 'APPROVED' };
    }

    if (hasDiscount === 'true') {
      where.discounts = { some: { isActive: true } };
    }

    let orderBy: any = [{ isFeatured: 'desc' }, { featuredPriority: 'desc' }, { createdAt: 'desc' }];
    if (sortBy === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    } else if (sortBy === 'rating_desc') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          destination: { select: { id: true, name: true, slug: true, country: true } },
          category: { select: { id: true, name: true, slug: true, icon: true } },
          provider: {
            select: {
              id: true,
              businessName: true,
              verificationStatus: true,
              rating: true,
              logoUrl: true,
            }
          },
          media: {
            orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }],
            take: 3,
          },
          discounts: {
            where: { isActive: true },
            take: 1,
          },
        }
      }),
      prisma.listing.count({ where })
    ]);

    return res.json({
      success: true,
      data: listings,
      meta: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getListingBySlugOrId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idOrSlug } = req.params;

    const listing = await prisma.listing.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ]
      },
      include: {
        destination: true,
        category: true,
        provider: {
          select: {
            id: true,
            businessName: true,
            bio: true,
            logoUrl: true,
            bannerUrl: true,
            verificationStatus: true,
            rating: true,
            reviewCount: true,
            city: true,
            country: true,
          }
        },
        packages: true,
        itineraryItems: {
          orderBy: { dayNumber: 'asc' }
        },
        media: {
          orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }]
        },
        availability: {
          where: { isBlocked: false },
          take: 30,
        },
        discounts: {
          where: { isActive: true }
        },
        reviews: {
          where: { status: 'PUBLISHED' },
          include: {
            user: { select: { firstName: true, lastName: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        }
      }
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    return res.json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
};

const createListingSchema = z.object({
  title: z.string().min(5),
  destinationId: z.string(),
  categoryId: z.string(),
  shortDescription: z.string().min(10),
  fullDescription: z.string().min(20),
  basePrice: z.number().positive(),
  currency: z.string().default('PKR'),
  durationDays: z.number().int().positive().default(1),
  maxGuests: z.number().int().positive().default(10),
  meetingPoint: z.string().optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  cancellationPolicy: z.string().optional(),
  termsAndConditions: z.string().optional(),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL']).default('PENDING_APPROVAL'),
  media: z.array(z.object({
    url: z.string(),
    altText: z.string().optional(),
    isCover: z.boolean().default(false)
  })).optional(),
  itinerary: z.array(z.object({
    dayNumber: z.number().int(),
    title: z.string(),
    description: z.string(),
    mealsIncluded: z.string().optional(),
    accommodation: z.string().optional(),
  })).optional(),
  packages: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number().positive(),
    discountedPrice: z.number().optional(),
    minGuests: z.number().default(1),
    maxGuests: z.number().default(10),
    durationDays: z.number().default(1),
  })).optional(),
});

export const createListing = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = createListingSchema.parse(req.body);
    const userId = req.user!.id;

    const provider = await prisma.provider.findUnique({
      where: { userId }
    });

    if (!provider) {
      return res.status(403).json({ success: false, message: 'Provider profile required to create listings' });
    }

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

    const listing = await prisma.listing.create({
      data: {
        providerId: provider.id,
        destinationId: data.destinationId,
        categoryId: data.categoryId,
        title: data.title,
        slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        basePrice: data.basePrice,
        currency: data.currency,
        durationDays: data.durationDays,
        maxGuests: data.maxGuests,
        meetingPoint: data.meetingPoint,
        inclusions: data.inclusions ? JSON.stringify(data.inclusions) : '[]',
        exclusions: data.exclusions ? JSON.stringify(data.exclusions) : '[]',
        highlights: data.highlights ? JSON.stringify(data.highlights) : '[]',
        cancellationPolicy: data.cancellationPolicy,
        termsAndConditions: data.termsAndConditions,
        status: data.status,
        media: data.media && data.media.length > 0 ? {
          create: data.media.map((m, index) => ({
            url: m.url,
            altText: m.altText || data.title,
            isCover: m.isCover || index === 0,
            sortOrder: index,
          }))
        } : undefined,
        itineraryItems: data.itinerary && data.itinerary.length > 0 ? {
          create: data.itinerary.map(item => ({
            dayNumber: item.dayNumber,
            title: item.title,
            description: item.description,
            mealsIncluded: item.mealsIncluded,
            accommodation: item.accommodation,
          }))
        } : undefined,
        packages: data.packages && data.packages.length > 0 ? {
          create: data.packages.map(pkg => ({
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            discountedPrice: pkg.discountedPrice,
            minGuests: pkg.minGuests,
            maxGuests: pkg.maxGuests,
            durationDays: pkg.durationDays,
          }))
        } : undefined,
      },
      include: {
        destination: true,
        category: true,
        media: true,
        packages: true,
        itineraryItems: true,
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        actorRole: req.user!.role,
        action: 'LISTING_CREATED',
        entityType: 'Listing',
        entityId: listing.id,
        metadata: JSON.stringify({ title: listing.title, status: listing.status }),
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyProviderListings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const provider = await prisma.provider.findUnique({
      where: { userId }
    });

    if (!provider) {
      return res.status(403).json({ success: false, message: 'Provider profile required' });
    }

    const listings = await prisma.listing.findMany({
      where: { providerId: provider.id },
      include: {
        destination: true,
        category: true,
        media: { where: { isCover: true }, take: 1 },
        discounts: { where: { isActive: true }, take: 1 },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: listings });
  } catch (err) {
    next(err);
  }
};

export const updateListingStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    const provider = await prisma.provider.findUnique({ where: { userId } });
    if (!provider) {
      return res.status(403).json({ success: false, message: 'Provider not found' });
    }

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing || listing.providerId !== provider.id) {
      return res.status(404).json({ success: false, message: 'Listing not found or unauthorized' });
    }

    // Providers can toggle between PUBLISHED and DRAFT if already approved, or request approval
    const updated = await prisma.listing.update({
      where: { id },
      data: { status }
    });

    return res.json({ success: true, message: `Listing status updated to ${status}`, data: updated });
  } catch (err) {
    next(err);
  }
};
