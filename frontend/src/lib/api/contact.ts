import { apiClient } from "../auth-context";
import type { ApiResponse } from "./types";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const contactApi = {
  submit: (data: { name: string; email: string; message: string }) =>
    apiClient.post<ApiResponse<Contact>>("/contact", data).then((r) => r.data),

  list: (params?: { page?: number; limit?: number; read?: boolean }) =>
    apiClient.get<ApiResponse<Contact[]>>("/contact", { params }).then((r) => r.data),

  markAsRead: (id: string) =>
    apiClient.patch<ApiResponse<Contact>>(`/contact/${id}/read`).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/contact/${id}`).then((r) => r.data),
};
