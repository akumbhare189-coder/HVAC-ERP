export function parseContactInfo(value: unknown) {
  if (!value) {
    return { phone: '', email: '', address: '' };
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null ? parsed : { phone: '', email: '', address: '' };
    } catch {
      return { phone: '', email: '', address: '' };
    }
  }

  if (typeof value === 'object') {
    return value as Record<string, string>;
  }

  return { phone: '', email: '', address: '' };
}

export function formatDate(value: string | Date | null | undefined, locale = 'en-IN') {
  if (!value) return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatCurrencyINR(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return '₹0';

  const amount = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(amount)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
