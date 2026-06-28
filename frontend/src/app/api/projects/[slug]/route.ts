import { NextRequest } from 'next/server';
import { connectDatabase } from '@/lib/server/config/database';
import { ProjectService } from '@/lib/server/services/ProjectService';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';

const projectService = new ProjectService();

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDatabase();
    const project = await projectService.getBySlug(params.slug);
    return sendSuccess(project);
  } catch (error) {
    if (error instanceof Error && error.message === 'Project not found') {
      return sendError(error.message, 404);
    }
    return sendError('Internal server error', 500);
  }
}
