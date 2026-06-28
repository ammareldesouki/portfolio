import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../validators/auth';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), controller.login.bind(controller));

export default router;
