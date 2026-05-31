import { getAccessToken } from '@/lib/auth-storage';
import { refreshAccessToken } from './auth';

const DEFAULT_API_BASE = 'http://127.0.0.1:8000/api';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE).replace(
      /\/$/,
      ''
    );
  }
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_API_BASE
  ).replace(/\/$/, '');
}

export async function parseApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) return data.detail.map(String).join(' ');
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const val = data[firstKey];
      return Array.isArray(val) ? val.join(' ') : String(val);
    }
  } catch {
    // ignore
  }
  return `Request failed (${response.status})`;
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit & { auth?: boolean }
): Promise<T> {
  const { auth, ...fetchInit } = init ?? {};
  const url = `${getApiBaseUrl()}/${path.replace(/^\//, '')}`;

  const isFormData =
    typeof FormData !== 'undefined' && fetchInit.body instanceof FormData;

  const buildHeaders = (token?: string | null): HeadersInit => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    // Let the browser set multipart boundary — do not set Content-Type manually
    if (!isFormData && fetchInit.headers) {
      Object.assign(headers, fetchInit.headers as Record<string, string>);
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  let token = auth ? getAccessToken() : null;
  if (auth && !token) {
    throw new Error('You must be logged in.');
  }

  let response = await fetch(url, {
    ...fetchInit,
    headers: buildHeaders(token),
  });

  if (response.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...fetchInit,
        headers: buildHeaders(newToken),
      });
    }
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
