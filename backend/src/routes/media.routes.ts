import { Router } from 'express';
import { MediaController } from '../controllers/MediaController';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();
const controller = new MediaController();

router.post('/upload', authMiddleware, upload.single('file'), controller.upload.bind(controller));
router.delete('/:publicId', authMiddleware, controller.delete.bind(controller));
router.get('/', authMiddleware, controller.list.bind(controller));

export default router;
