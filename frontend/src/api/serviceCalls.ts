import api from './client';
import type { ServiceCall } from '../types';

export const serviceCallApi = {
  getAll: (params?: { status?: string; customer_id?: string; technician_id?: string }) =>
    api.get<ServiceCall[]>('/service-calls', { params }),
  getById: (id: string) => api.get<ServiceCall>(`/service-calls/${id}`),
  create: (data: Partial<ServiceCall>) => api.post<ServiceCall>('/service-calls', data),
  update: (id: string, data: Partial<ServiceCall>) => api.put<ServiceCall>(`/service-calls/${id}`, data),
  delete: (id: string) => api.delete(`/service-calls/${id}`),
  assignTechnician: (id: string, technician_id: string) => api.post<ServiceCall>(`/service-calls/${id}/assign`, { technician_id }),
};