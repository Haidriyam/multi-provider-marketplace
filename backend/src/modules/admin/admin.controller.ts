import { Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';

// 1. ANALYTICS & KPIS
export const getAdminOverview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalProviders,
      pendingProviders,
      totalListings,
      pendingListings,
      totalBookings,
      completedBookings,
      reportedReviews,
      revenueResult,
      recentAuditLogs,
      popularDestinations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.provider.count(),
      prisma.provider.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'PENDING_APPROVAL' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.review.count({ where: { status: 'REPORTED' } }),
      prisma.booking.aggregate({
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
        _sum: { finalPrice: true }
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { firstName: true, lastName: true, email: true, role: true } } }
      }),
      prisma.destination.findMany({
        take: 5,
        orderBy: { listings: { _count: 'desc' } },
        include: { _count: { select: { listings: true } } }
      })
    ]);

    return res.json({
      success: true,
      data: {
        kpis: {
          totalUsers,
          totalCustomers,
          totalProviders,
          pendingProviders,
          totalListings,
          pendingListings,
          totalBookings,
          completedBookings,
          reportedReviews,
          totalGMV: revenueResult._sum.finalPrice || 0,
        },
        recentAuditLogs,
        popularDestinations
      }
    });
  } catch (err) {
    next(err);
  }
};

// 2. USER MANAGEMENT
export const getUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { search, role, status, limit = '20', page = '1' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: String(search) } },
        { firstName: { contains: String(search) } },
        { lastName: { contains: String(search) } },
      ];
    }
    if (role && role !== 'ALL') where.role = String(role);
    if (status) where.isActive = status === 'active';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          providerProfile: { select: { id: true, businessName: true, verificationStatus: true } },
          _count: { select: { bookings: true, reviews: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return res.json({
      success: true,
      data: users,
      meta: { total, page: parseInt(page as string, 10), limit: take }
    });
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;
    const adminId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updateData: any = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (role) updateData.role = role;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        actorRole: req.user!.role,
        action: 'USER_UPDATED',
        entityType: 'User',
        entityId: id,
        metadata: JSON.stringify({ changes: updateData }),
      }
    });

    return res.json({ success: true, message: 'User status updated', data: updated });
  } catch (err) {
    next(err);
  }
};

// 3. PROVIDER MODERATION
export const getAdminProviders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, search, limit = '20', page = '1' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {};
    if (status && status !== 'ALL') where.verificationStatus = String(status);
    if (search) where.businessName = { contains: String(search) };

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        take,
        skip,
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          _count: { select: { listings: true, bookings: true } }
        },
        orderBy: { createdAt: 'desc' }
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

export const verifyProvider = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = z.object({
      status: z.enum(['APPROVED', 'REJECTED', 'SUSPENDED']),
      notes: z.string().optional()
    }).parse(req.body);

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    const updated = await prisma.provider.update({
      where: { id },
      data: {
        verificationStatus: status,
        verificationNotes: notes || `Provider ${status.toLowerCase()} by administrative review.`,
      }
    });

    // Notify provider
    await prisma.notification.create({
      data: {
        userId: provider.userId,
        title: `Provider Verification: ${status}`,
        message: status === 'APPROVED'
          ? 'Congratulations! Your business verification has been approved. You can now publish marketplace listings.'
          : `Your verification status is ${status}. Note: ${notes || 'Contact support for details.'}`,
        type: 'VERIFICATION',
        link: '/provider/dashboard',
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        actorRole: req.user!.role,
        action: `PROVIDER_${status}`,
        entityType: 'Provider',
        entityId: id,
        metadata: JSON.stringify({ businessName: provider.businessName, notes }),
      }
    });

    return res.json({ success: true, message: `Provider verification status updated to ${status}`, data: updated });
  } catch (err) {
    next(err);
  }
};

