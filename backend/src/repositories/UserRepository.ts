import { BaseRepository } from './BaseRepository';
import { IUser, User } from '../models/User';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email: email.toLowerCase() } as Record<string, unknown>);
  }
}
