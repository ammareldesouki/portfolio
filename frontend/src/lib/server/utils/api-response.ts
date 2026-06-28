import { NextResponse } from 'next/server';
import type { ApiResponse } from '../types';

export function sendSuccess<T>(data: T, statusCode = 200, message?: string) {
  const response: ApiResponse<T> = { success: true, data, message };
  return NextResponse.json(response, { status: statusCode });
}

export function sendError(error: string, statusCode = 500) {
  const response: ApiResponse = { success: false, error };
  return NextResponse.json(response, { status: statusCode });
}

export function sendPaginated<T>(data: T[], page: number, limit: number, total: number) {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
  return NextResponse.json(response, { status: 200 });
}
