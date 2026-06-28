import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/project';

const router = Router();
const controller = new ProjectController();

router.get('/', controller.list.bind(controller));
router.get('/featured', controller.getFeatured.bind(controller));
router.get('/detail/:id', authMiddleware, controller.getById.bind(controller));
router.get('/:slug', controller.getBySlug.bind(controller));
router.post('/', authMiddleware, validate(createProjectSchema), controller.create.bind(controller));
router.put('/:id', authMiddleware, validate(updateProjectSchema), controller.update.bind(controller));
router.delete('/:id', authMiddleware, controller.delete.bind(controller));

export default router;
