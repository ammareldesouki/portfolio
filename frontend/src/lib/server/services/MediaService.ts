import { put, list, del } from '@vercel/blob';

export class MediaService {
  async upload(filename: string, buffer: Buffer, mimetype: string) {
    const blob = await put(filename, buffer, { access: 'public' });
    return {
      url: blob.url,
      filename: blob.pathname,
      originalName: filename,
      size: buffer.length,
      mimetype,
    };
  }

  async delete(filename: string) {
    await del(filename);
  }

  async list() {
    const { blobs } = await list();
    return blobs.map((b) => ({
      filename: b.pathname,
      original_filename: b.pathname,
      url: b.url,
      secure_url: b.url,
      bytes: b.size,
      format: b.pathname.split('.').pop() || '',
      resource_type: /\.(mp4|webm|ogg|mov)$/i.test(b.pathname) ? 'video' : 'image',
      created_at: b.uploadedAt.toISOString(),
      public_id: b.pathname,
    }));
  }
}
