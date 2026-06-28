import { Router } from 'express';
import { SettingsController } from '../controllers/SettingsController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateSettingsSchema } from '../validators/settings';

const router = Router();
const controller = new SettingsController();

router.get('/public', controller.getPublic.bind(controller));
router.get('/', authMiddleware, controller.getAll.bind(controller));
router.put('/', authMiddleware, validate(updateSettingsSchema), controller.update.bind(controller));

export default router;
