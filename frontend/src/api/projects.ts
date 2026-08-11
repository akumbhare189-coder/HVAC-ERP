import api from './client';
import type { Project } from '../types';

export const projectApi = {
  getAll: (params?: { enquiry_id?: string }) => api.get<Project[]>('/projects', { params }),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => api.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};