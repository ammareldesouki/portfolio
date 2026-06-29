import { ContactRepository } from '../repositories/ContactRepository';
import { IContact } from '../models/Contact';
import { SettingsService } from './SettingsService';
import { sendContactEmail } from './EmailService';

const contactRepo = new ContactRepository();
const settingsService = new SettingsService();

export class ContactService {
  async create(data: { name: string; email: string; message: string }) {
    const contact = await contactRepo.create(data as Partial<IContact>);

    const settings = await settingsService.getAll();
    const ownerEmail = settings?.email;
    if (ownerEmail) {
      try {
        await sendContactEmail(ownerEmail, data.name, data.email, data.message);
      } catch (err) {
        console.error('[ContactService] Failed to send email notification:', err);
      }
    }

    return contact;
  }

  async list(page = 1, limit = 20) {
    return contactRepo.findPaginated({}, page, limit);
  }

  async markAsRead(id: string) {
    return contactRepo.updateById(id, { read: true });
  }
}
