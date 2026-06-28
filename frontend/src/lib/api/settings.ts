import { apiClient } from "../auth-context";
import type { ApiResponse } from "./types";

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

export interface Settings {
  _id: string;
  displayName: string;
  tagline: string;
  avatar?: string;
  siteTitle: string;
  metaDescription: string;
  socialLinks: SocialLink[];
  forceDarkMode: boolean;
}

export const settingsApi = {
  getPublic: () =>
    apiClient.get<ApiResponse<Settings>>("/settings/public").then((r) => r.data),

  getAll: () =>
    apiClient.get<ApiResponse<Settings>>("/settings").then((r) => r.data),

  update: (data: Partial<Settings>) =>
    apiClient.put<ApiResponse<Settings>>("/settings", data).then((r) => r.data),
};
