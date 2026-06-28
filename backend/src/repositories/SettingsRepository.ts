import { BaseRepository } from './BaseRepository';
import { ISettings, Settings } from '../models/Settings';

export class SettingsRepository extends BaseRepository<ISettings> {
  constructor() {
    super(Settings);
  }

  async getSingleton(): Promise<ISettings | null> {
    const settings = await this.find();
    return settings.length > 0 ? settings[0] : null;
  }

  async upsert(data: Partial<ISettings>): Promise<ISettings> {
    const existing = await this.getSingleton();
    if (existing) {
      return (await this.updateById(String(existing._id), data))!;
    }
    return this.create(data);
  }
}
