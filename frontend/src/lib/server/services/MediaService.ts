import { put } from '@vercel/blob';
import { env } from '../config/env';

export class MediaService {
  async upload(filename: string, buffer: Buffer, mimetype: string) {
    const blob = await put(filename, buffer, {
      access: 'public',
      token: env.blobReadWriteToken || undefined,
    });
    return {
      url: blob.url,
      filename: blob.pathname,
      originalName: filename,
      size: buffer.length,
      mimetype,
    };
  }

  async delete(_filename: string) {
    void _filename;
    return;
  }

  async list() {
    return [];
  }
}
