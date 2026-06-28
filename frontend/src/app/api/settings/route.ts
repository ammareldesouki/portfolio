import { NextRequest } from 'next/server';
import { connectDatabase } from '@/lib/server/config/database';
import { SettingsService } from '@/lib/server/services/SettingsService';
import { updateSettingsSchema } from '@/lib/server/validators/settings';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';
import { getAuthUser } from '@/lib/server/middleware/auth';

const settingsService = new SettingsService();

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    const settings = await settingsService.getAll();
    return sendSuccess(settings);
  } catch {
    return sendError('Internal server error', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) return sendError('Unauthorized', 401);

    await connectDatabase();
    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return sendError(messages, 400);
    }
    const settings = await settingsService.update(parsed.data as Record<string, unknown>);
    return sendSuccess(settings, 200, 'Settings updated');
  } catch {
    return sendError('Internal server error', 500);
  }
}
