import api from './client';
import type { Enquiry } from '../types';

export const enquiryApi = {
  getAll: (params?: { status?: string; customer_id?: string }) => api.get<Enquiry[]>('/enquiries', { params }),
  getById: (id: string) => api.get<Enquiry>(`/enquiries/${id}`),
  create: (data: Partial<Enquiry>) => api.post<Enquiry>('/enquiries', data),
  update: (id: string, data: Partial<Enquiry>) => api.put<Enquiry>(`/enquiries/${id}`, data),
  delete: (id: string) => api.delete(`/enquiries/${id}`),
  convertToProject: (id: string, data: { total_cost: number; lead_time: number; advance_payment_status: string; expected_delivery_date: string }) =>
    api.post(`/enquiries/${id}/convert`, data),
};