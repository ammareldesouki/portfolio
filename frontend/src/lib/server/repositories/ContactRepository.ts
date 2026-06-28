import { Contact, IContact } from '../models/Contact';
import { BaseRepository } from './BaseRepository';

export class ContactRepository extends BaseRepository<IContact> {
  constructor() {
    super(Contact);
  }
}
