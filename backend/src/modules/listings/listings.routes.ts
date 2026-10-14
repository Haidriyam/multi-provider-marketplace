import { Router } from 'express';
import {
  searchListings,
  getListingBySlugOrId,
  createListing,
  getMyProviderListings,
  updateListingStatus,
} from './listings.controller';
import { authenticate, requireProvider } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/', searchListings);
router.get('/:idOrSlug', getListingBySlugOrId);

// Provider protected routes
router.post('/', authenticate, requireProvider, createListing);
router.get('/provider/mine', authenticate, requireProvider, getMyProviderListings);
router.patch('/:id/status', authenticate, requireProvider, updateListingStatus);

export default router;