// 4. LISTING MODERATION
export const getAdminListings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, search, limit = '20', page = '1' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {};
    if (status && status !== 'ALL') where.status = String(status);
    if (search) where.title = { contains: String(search) };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        take,
        skip,
        include: {
          provider: { select: { businessName: true, verificationStatus: true } },
          destination: { select: { name: true } },
          category: { select: { name: true } },
          media: { where: { isCover: true }, take: 1 },
          _count: { select: { bookings: true, reviews: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.listing.count({ where })
    ]);

    return res.json({
      success: true,
      data: listings,
      meta: { total, page: parseInt(page as string, 10), limit: take }
    });
  } catch (err) {
    next(err);
  }
};

export const moderateListing = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, isFeatured, featuredPriority } = z.object({
      status: z.enum(['PUBLISHED', 'REJECTED', 'SUSPENDED', 'DRAFT']).optional(),
      rejectionReason: z.string().optional(),
      isFeatured: z.boolean().optional(),
      featuredPriority: z.number().int().optional(),
    }).parse(req.body);

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { provider: true }
    });

    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    const updateData: any = {};
    if (status) updateData.status = status;
    if (rejectionReason) updateData.rejectionReason = rejectionReason;
    if (typeof isFeatured === 'boolean') updateData.isFeatured = isFeatured;
    if (typeof featuredPriority === 'number') updateData.featuredPriority = featuredPriority;

    const updated = await prisma.listing.update({
      where: { id },
      data: updateData,
    });

    if (status) {
      await prisma.notification.create({
        data: {
          userId: listing.provider.userId,
          title: `Listing Moderation Update: ${listing.title}`,
          message: status === 'PUBLISHED'
            ? `Your listing "${listing.title}" is now LIVE on the marketplace.`
            : `Your listing status has changed to ${status}. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
          type: 'INFO',
          link: '/provider/listings',
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        actorRole: req.user!.role,
        action: `LISTING_MODERATED_${status || 'UPDATE'}`,
        entityType: 'Listing',
        entityId: id,
        metadata: JSON.stringify(updateData),
      }
    });

    return res.json({ success: true, message: 'Listing moderation applied', data: updated });
  } catch (err) {
    next(err);
  }
};

// 5. REVIEW MODERATION
export const getAdminReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, limit = '20', page = '1' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {};
    if (status && status !== 'ALL') where.status = String(status);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        take,
        skip,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          provider: { select: { businessName: true } },
          listing: { select: { title: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where })
    ]);

    return res.json({
      success: true,
      data: reviews,
      meta: { total, page: parseInt(page as string, 10), limit: take }
    });
  } catch (err) {
    next(err);
  }
};

export const moderateReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = z.object({
      status: z.enum(['PUBLISHED', 'HIDDEN'])
    }).parse(req.body);

    const review = await prisma.review.update({
      where: { id },
      data: { status }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        actorRole: req.user!.role,
        action: `REVIEW_STATUS_${status}`,
        entityType: 'Review',
        entityId: id,
        metadata: JSON.stringify({ newStatus: status }),
      }
    });

    return res.json({ success: true, message: `Review status changed to ${status}`, data: review });
  } catch (err) {
    next(err);
  }
};

// 6. ALL BOOKINGS MASTER VIEW
export const getAdminBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, search, limit = '20', page = '1' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {};
    if (status && status !== 'ALL') where.status = String(status);
    if (search) {
      where.OR = [
        { bookingReference: { contains: String(search) } },
        { user: { email: { contains: String(search) } } },
        { provider: { businessName: { contains: String(search) } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        take,
        skip,
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          provider: { select: { businessName: true } },
          listing: { select: { title: true } },
          package: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.booking.count({ where })
    ]);

    return res.json({
      success: true,
      data: bookings,
      meta: { total, page: parseInt(page as string, 10), limit: take }
    });
  } catch (err) {
    next(err);
  }
};

// 7. AUDIT LOGS
export const getAuditLogs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { limit = '50', page = '1' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        take,
        skip,
        include: {
          actor: { select: { firstName: true, lastName: true, email: true, role: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count()
    ]);

    return res.json({
      success: true,
      data: logs,
      meta: { total, page: parseInt(page as string, 10), limit: take }
    });
  } catch (err) {
    next(err);
  }
};
