import { Router } from 'express';
import {
  getPublicProviders,
  getProviderById,
  getMyProviderProfile,
  updateMyProviderProfile,
  submitVerification,
  getProviderDashboardStats,
} from './providers.controller';
import { authenticate, requireProvider } from '../../middleware/auth';

const router = Router();

// Public endpoints
router.get('/', getPublicProviders);
router.get('/:id', getProviderById);

// Protected provider endpoints
router.get('/me/profile', authenticate, requireProvider, getMyProviderProfile);
router.put('/me/profile', authenticate, requireProvider, updateMyProviderProfile);
router.post('/me/verify', authenticate, requireProvider, submitVerification);
router.get('/me/dashboard', authenticate, requireProvider, getProviderDashboardStats);

export default router;
