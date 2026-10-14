import { Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';

const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const userId = req.user!.id;

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
      }
    });

    return res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const getFavorites = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const favorites = await prisma.favourite.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            destination: true,
            category: true,
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
              where: { isCover: true },
              take: 1
            },
            discounts: {
              where: { isActive: true },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: favorites.map(f => f.listing) });
  } catch (err) {
    next(err);
  }
};

export const toggleFavorite = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ success: false, message: 'listingId is required' });
    }

    const existing = await prisma.favourite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId
        }
      }
    });

    if (existing) {
      await prisma.favourite.delete({
        where: { id: existing.id }
      });
      return res.json({ success: true, isFavorited: false, message: 'Removed from favorites' });
    } else {
      await prisma.favourite.create({
        data: { userId, listingId }
      });
      return res.json({ success: true, isFavorited: true, message: 'Added to favorites' });
    }
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true }
      });
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    await prisma.notification.update({
      where: { id, userId },
      data: { read: true }
    });

    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
};

export const createSupportTicket = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { subject, description, priority } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'Subject and description are required' });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        description,
        priority: priority || 'NORMAL',
      }
    });

    return res.status(201).json({ success: true, data: ticket, message: 'Support ticket submitted' });
  } catch (err) {
    next(err);
  }
};
