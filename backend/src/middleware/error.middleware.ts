import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/api-response';
import { ZodError } from 'zod';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    sendError(res, messages, 400);
    return;
  }

  console.error('[ERROR]', err);
  sendError(res, err.message || 'Internal server error', 500);
}
