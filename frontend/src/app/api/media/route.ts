import { NextRequest } from 'next/server';
import { connectDatabase } from '@/lib/server/config/database';
import { MediaService } from '@/lib/server/services/MediaService';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';
import { getAuthUser } from '@/lib/server/middleware/auth';

const mediaService = new MediaService();

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    const files = await mediaService.list();
    return sendSuccess(files);
  } catch {
    return sendError('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return sendError('No file provided', 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mediaService.upload(file.name, buffer, file.type);
    return sendSuccess(result, 201);
  } catch {
    return sendError('Internal server error', 500);
  }
}
