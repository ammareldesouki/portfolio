import { SettingsRepository } from '../repositories/SettingsRepository';
import { ISettings } from '../models/Settings';

const settingsRepo = new SettingsRepository();

export class SettingsService {
  async getPublic() {
    const settings = await settingsRepo.getFirst();
    if (!settings) return null;
    const obj = settings.toObject();
    const { forceDarkMode, ...rest } = obj;
    void forceDarkMode;
    return rest;
  }

  async getAll() {
    return settingsRepo.getFirst();
  }

  async update(data: Record<string, unknown>) {
    const settings = await settingsRepo.getFirst();
    if (settings) {
      return settingsRepo.updateById(settings._id.toString(), data as Partial<ISettings>);
    }
    return settingsRepo.create(data as Partial<ISettings>);
  }
}
