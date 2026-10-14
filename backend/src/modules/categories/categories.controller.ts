import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            listings: { where: { status: 'PUBLISHED' } }
          }
        }
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }]
    });

    return res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        listings: {
          where: { status: 'PUBLISHED' },
          include: {
            destination: true,
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

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};
