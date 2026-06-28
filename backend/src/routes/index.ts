import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import contactRoutes from './contact.routes';
import settingsRoutes from './settings.routes';
import mediaRoutes from './media.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);
router.use('/media', mediaRoutes);

export default router;
