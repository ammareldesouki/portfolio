import { NextRequest } from 'next/server';
import { connectDatabase } from '@/lib/server/config/database';
import { ContactService } from '@/lib/server/services/ContactService';
import { createContactSchema } from '@/lib/server/validators/contact';
import { sendSuccess, sendError, sendPaginated } from '@/lib/server/utils/api-response';
import { getAuthUser } from '@/lib/server/middleware/auth';

const contactService = new ContactService();

export async function POST(request: NextRequest) {
  try {
    await connectDatabase();
    const body = await request.json();
    const parsed = createContactSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return sendError(messages, 400);
    }
    const contact = await contactService.create(parsed.data);
    return sendSuccess(contact, 201, 'Message sent');
  } catch {
    return sendError('Internal server error', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const { data, total } = await contactService.list(page, limit);
    return sendPaginated(data, page, limit, total);
  } catch {
    return sendError('Internal server error', 500);
  }
}
