import { Settings, ISettings } from '../models/Settings';
import { BaseRepository } from './BaseRepository';

export class SettingsRepository extends BaseRepository<ISettings> {
  constructor() {
    super(Settings);
  }

  async getFirst() {
    const all = await this.find();
    return all[0] || null;
  }
}
