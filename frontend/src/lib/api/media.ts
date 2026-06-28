"use client";

import { apiClient } from "../auth-context";
import type { ApiResponse } from "./types";

export interface MediaFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
}

export interface LocalMediaResource {
  filename: string;
  original_filename: string;
  url: string;
  secure_url: string;
  bytes: number;
  format: string;
  resource_type: string;
  created_at: string;
  public_id: string;
}

export const mediaApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<ApiResponse<MediaFile>>("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  delete: (filename: string) =>
    apiClient.delete<ApiResponse<null>>(`/media/${filename}`).then((r) => r.data),

  list: () =>
    apiClient.get<ApiResponse<LocalMediaResource[]>>("/media").then((r) => r.data),
};
