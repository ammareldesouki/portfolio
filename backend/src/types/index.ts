import { Request } from 'express';
import { JwtPayload } from '../config/jwt';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
