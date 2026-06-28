import { z } from 'zod';

export const updateSettingsSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  tagline: z.string().max(200).optional(),
  avatar: z.string().optional().nullable(),
  siteTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  socialLinks: z.array(z.object({
    name: z.string().default('').optional(),
    icon: z.string().default('link').optional(),
    url: z.string().min(1),
  })).optional(),
  forceDarkMode: z.boolean().optional(),
});
