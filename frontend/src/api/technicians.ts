import api from './client';
import type { Technician } from '../types';

export const technicianApi = {
  getAll: () => api.get<Technician[]>('/technicians'),
  getById: (id: string) => api.get<Technician>(`/technicians/${id}`),
  create: (data: Partial<Technician>) => api.post<Technician>('/technicians', data),
  update: (id: string, data: Partial<Technician>) => api.put<Technician>(`/technicians/${id}`, data),
  delete: (id: string) => api.delete(`/technicians/${id}`),
};