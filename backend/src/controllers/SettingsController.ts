import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/SettingsService';
import { sendSuccess } from '../utils/api-response';

const settingsService = new SettingsService();

export class SettingsController {
  async getPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.getPublic();
      sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.getAll();
      sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.update(req.body);
      sendSuccess(res, settings, 200, 'Settings updated');
    } catch (error) {
      next(error);
    }
  }
}
