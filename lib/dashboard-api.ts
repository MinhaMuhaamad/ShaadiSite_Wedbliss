export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function authHeaders(token: string | null, extra: HeadersInit = {}): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra
  };
}

export async function apiRequest<T>(
  endpoint: string,
  token: string | null,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers: authHeaders(token, init?.headers),
    cache: 'no-store'
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }
  return payload as T;
}

export async function getActiveWeddingId(token: string | null): Promise<string | null> {
  if (!token) return null;
  const weddings = await apiRequest<{ _id: string }[]>('/api/weddings', token);
  return weddings[0]?._id || null;
}

export function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value || 0);
}
