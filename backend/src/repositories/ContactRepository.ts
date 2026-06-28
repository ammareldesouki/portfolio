import { BaseRepository } from './BaseRepository';
import { IContact, Contact } from '../models/Contact';
import { FilterQuery } from 'mongoose';

export class ContactRepository extends BaseRepository<IContact> {
  constructor() {
    super(Contact);
  }

  async findUnread() {
    return this.find({ read: false } as FilterQuery<IContact>);
  }

  async markAsRead(id: string): Promise<IContact | null> {
    return this.updateById(id, { read: true } as Record<string, unknown>);
  }
}
