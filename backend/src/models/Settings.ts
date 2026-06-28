import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  displayName: string;
  tagline: string;
  avatar?: string;
  siteTitle: string;
  metaDescription: string;
  socialLinks: { name: string; icon: string; url: string }[];
  forceDarkMode: boolean;
}

const SettingsSchema = new Schema<ISettings>(
  {
    displayName: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    avatar: { type: String },
    siteTitle: { type: String, default: 'Flutter Developer Portfolio' },
    metaDescription: { type: String, default: '' },
    socialLinks: [{ name: String, icon: String, url: String }],
    forceDarkMode: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
