'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'OPERATIONS_ADMIN' | 'CONTENT_MANAGER' | 'SUPPORT' | 'PROVIDER' | 'CUSTOMER';
  avatarUrl?: string;
  providerId?: string;
  verificationStatus?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  quickLogin: (account: 'admin' | 'ops' | 'provider1' | 'provider2' | 'customer1' | 'customer2') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ACCOUNTS = {
  admin: { email: 'admin@marketplace.com', password: 'Admin123!', label: 'Super Admin (Faraday)' },
  ops: { email: 'ops@marketplace.com', password: 'Admin123!', label: 'Operations Admin (Tariq)' },
  provider1: { email: 'apex@adventures.com', password: 'Marketplace123!', label: 'Apex Expeditions (Approved Provider)' },
  provider2: { email: 'coastal@escapes.com', password: 'Marketplace123!', label: 'Coastal Escapes (Approved Provider)' },
  customer1: { email: 'sarah@customer.com', password: 'Marketplace123!', label: 'Sarah Jenkins (Customer)' },
  customer2: { email: 'ali@customer.com', password: 'Marketplace123!', label: 'Ali Raza (Customer)' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('marketplace_token');
    const storedUser = localStorage.getItem('marketplace_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('marketplace_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('marketplace_token', res.data.token);
      localStorage.setItem('marketplace_user', JSON.stringify(res.data.user));
    }
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('marketplace_token', res.data.token);
      localStorage.setItem('marketplace_user', JSON.stringify(res.data.user));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('marketplace_token');
    localStorage.removeItem('marketplace_user');
  };

  const quickLogin = async (accountKey: keyof typeof DEMO_ACCOUNTS) => {
    const acc = DEMO_ACCOUNTS[accountKey];
    if (acc) {
      await login({ email: acc.email, password: acc.password });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, quickLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
