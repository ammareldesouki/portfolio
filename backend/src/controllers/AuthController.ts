import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { sendSuccess, sendError } from '../utils/api-response';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, result, 200, 'Login successful');
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid email or password') {
        sendError(res, error.message, 401);
        return;
      }
      next(error);
    }
  }
}
