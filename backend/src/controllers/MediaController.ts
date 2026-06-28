import { Request, Response, NextFunction } from 'express';
import { MediaService } from '../services/MediaService';
import { sendSuccess, sendError } from '../utils/api-response';

const mediaService = new MediaService();

export class MediaController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        sendError(res, 'No file uploaded', 400);
        return;
      }
      const result = await mediaService.upload(req.file);
      sendSuccess(res, result, 201, 'File uploaded');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const publicId = req.params.publicId as string;
      await mediaService.delete(publicId);
      sendSuccess(res, null, 200, 'File deleted');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const files = await mediaService.list();
      sendSuccess(res, files);
    } catch (error) {
      next(error);
    }
  }
}
