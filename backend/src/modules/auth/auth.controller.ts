import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { config } from '../../config';
import { AuthenticatedRequest } from '../../middleware/auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'PROVIDER']).default('CUSTOMER'),
  // Optional provider fields if registering as provider
  businessName: z.string().optional(),
  tradeLicenseNo: z.string().optional(),
  taxId: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        ...(data.role === 'PROVIDER' && data.businessName ? {
          providerProfile: {
            create: {
              businessName: data.businessName,
              tradeLicenseNo: data.tradeLicenseNo,
              taxId: data.taxId,
              city: data.city || 'Lahore',
              country: data.country || 'Pakistan',
              phone: data.phone || '',
              email: data.email.toLowerCase(),
              verificationStatus: 'PENDING',
              rating: 5.0,
            }
          }
        } : {})
      },
      include: { providerProfile: true }
    });

    // Create a welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to the Platform!',
        message: data.role === 'PROVIDER' 
          ? 'Your provider account has been registered. Please upload your verification documents to start publishing listings.' 
          : 'Welcome! Discover verified packages and seamless bookings across premier destinations.',
        type: 'INFO',
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          providerId: user.providerProfile?.id,
          verificationStatus: user.providerProfile?.verificationStatus,
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { providerProfile: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatarUrl: user.avatarUrl,
          providerId: user.providerProfile?.id,
          verificationStatus: user.providerProfile?.verificationStatus,
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        providerProfile: true,
        _count: {
          select: {
            bookings: true,
            favourites: true,
            notifications: { where: { read: false } }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        provider: user.providerProfile,
        counts: user._count,
      }
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  // Mock password reset link logic matching Phase 1 scope
  return res.json({
    success: true,
    message: `If an account with ${email} exists, a password reset link has been dispatched to your inbox.`
  });
};
