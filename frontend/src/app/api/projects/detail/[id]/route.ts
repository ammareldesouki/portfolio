import { NextRequest } from 'next/server';
import { connectDatabase } from '@/lib/server/config/database';
import { ProjectService } from '@/lib/server/services/ProjectService';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';
import { getAuthUser } from '@/lib/server/middleware/auth';

const projectService = new ProjectService();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    const project = await projectService.getById(params.id);
    return sendSuccess(project);
  } catch (error) {
    if (error instanceof Error && error.message === 'Project not found') {
      return sendError(error.message, 404);
    }
    return sendError('Internal server error', 500);
  }
}
