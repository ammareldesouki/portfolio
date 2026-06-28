import { NextRequest } from 'next/server';
import { connectDatabase } from '@/lib/server/config/database';
import { AuthService } from '@/lib/server/services/AuthService';
import { loginSchema } from '@/lib/server/validators/auth';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    await connectDatabase();
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return sendError(messages, 400);
    }
    const result = await authService.login(parsed.data.email, parsed.data.password);
    return sendSuccess(result, 200, 'Login successful');
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid email or password') {
      return sendError(error.message, 401);
    }
    return sendError('Internal server error', 500);
  }
}
