import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { position } = req.query;
    const where: any = { isActive: true };
    if (position) where.position = String(position);

    const banners = await prisma.cMSBanner.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    });

    return res.json({ success: true, data: banners });
  } catch (err) {
    next(err);
  }
};

export const createBanner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const bannerSchema = z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      tag: z.string().optional(),
      imageUrl: z.string().url(),
      linkUrl: z.string().optional(),
      position: z.string().default('HOMEPAGE_HERO'),
      sortOrder: z.number().default(0),
    });

    const data = bannerSchema.parse(req.body);
    const banner = await prisma.cMSBanner.create({ data });

    return res.status(201).json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
};

export const getStaticPages = async (req: Request, res: Response) => {
  // Pre-configured CMS content for Help/FAQs, About, Terms, Privacy
  const cmsPages = {
    about: {
      title: "About Our Platform",
      tagline: "Connecting Travelers with Verified Regional Operators",
      mission: "To establish a transparent, high-trust marketplace platform where adventurers, holidaymakers, and corporate groups easily discover, compare, and book verified service providers with complete confidence.",
      values: [
        { title: "Rigorous Verification", desc: "Every service provider is checked for business licenses, operating history, and safety compliance before approval." },
        { title: "Direct Communication", desc: "Seamless in-platform messaging allows real-time clarification, custom dates, and transparent quote coordination." },
        { title: "Fair Pricing & No Hidden Fees", desc: "All prices, inclusions, discounts, and cancellation policies are published openly." }
      ]
    },
    faq: [
      {
        question: "How does the booking and enquiry workflow work?",
        answer: "When you find a package or provider offering you like, click 'Request Booking / Enquiry'. Specify your desired dates, guest count, and any custom requirements. The verified provider is notified instantly to review your request, confirm availability, and respond directly via in-platform messaging."
      },
      {
        question: "How do provider verifications work?",
        answer: "Our operations team manually audits every provider before they can publish listings. Providers submit NTN/tax registration, trade licenses, valid CNICs/IDs, and safety accreditations."
      },
      {
        question: "Can I cancel or modify my booking request?",
        answer: "Yes. From your Customer Dashboard under 'My Bookings', you can cancel any pending request or request a reschedule through provider messaging in accordance with the listing's cancellation policy."
      },
      {
        question: "How do customer reviews work?",
        answer: "Only customers with completed bookings can submit star ratings and written reviews. This guarantees that all ratings represent authentic customer experiences without provider manipulation."
      }
    ],
    terms: {
      title: "Terms and Conditions",
      lastUpdated: "2026-10-14",
      content: "These terms govern access and use of the Multi-Provider Marketplace. All users, providers, and partners agree to ethical operations, transparent communication, and non-circumvention policies."
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "2026-10-14",
      content: "We protect user privacy in accordance with global data protection guidelines. Customer phone numbers and contact details are disclosed only upon booking confirmation to ensure transaction fulfillment."
    }
  };

  return res.json({ success: true, data: cmsPages });
};
