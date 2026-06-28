import { NextRequest } from 'next/server';
import { connectDatabase } from '@/lib/server/config/database';
import { MediaService } from '@/lib/server/services/MediaService';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';
import { getAuthUser } from '@/lib/server/middleware/auth';

const mediaService = new MediaService();

export async function DELETE(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    await mediaService.delete(params.filename);
    return sendSuccess(null, 200, 'File deleted');
  } catch {
    return sendError('Internal server error', 500);
  }
}
