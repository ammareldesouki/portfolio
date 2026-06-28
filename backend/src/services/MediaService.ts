import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve(__dirname, '../../uploads');

export class MediaService {
  async upload(file: Express.Multer.File) {
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async delete(filename: string) {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async list() {
    if (!fs.existsSync(uploadsDir)) return [];

    const files = fs.readdirSync(uploadsDir);
    return files
      .filter((f) => f !== '.gitkeep')
      .map((filename) => {
        const filePath = path.join(uploadsDir, filename);
        const stat = fs.statSync(filePath);
        return {
          filename,
          original_filename: filename.replace(/^\d+-\d+-/, '').replace(/\.[^.]+$/, ''),
          url: `/uploads/${filename}`,
          secure_url: `/uploads/${filename}`,
          bytes: stat.size,
          format: path.extname(filename).slice(1),
          resource_type: /\.(mp4|mov)$/i.test(filename) ? 'video' : 'image',
          created_at: stat.birthtime.toISOString(),
          public_id: filename,
        };
      })
      .reverse();
  }
}
