import { Router } from 'express';
import {
  getAdminOverview,
  getUsers,
  toggleUserStatus,
  getAdminProviders,
  verifyProvider,
  getAdminListings,
  moderateListing,
  getAdminReviews,
  moderateReview,
  getAdminBookings,
  getAuditLogs,
} from './admin.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/overview', getAdminOverview);
router.get('/users', getUsers);
router.patch('/users/:id', toggleUserStatus);
router.get('/providers', getAdminProviders);
router.patch('/providers/:id/verify', verifyProvider);
router.get('/listings', getAdminListings);
router.patch('/listings/:id/moderate', moderateListing);
router.get('/reviews', getAdminReviews);
router.patch('/reviews/:id/moderate', moderateReview);
router.get('/bookings', getAdminBookings);
router.get('/audit-logs', getAuditLogs);

export default router;
