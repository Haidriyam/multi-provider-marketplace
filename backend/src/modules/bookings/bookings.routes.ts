import { Router } from 'express';
import {
  createBookingRequest,
  getCustomerBookings,
  getProviderBookings,
  getBookingDetails,
  updateBookingStatus,
  addBookingMessage,
} from './bookings.controller';
import { authenticate, requireProvider } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createBookingRequest);
router.get('/customer', getCustomerBookings);
router.get('/provider', requireProvider, getProviderBookings);
router.get('/:id', getBookingDetails);
router.patch('/:id/status', updateBookingStatus);
router.post('/:id/messages', addBookingMessage);

export default router;
