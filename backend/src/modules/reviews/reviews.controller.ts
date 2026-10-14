import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';

const submitReviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3),
  comment: z.string().min(10),
});

export const submitReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = submitReviewSchema.parse(req.body);
    const userId = req.user!.id;

    // Verify booking belongs to user and is COMPLETED
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { review: true }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: can only review your own bookings' });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for COMPLETED bookings'
      });
    }

    if (booking.review) {
      return res.status(409).json({ success: false, message: 'Review already submitted for this booking' });
    }

    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        userId,
        providerId: booking.providerId,
        listingId: booking.listingId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        status: 'PUBLISHED',
      }
    });

    // Recalculate listing rating
    const listingReviews = await prisma.review.findMany({
      where: { listingId: booking.listingId, status: 'PUBLISHED' }
    });
    const avgListingRating = listingReviews.reduce((sum, r) => sum + r.rating, 0) / listingReviews.length;

    await prisma.listing.update({
      where: { id: booking.listingId },
      data: {
        rating: parseFloat(avgListingRating.toFixed(1)),
        reviewCount: listingReviews.length,
      }
    });

    // Recalculate provider rating
    const providerReviews = await prisma.review.findMany({
      where: { providerId: booking.providerId, status: 'PUBLISHED' }
    });
    const avgProviderRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;

    await prisma.provider.update({
      where: { id: booking.providerId },
      data: {
        rating: parseFloat(avgProviderRating.toFixed(1)),
        reviewCount: providerReviews.length,
      }
    });

    // Create notification for provider
    const provider = await prisma.provider.findUnique({ where: { id: booking.providerId } });
    if (provider) {
      await prisma.notification.create({
        data: {
          userId: provider.userId,
          title: `New ${data.rating}-Star Review Received`,
          message: `${req.user!.firstName} left a review: "${data.title}"`,
          type: 'REVIEW',
          link: `/provider/dashboard`,
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Review published successfully',
      data: review
    });
  } catch (err) {
    next(err);
  }
};

export const reportReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Report reason is required' });
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        status: 'REPORTED',
        reportReason: reason,
      }
    });

    return res.json({ success: true, message: 'Review reported for administrative moderation', data: review });
  } catch (err) {
    next(err);
  }
};

export const providerRespondToReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const userId = req.user!.id;

    const provider = await prisma.provider.findUnique({ where: { userId } });
    if (!provider) {
      return res.status(403).json({ success: false, message: 'Provider profile required' });
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review || review.providerId !== provider.id) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { providerResponse: response }
    });

    return res.json({ success: true, message: 'Provider response added', data: updated });
  } catch (err) {
    next(err);
  }
};
