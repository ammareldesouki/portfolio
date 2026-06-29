import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies: string[];
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface ICertification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
  description?: string;
}

export interface ISkill {
  name: string;
  category?: string;
  icon?: string;
}

export interface ISocialLink {
  name: string;
  icon: string;
  url: string;
  show?: boolean;
}

export interface ISettings extends Document {
  displayName: string;
  tagline: string;
  avatar?: string;
  favicon?: string;
  siteTitle: string;
  metaDescription: string;
  bio: string;
  aboutContent: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  skills: ISkill[];
  socialLinks: ISocialLink[];
  experience: IExperience[];
  education: IEducation[];
  certifications: ICertification[];
  forceDarkMode: boolean;
  contactEnabled: boolean;
  showSkills: boolean;
  showExperience: boolean;
  showEducation: boolean;
  showCertifications: boolean;
}

const SettingsSchema = new Schema<ISettings>(
  {
    displayName: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    avatar: { type: String },
    favicon: { type: String },
    siteTitle: { type: String, default: 'Portfolio' },
    metaDescription: { type: String, default: '' },
    bio: { type: String, default: '' },
    aboutContent: { type: String, default: '' },
    location: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    resumeUrl: { type: String },
    skills: [{ name: String, category: String, icon: String }],
    socialLinks: [{ name: String, icon: String, url: String, show: { type: Boolean, default: true } }],
    experience: [{
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
      technologies: [String],
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String,
      url: String,
      description: String,
    }],
    forceDarkMode: { type: Boolean, default: true },
    contactEnabled: { type: Boolean, default: true },
    showSkills: { type: Boolean, default: true },
    showExperience: { type: Boolean, default: true },
    showEducation: { type: Boolean, default: true },
    showCertifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
