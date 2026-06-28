import { connectDatabase } from '@/lib/server/config/database';
import { SettingsService } from '@/lib/server/services/SettingsService';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';

const settingsService = new SettingsService();

export async function GET() {
  try {
    await connectDatabase();
    const settings = await settingsService.getPublic();
    const response = sendSuccess(settings);
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  } catch {
    return sendError('Internal server error', 500);
  }
}
