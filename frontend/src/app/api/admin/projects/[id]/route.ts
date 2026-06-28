import { NextRequest } from 'next/server';
import { connectDatabase } from '@/lib/server/config/database';
import { ProjectService } from '@/lib/server/services/ProjectService';
import { updateProjectSchema } from '@/lib/server/validators/project';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';
import { getAuthUser } from '@/lib/server/middleware/auth';
import { IProject } from '@/lib/server/models/Project';

const projectService = new ProjectService();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    const body = await request.json();
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return sendError(messages, 400);
    }
    const cleanData = parsed.data as unknown as Partial<IProject>;
    const project = await projectService.update(params.id, cleanData);
    return sendSuccess(project, 200, 'Project updated');
  } catch (error) {
    if (error instanceof Error && error.message === 'Project not found') {
      return sendError(error.message, 404);
    }
    return sendError('Internal server error', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    await projectService.delete(params.id);
    return sendSuccess(null, 200, 'Project deleted');
  } catch (error) {
    if (error instanceof Error && error.message === 'Project not found') {
      return sendError(error.message, 404);
    }
    return sendError('Internal server error', 500);
  }
}
