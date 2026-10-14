import { Router } from 'express';
import { submitReview, reportReview, providerRespondToReview } from './reviews.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', submitReview);
router.post('/:id/report', reportReview);
router.post('/:id/respond', providerRespondToReview);

export default router;
