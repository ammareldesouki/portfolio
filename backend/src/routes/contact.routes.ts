import { Router } from 'express';
import { ContactController } from '../controllers/ContactController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createContactSchema } from '../validators/contact';

const router = Router();
const controller = new ContactController();

router.post('/', validate(createContactSchema), controller.submit.bind(controller));
router.get('/', authMiddleware, controller.list.bind(controller));
router.patch('/:id/read', authMiddleware, controller.markAsRead.bind(controller));
router.delete('/:id', authMiddleware, controller.delete.bind(controller));

export default router;
