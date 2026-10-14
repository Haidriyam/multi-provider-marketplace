import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';

export const getDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { featuredOnly } = req.query;
    const where: any = {};
    if (featuredOnly === 'true') {
      where.isFeatured = true;
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        _count: {
          select: {
            listings: { where: { status: 'PUBLISHED' } }
          }
        }
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }]
    });

    return res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
};

export const getDestinationBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        listings: {
          where: { status: 'PUBLISHED' },
          include: {
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
            media: { where: { isCover: true }, take: 1 },
            discounts: { where: { isActive: true }, take: 1 }
          }
        }
      }
    });

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    return res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
};
