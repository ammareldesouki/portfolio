import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  status: 'draft' | 'in_progress' | 'published' | 'archived';
  techStack: string[];
  imageUrl?: string;
  galleryUrls: string[];
  links: { github?: string; live?: string; caseStudy?: string };
  featured: boolean;
  role?: string;
  timeline?: string;
  challenge?: string;
  sortOrder: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: 'mobile' },
    status: { type: String, enum: ['draft', 'in_progress', 'published', 'archived'], default: 'draft' },
    techStack: [{ type: String }],
    imageUrl: { type: String },
    galleryUrls: [{ type: String }],
    links: { github: { type: String }, live: { type: String }, caseStudy: { type: String } },
    featured: { type: Boolean, default: false },
    role: { type: String },
    timeline: { type: String },
    challenge: { type: String },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
