import { apiClient } from "../auth-context";
import type { ApiResponse } from "./types";

export interface Project {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  category?: string;
  status?: "draft" | "in_progress" | "published" | "archived";
  techStack?: string[];
  imageUrl?: string | null;
  galleryUrls?: string[];
  links?: {
    github?: string | null;
    live?: string | null;
    caseStudy?: string | null;
  };
  featured?: boolean;
  role?: string | null;
  timeline?: string | null;
  challenge?: string | null;
}

export const projectsApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    featured?: boolean;
    category?: string;
    sort?: string;
  }) =>
    apiClient.get<ApiResponse<Project[]>>("/projects", { params }).then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Project>>(`/projects/${slug}`).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Project>>(`/projects/detail/${id}`).then((r) => r.data),

  create: (data: ProjectFormData) =>
    apiClient.post<ApiResponse<Project>>("/projects", data).then((r) => r.data),

  update: (id: string, data: Partial<ProjectFormData>) =>
    apiClient.put<ApiResponse<Project>>(`/admin/projects/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/admin/projects/${id}`).then((r) => r.data),

  getFeatured: () =>
    apiClient.get<ApiResponse<Project[]>>("/projects/featured").then((r) => r.data),

  reorder: (orders: { _id: string; sortOrder: number }[]) =>
    apiClient.put<ApiResponse<null>>("/projects/reorder", { orders }).then((r) => r.data),
};
