import { Router } from 'express';
import { getBanners, createBanner, getStaticPages } from './content.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

router.get('/banners', getBanners);
router.post('/banners', authenticate, requireAdmin, createBanner);
router.get('/pages', getStaticPages);

export default router;
