import api from './client';
import type { Customer } from '../types';

const serializeCustomerPayload = (data: Partial<Customer>) => ({
  ...data,
  contact_info: typeof data.contact_info === 'string' ? data.contact_info : JSON.stringify(data.contact_info ?? { phone: '', email: '', address: '' }),
});

export const customerApi = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: string) => api.get<Customer>(`/customers/${id}`),
  create: (data: Partial<Customer>) => api.post<Customer>('/customers', serializeCustomerPayload(data)),
  update: (id: string, data: Partial<Customer>) => api.put<Customer>(`/customers/${id}`, serializeCustomerPayload(data)),
  delete: (id: string) => api.delete(`/customers/${id}`),
};