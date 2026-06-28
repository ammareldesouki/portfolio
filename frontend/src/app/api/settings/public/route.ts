import { connectDatabase } from '@/lib/server/config/database';
import { SettingsService } from '@/lib/server/services/SettingsService';
import { sendSuccess, sendError } from '@/lib/server/utils/api-response';

const settingsService = new SettingsService();

export async function GET() {
  try {
    await connectDatabase();
    const settings = await settingsService.getPublic();
    return sendSuccess(settings);
  } catch {
    return sendError('Internal server error', 500);
  }
}
