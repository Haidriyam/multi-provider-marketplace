import { Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';

const createBookingSchema = z.object({
  listingId: z.string(),
  packageId: z.string().optional(),
  startDate: z.string(), // YYYY-MM-DD
  endDate: z.string().optional(),
  guestsCount: z.number().int().positive().default(1),
  customerNotes: z.string().optional(),
});

export const createBookingRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = createBookingSchema.parse(req.body);
    const userId = req.user!.id;

    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
      include: {
        provider: true,
        packages: true,
        discounts: {
          where: { isActive: true },
          take: 1,
        }
      }
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.status !== 'PUBLISHED') {
      return res.status(400).json({ success: false, message: 'Listing is not available for booking' });
    }

    // Determine unit price: package price or listing base price
    let unitPrice = listing.basePrice;
    if (data.packageId) {
      const selectedPkg = listing.packages.find(p => p.id === data.packageId);
      if (selectedPkg) {
        unitPrice = selectedPkg.discountedPrice || selectedPkg.price;
      }
    }

    const totalPrice = unitPrice * data.guestsCount;
    let discountAmount = 0;

    // Check listing level discount if no package discount
    if (listing.discounts.length > 0) {
      const activeDiscount = listing.discounts[0];
      if (activeDiscount.percentage > 0) {
        discountAmount = (totalPrice * activeDiscount.percentage) / 100;
      } else if (activeDiscount.fixedAmount > 0) {
        discountAmount = activeDiscount.fixedAmount;
      }
    }

    const finalPrice = Math.max(0, totalPrice - discountAmount);
    const bookingReference = `BK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        userId,
        providerId: listing.providerId,
        listingId: listing.id,
        packageId: data.packageId,
        startDate: data.startDate,
        endDate: data.endDate || data.startDate,
        guestsCount: data.guestsCount,
        unitPrice,
        totalPrice,
        discountAmount,
        finalPrice,
        currency: listing.currency,
        status: 'PENDING',
        customerNotes: data.customerNotes,
        items: {
          create: [
            {
              description: `${listing.title} (${data.guestsCount} guests)`,
              quantity: data.guestsCount,
              unitPrice,
              totalPrice,
            }
          ]
        }
      },
      include: {
        listing: { select: { title: true } },
        provider: { select: { businessName: true, user: { select: { id: true } } } }
      }
    });

    // Notify provider
    await prisma.notification.create({
      data: {
        userId: listing.provider.userId,
        title: 'New Booking Request Received',
        message: `You received request #${bookingReference} for "${listing.title}" from ${req.user!.firstName} ${req.user!.lastName}.`,
        type: 'BOOKING_UPDATE',
        link: `/provider/bookings?id=${booking.id}`,
      }
    });

    // Notify customer
    await prisma.notification.create({
      data: {
        userId,
        title: 'Booking Request Submitted',
        message: `Your booking request #${bookingReference} for "${listing.title}" has been submitted to ${listing.provider.businessName}.`,
        type: 'BOOKING_UPDATE',
        link: `/account/bookings?id=${booking.id}`,
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

export const getCustomerBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { userId };
    if (status && status !== 'ALL') {
      where.status = String(status).toUpperCase();
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        listing: {
          include: {
            destination: true,
            media: { where: { isCover: true }, take: 1 }
          }
        },
        provider: {
          select: {
            id: true,
            businessName: true,
            phone: true,
            email: true,
            logoUrl: true,
            verificationStatus: true,
          }
        },
        package: true,
        review: true,
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const getProviderBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const provider = await prisma.provider.findUnique({
      where: { userId }
    });

    if (!provider) {
      return res.status(403).json({ success: false, message: 'Provider profile required' });
    }

    const where: any = { providerId: provider.id };
    if (status && status !== 'ALL') {
      where.status = String(status).toUpperCase();
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          }
        },
        listing: {
          select: {
            id: true,
            title: true,
            durationDays: true,
            media: { where: { isCover: true }, take: 1 }
          }
        },
        package: true,
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const getBookingDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        provider: { select: { id: true, userId: true, businessName: true, phone: true, email: true, verificationStatus: true } },
        listing: {
          include: {
            destination: true,
            category: true,
            media: { where: { isCover: true }, take: 1 }
          }
        },
        package: true,
        items: true,
        transactions: true,
        review: true,
        messages: {
          include: {
            sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Access control: customer, provider of booking, or admin
    const isCustomer = booking.userId === userId;
    const isBookingProvider = booking.provider.userId === userId;
    const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT'].includes(role);

    if (!isCustomer && !isBookingProvider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this booking' });
    }

    return res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED']),
  notes: z.string().optional(),
  reason: z.string().optional(),
});

export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes, reason } = updateStatusSchema.parse(req.body);
    const userId = req.user!.id;
    const role = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: true,
        listing: true,
      }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isCustomer = booking.userId === userId;
    const isBookingProvider = booking.provider.userId === userId;
    const isAdmin = ['SUPER_ADMIN', 'OPERATIONS_ADMIN'].includes(role);

    // Business rules:
    // - Customer can only CANCEL
    // - Provider can CONFIRM, REJECT, or mark COMPLETED
    // - Admin can override any status
    if (isCustomer && status !== 'CANCELLED') {
      return res.status(403).json({ success: false, message: 'Customers can only cancel bookings' });
    }

    if (!isCustomer && !isBookingProvider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (isBookingProvider) {
      if (notes) updateData.providerNotes = notes;
      if (status === 'REJECTED') updateData.rejectionReason = reason || notes;
    }

    if (isCustomer && status === 'CANCELLED') {
      updateData.cancellationReason = reason || notes || 'Customer requested cancellation';
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    // Notify customer
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: `Booking #${booking.bookingReference} Updated`,
        message: `Your booking status is now ${status}. ${reason ? `Reason: ${reason}` : ''}`,
        type: 'BOOKING_UPDATE',
        link: `/account/bookings?id=${booking.id}`,
      }
    });

    // Notify provider if customer cancelled
    if (isCustomer && status === 'CANCELLED') {
      await prisma.notification.create({
        data: {
          userId: booking.provider.userId,
          title: `Booking #${booking.bookingReference} Cancelled`,
          message: `Customer cancelled booking #${booking.bookingReference}.`,
          type: 'BOOKING_UPDATE',
          link: `/provider/bookings?id=${booking.id}`,
        }
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        actorRole: role,
        action: `BOOKING_STATUS_${status}`,
        entityType: 'Booking',
        entityId: booking.id,
        metadata: JSON.stringify({ previousStatus: booking.status, newStatus: status, reason }),
      }
    });

    return res.json({ success: true, message: `Booking status updated to ${status}`, data: updated });
  } catch (err) {
    next(err);
  }
};

export const addBookingMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // bookingId
    const { message } = req.body;
    const userId = req.user!.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: true,
      }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    let receiverId: string;
    if (booking.userId === userId) {
      receiverId = booking.provider.userId;
    } else if (booking.provider.userId === userId) {
      receiverId = booking.userId;
    } else {
      return res.status(403).json({ success: false, message: 'Not a party to this booking' });
    }

    const newMessage = await prisma.message.create({
      data: {
        bookingId: booking.id,
        senderId: userId,
        receiverId,
        message: message.trim(),
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true }
        }
      }
    });

    // Send notification to receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: `New message on #${booking.bookingReference}`,
        message: `${req.user!.firstName}: ${message.length > 50 ? message.substring(0, 47) + '...' : message}`,
        type: 'SYSTEM',
        link: req.user!.role === 'PROVIDER' ? `/account/bookings?id=${booking.id}` : `/provider/bookings?id=${booking.id}`
      }
    });

    return res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    next(err);
  }
};
