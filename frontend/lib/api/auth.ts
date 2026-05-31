import { User } from '@/lib/types';
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setStoredUser,
  setTokens,
} from '@/lib/auth-storage';

import { getApiBaseUrl, parseApiError } from './http';

interface ApiAuthUser {
  id: number;
  email: string;
  name: string;
  role: 'gym_owner' | 'admin';
  gym_id: number | null;
}

interface TokenPairResponse {
  access: string;
  refresh: string;
}

function mapAuthUser(api: ApiAuthUser): User {
  return {
    id: String(api.id),
    email: api.email,
    name: api.name,
    role: api.role,
    gymId: api.gym_id != null ? String(api.gym_id) : null,
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  gymName: string;
  gymLocation: string;
  gymPhone?: string;
  gymEmail?: string;
  gymDescription?: string;
}

interface RegisterResponse extends TokenPairResponse {
  user: ApiAuthUser;
}

export async function registerGymOwner(
  input: RegisterInput
): Promise<{ user: User; access: string; refresh: string }> {
  const response = await fetch(`${getApiBaseUrl()}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      password: input.password,
      gym_name: input.gymName,
      gym_location: input.gymLocation,
      gym_phone: input.gymPhone ?? '',
      gym_email: input.gymEmail ?? '',
      gym_description: input.gymDescription ?? '',
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as RegisterResponse;
  setTokens(data.access, data.refresh);
  const user = mapAuthUser(data.user);
  setStoredUser(JSON.stringify(user));
  return { user, access: data.access, refresh: data.refresh };
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ user: User; access: string; refresh: string }> {
  const response = await fetch(`${getApiBaseUrl()}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const tokens = (await response.json()) as TokenPairResponse;
  setTokens(tokens.access, tokens.refresh);

  const user = await fetchCurrentUser(tokens.access);
  setStoredUser(JSON.stringify(user));
  return { user, access: tokens.access, refresh: tokens.refresh };
}

export async function fetchCurrentUser(accessToken?: string): Promise<User> {
  const token = accessToken ?? getAccessToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/me/`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as ApiAuthUser;
  const user = mapAuthUser(data);
  setStoredUser(JSON.stringify(user));
  return user;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${getApiBaseUrl()}/auth/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearAuthStorage();
    return null;
  }

  const data = (await response.json()) as { access: string };
  const currentRefresh = getRefreshToken();
  if (currentRefresh) {
    setTokens(data.access, currentRefresh);
  }
  return data.access;
}

export function logoutFromApi(): void {
  clearAuthStorage();
}
