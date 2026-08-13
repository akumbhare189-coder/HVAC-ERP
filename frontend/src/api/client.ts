import axios from 'axios';

const normalizeContactInfo = (value: unknown) => {
  if (!value) return value;

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null ? parsed : value;
    } catch {
      return value;
    }
  }

  return value;
};

const normalizeResponseData = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeResponseData(item));
  }

  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (key === 'contact_info') {
          return [key, normalizeContactInfo(value)];
        }

        if (value && typeof value === 'object') {
          return [key, normalizeResponseData(value)];
        }

        return [key, value];
      })
    );
  }

  return data;
};

const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? (import.meta.env.VITE_API_BASE as string) : '/api';

const api = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    response.data = normalizeResponseData(response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;