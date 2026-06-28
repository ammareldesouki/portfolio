import { ContactRepository } from '../repositories/ContactRepository';
import { IContact } from '../models/Contact';

const contactRepo = new ContactRepository();

export class ContactService {
  async create(data: { name: string; email: string; message: string }) {
    return contactRepo.create(data as Partial<IContact>);
  }

  async list(page = 1, limit = 20) {
    return contactRepo.findPaginated({}, page, limit);
  }

  async markAsRead(id: string) {
    return contactRepo.updateById(id, { read: true });
  }
}
