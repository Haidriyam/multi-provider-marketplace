import { Router } from 'express';
import { updateProfile, getFavorites, toggleFavorite, getNotifications, markNotificationRead, createSupportTicket } from './users.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.put('/profile', updateProfile);
router.get('/favorites', getFavorites);
router.post('/favorites', toggleFavorite);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.post('/support-tickets', createSupportTicket);

export default router;
