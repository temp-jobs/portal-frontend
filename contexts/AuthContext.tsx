'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  avatar?: string;
  _id: string;
  id?: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: 'jobseeker' | 'employer';
  companyName?: string;
  companyWebsite?: string;
  profileCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => void;
  register: (nameOrCompany: string, email: string, password: string, role: 'jobseeker' | 'employer') => Promise<{ user: User; token: string }>;
  loginWithGoogle: (googleToken: string, role?: 'jobseeker' | 'employer') => Promise<{ user: User; token: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Load user/token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const register = async (nameOrCompany: string, email: string, password: string, role: 'jobseeker' | 'employer') => {
    const payload = role === 'employer'
      ? { companyName: nameOrCompany, email, password, role }
      : { name: nameOrCompany, email, password, role };

    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, payload);
    const { token, user } = res.data;

    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  };

  const loginWithGoogle = async (googleToken: string, role?: 'jobseeker' | 'employer') => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        token: googleToken,
        role, // optional for first-time registration
      });

      const { token, user } = res.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (err: any) {
      console.error('Google login failed', err);
      throw new Error(err?.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, setUser, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}
