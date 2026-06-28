import { NextRequest } from 'next/server';
import { connectDatabase } from '@/lib/server/config/database';
import { ProjectService } from '@/lib/server/services/ProjectService';
import { createProjectSchema } from '@/lib/server/validators/project';
import { sendSuccess, sendError, sendPaginated } from '@/lib/server/utils/api-response';
import { getAuthUser } from '@/lib/server/middleware/auth';
import { IProject } from '@/lib/server/models/Project';

const projectService = new ProjectService();

export async function GET(request: NextRequest) {
  try {
    await connectDatabase();
    const { searchParams } = new URL(request.url);
    const query = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      status: searchParams.get('status') || undefined,
      featured: searchParams.get('featured') !== null ? searchParams.get('featured') === 'true' : undefined,
      category: searchParams.get('category') || undefined,
      sort: searchParams.get('sort') || undefined,
    };
    const { data, total } = await projectService.list(query);
    return sendPaginated(data, query.page || 1, query.limit || 12, total);
  } catch {
    return sendError('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return sendError(messages, 400);
    }
    const cleanData = parsed.data as unknown as Partial<IProject>;
    const project = await projectService.create(cleanData);
    return sendSuccess(project, 201, 'Project created');
  } catch {
    return sendError('Internal server error', 500);
  }
}
