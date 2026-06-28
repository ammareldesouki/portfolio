import { SettingsRepository } from '../repositories/SettingsRepository';
import { ISettings } from '../models/Settings';

const settingsRepo = new SettingsRepository();

export class SettingsService {
  async getPublic() {
    return settingsRepo.getSingleton();
  }

  async getAll() {
    return settingsRepo.getSingleton();
  }

  async update(data: Partial<ISettings>) {
    return settingsRepo.upsert(data);
  }
}
