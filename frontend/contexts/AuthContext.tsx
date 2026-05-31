'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/types';
import {
  fetchCurrentUser,
  loginWithEmail,
  logoutFromApi,
  refreshAccessToken,
  registerGymOwner,
  type RegisterInput,
} from '@/lib/api/auth';
import { getAccessToken, getStoredUser } from '@/lib/auth-storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateSession = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const cached = getStoredUser();
    if (cached) {
      try {
        setUser(JSON.parse(cached) as User);
      } catch {
        // ignore invalid cache
      }
    }

    try {
      const profile = await fetchCurrentUser(token);
      setUser(profile);
    } catch {
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        try {
          const profile = await fetchCurrentUser(newAccess);
          setUser(profile);
          setIsLoading(false);
          return;
        } catch {
          // fall through to logout
        }
      }
      logoutFromApi();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  const login = async (email: string, password: string): Promise<void> => {
    const { user: loggedInUser } = await loginWithEmail(email, password);
    setUser(loggedInUser);
  };

  const register = async (input: RegisterInput): Promise<void> => {
    const { user: registeredUser } = await registerGymOwner(input);
    setUser(registeredUser);
  };

  const logout = () => {
    logoutFromApi();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
