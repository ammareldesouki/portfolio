import { Request, Response, NextFunction } from 'express';
import { ContactService } from '../services/ContactService';
import { sendSuccess, sendError, sendPaginated } from '../utils/api-response';

const contactService = new ContactService();

export class ContactController {
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.submit(req.body);
      sendSuccess(res, contact, 201, 'Message sent successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const pageStr = req.query.page as string | undefined;
      const limitStr = req.query.limit as string | undefined;
      const readStr = req.query.read as string | undefined;
      const page = pageStr ? parseInt(pageStr) : 1;
      const limit = limitStr ? parseInt(limitStr) : 20;
      const readFilter = readStr !== undefined ? readStr === 'true' : undefined;
      const { data, total } = await contactService.list(page, limit, readFilter);
      sendPaginated(res, data, page, limit, total);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.markAsRead(req.params.id as string);
      sendSuccess(res, contact, 200, 'Marked as read');
    } catch (error) {
      if (error instanceof Error && error.message === 'Contact inquiry not found') {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await contactService.delete(req.params.id as string);
      sendSuccess(res, null, 200, 'Inquiry deleted');
    } catch (error) {
      if (error instanceof Error && error.message === 'Contact inquiry not found') {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }
}
