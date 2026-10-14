import { Router } from 'express';
import { getDestinations, getDestinationBySlug } from './destinations.controller';

const router = Router();

router.get('/', getDestinations);
router.get('/:slug', getDestinationBySlug);

export default router;
