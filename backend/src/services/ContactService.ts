import { ContactRepository } from '../repositories/ContactRepository';
import { IContact } from '../models/Contact';

const contactRepo = new ContactRepository();

export class ContactService {
  async submit(data: Pick<IContact, 'name' | 'email' | 'message'>) {
    return contactRepo.create(data as IContact);
  }

  async list(page: number, limit: number, read?: boolean) {
    const filter: Record<string, unknown> = {};
    if (read !== undefined) filter.read = read;
    return contactRepo.findPaginated(filter, page, limit);
  }

  async markAsRead(id: string) {
    const contact = await contactRepo.markAsRead(id);
    if (!contact) throw new Error('Contact inquiry not found');
    return contact;
  }

  async delete(id: string) {
    const contact = await contactRepo.deleteById(id);
    if (!contact) throw new Error('Contact inquiry not found');
    return contact;
  }

  async getUnreadCount() {
    return (await contactRepo.findUnread()).length;
  }
}
