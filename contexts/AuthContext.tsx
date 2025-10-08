'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'jobseeker' | 'employer';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'jobseeker' | 'employer';
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await axios.post<{ token: string }>(`${API_URL}/api/auth/login`, { email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      await fetchProfile(token);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // Add profileCompleted to User type and AuthContext

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'jobseeker' | 'employer';
  profileCompleted: boolean;  // new field
}

// In fetchProfile after getting user data, assume backend returns profileCompleted boolean

const fetchProfile = async (token: string) => {
  try {
    const res = await axios.get<User>(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  } catch (error) {
    console.error('Failed to fetch profile', error);
    logout();
  } finally {
    setLoading(false);
  }
};

// Update login and register to redirect after setting user (handled in pages now)

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, data);
      return await login(data.email, data.password);
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};