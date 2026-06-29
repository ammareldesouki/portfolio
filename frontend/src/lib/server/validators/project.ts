import { z } from 'zod';

const anyStringOrNull = z.string().min(1).optional().nullable().or(z.literal('').transform(() => null));

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional(),
  status: z.enum(['draft', 'in_progress', 'published', 'archived']).optional(),
  techStack: z.array(z.string()).optional(),
  imageUrl: anyStringOrNull,
  galleryUrls: z.array(z.string().min(1)).optional(),
  links: z.object({
    github: anyStringOrNull,
    live: anyStringOrNull,
    caseStudy: anyStringOrNull,
  }).optional(),
  featured: z.boolean().optional(),
  role: anyStringOrNull,
  timeline: anyStringOrNull,
  challenge: anyStringOrNull,
  sortOrder: z.number().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(12),
  status: z.enum(['draft', 'in_progress', 'published', 'archived']).optional(),
  featured: z.coerce.boolean().optional(),
  category: z.string().optional(),
  sort: z.string().optional().default('-createdAt'),
});

export const reorderProjectsSchema = z.object({
  orders: z.array(z.object({
    _id: z.string(),
    sortOrder: z.number(),
  })),
});
