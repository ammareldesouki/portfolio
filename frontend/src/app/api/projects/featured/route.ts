import { connectDatabase } from '@/lib/server/config/database';
import { ProjectService } from '@/lib/server/services/ProjectService';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';

const projectService = new ProjectService();

export async function GET() {
  try {
    await connectDatabase();
    const projects = await projectService.getFeatured();
    return sendSuccess(projects);
  } catch {
    return sendError('Internal server error', 500);
  }
}
