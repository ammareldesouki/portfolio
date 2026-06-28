import { apiClient } from "../auth-context";
import type { ApiResponse } from "./types";

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
  description?: string;
}

export interface Settings {
  _id: string;
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
  skills: Skill[];
  socialLinks: SocialLink[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  forceDarkMode: boolean;
  contactEnabled: boolean;
  showSkills: boolean;
  showExperience: boolean;
  showEducation: boolean;
  showCertifications: boolean;
}

export const settingsApi = {
  getPublic: () =>
    apiClient.get<ApiResponse<Settings>>("/settings/public").then((r) => r.data),

  getAll: () =>
    apiClient.get<ApiResponse<Settings>>("/settings").then((r) => r.data),

  update: (data: Partial<Settings>) =>
    apiClient.put<ApiResponse<Settings>>("/settings", data).then((r) => r.data),
};
