import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getPublicProviders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, city, limit = '20', page = '1' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {
      verificationStatus: 'APPROVED',
      isActive: true,
    };

    if (search) {
      where.businessName = { contains: String(search) };
    }

    if (city) {
      where.city = { contains: String(city) };
    }

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          businessName: true,
          bio: true,
          logoUrl: true,
          bannerUrl: true,
          city: true,
          country: true,
          verificationStatus: true,
          rating: true,
          reviewCount: true,
          _count: {
            select: {
              listings: { where: { status: 'PUBLISHED' } },
              reviews: { where: { status: 'PUBLISHED' } },
            }
          }
        },
        orderBy: { rating: 'desc' }
      }),
      prisma.provider.count({ where })
    ]);

    return res.json({
      success: true,
      data: providers,
      meta: { total, page: parseInt(page as string, 10), limit: take }
    });
  } catch (err) {
    next(err);
  }
};

export const getProviderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        listings: {
          where: { status: 'PUBLISHED' },
          include: {
            destination: true,
            category: true,
            media: { where: { isCover: true }, take: 1 },
            discounts: { where: { isActive: true }, take: 1 }
          }
        },
        reviews: {
          where: { status: 'PUBLISHED' },
          include: {
            user: { select: { firstName: true, lastName: true, avatarUrl: true } },
            listing: { select: { title: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    return res.json({ success: true, data: provider });
  } catch (err) {
    next(err);
  }
};

export const getMyProviderProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const provider = await prisma.provider.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            listings: true,
            bookings: true,
            reviews: true,
          }
        }
      }
    });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'No provider profile associated with this user' });
    }

    return res.json({ success: true, data: provider });
  } catch (err) {
    next(err);
  }
};

const updateProfileSchema = z.object({
  businessName: z.string().min(2).optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});

export const updateMyProviderProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data = updateProfileSchema.parse(req.body);

    const provider = await prisma.provider.update({
      where: { userId },
      data,
    });

    return res.json({ success: true, message: 'Provider profile updated', data: provider });
  } catch (err) {
    next(err);
  }
};

const verificationSchema = z.object({
  tradeLicenseNo: z.string().min(3),
  taxId: z.string().min(3),
  verificationDocs: z.string(), // URLs or JSON string
});

export const submitVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data = verificationSchema.parse(req.body);

    const provider = await prisma.provider.update({
      where: { userId },
      data: {
        tradeLicenseNo: data.tradeLicenseNo,
        taxId: data.taxId,
        verificationDocs: data.verificationDocs,
        verificationStatus: 'PENDING',
        verificationNotes: 'Under administrative review',
      }
    });

    // Notify admins via AuditLog
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        actorRole: req.user!.role,
        action: 'PROVIDER_VERIFICATION_SUBMITTED',
        entityType: 'Provider',
        entityId: provider.id,
        metadata: JSON.stringify({ businessName: provider.businessName }),
      }
    });

    return res.json({
      success: true,
      message: 'Verification documents submitted successfully. Admin review in progress.',
      data: provider
    });
  } catch (err) {
    next(err);
  }
};

export const getProviderDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const provider = await prisma.provider.findUnique({
      where: { userId }
    });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    const providerId = provider.id;

    const [
      totalListings,
      pendingRequests,
      confirmedBookings,
      completedBookings,
      recentBookings,
      revenueResult
    ] = await Promise.all([
      prisma.listing.count({ where: { providerId } }),
      prisma.booking.count({ where: { providerId, status: 'PENDING' } }),
      prisma.booking.count({ where: { providerId, status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { providerId, status: 'COMPLETED' } }),
      prisma.booking.findMany({
        where: { providerId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          listing: { select: { title: true } }
        }
      }),
      prisma.booking.aggregate({
        where: { providerId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
        _sum: { finalPrice: true }
      })
    ]);

    return res.json({
      success: true,
      data: {
        providerId: provider.id,
        businessName: provider.businessName,
        verificationStatus: provider.verificationStatus,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        stats: {
          totalListings,
          pendingRequests,
          confirmedBookings,
          completedBookings,
          totalRevenue: revenueResult._sum.finalPrice || 0,
        },
        recentBookings
      }
    });
  } catch (err) {
    next(err);
  }
};
