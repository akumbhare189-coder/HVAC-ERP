import api from './client';
import type { InventoryUnit } from '../types';

export const inventoryApi = {
  getAll: (params?: { godown_id?: string; project_id?: string; warranty_status?: string }) =>
    api.get<InventoryUnit[]>('/inventory', { params }),
  getById: (id: string) => api.get<InventoryUnit>(`/inventory/${id}`),
  create: (data: Partial<InventoryUnit>) => api.post<InventoryUnit>('/inventory', data),
  update: (id: string, data: Partial<InventoryUnit>) => api.put<InventoryUnit>(`/inventory/${id}`, data),
  delete: (id: string) => api.delete(`/inventory/${id}`),
};