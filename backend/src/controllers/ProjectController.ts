import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/ProjectService';
import { sendSuccess, sendError, sendPaginated } from '../utils/api-response';

const projectService = new ProjectService();

export class ProjectController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page as string | undefined;
      const limit = req.query.limit as string | undefined;
      const status = req.query.status as string | undefined;
      const featured = req.query.featured as string | undefined;
      const category = req.query.category as string | undefined;
      const sort = req.query.sort as string | undefined;
      const { data, total } = await projectService.list({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 12,
        status,
        featured: featured !== undefined ? featured === 'true' : undefined,
        category,
        sort,
      });
      sendPaginated(res, data, page ? parseInt(page) : 1, limit ? parseInt(limit) : 12, total);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getBySlug(req.params.slug as string);
      sendSuccess(res, project);
    } catch (error) {
      if (error instanceof Error && error.message === 'Project not found') {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getById(req.params.id as string);
      sendSuccess(res, project);
    } catch (error) {
      if (error instanceof Error && error.message === 'Project not found') {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.create(req.body);
      sendSuccess(res, project, 201, 'Project created');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.update(req.params.id as string, req.body);
      sendSuccess(res, project, 200, 'Project updated');
    } catch (error) {
      if (error instanceof Error && error.message === 'Project not found') {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.delete(req.params.id as string);
      sendSuccess(res, null, 200, 'Project deleted');
    } catch (error) {
      if (error instanceof Error && error.message === 'Project not found') {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await projectService.getFeatured();
      sendSuccess(res, projects);
    } catch (error) {
      next(error);
    }
  }
}
