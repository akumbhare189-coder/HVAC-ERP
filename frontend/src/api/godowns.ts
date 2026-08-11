import api from './client';
import type { Godown } from '../types';

export const godownApi = {
  getAll: () => api.get<Godown[]>('/godowns'),
  getById: (id: string) => api.get<Godown>(`/godowns/${id}`),
  create: (data: Partial<Godown>) => api.post<Godown>('/godowns', data),
  update: (id: string, data: Partial<Godown>) => api.put<Godown>(`/godowns/${id}`, data),
  delete: (id: string) => api.delete(`/godowns/${id}`),
};