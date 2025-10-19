'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  avatar: string | undefined;
  _id: string; // 👈 Add this line
  id?: string; // optional fallback for future API consistency
  email: string;
  name?: string; // jobseeker
  avatarUrl?: string;
  role: 'jobseeker' | 'employer';
  companyName?: string; // employer
  companyWebsite?: string;
  profileCompleted?: boolean;
}


interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<{ user: any, token: any }>;
  logout: () => void;
  register: (nameOrCompany: string, email: string, password: string, role: 'jobseeker' | 'employer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser && savedUser !== undefined) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      const { token, user } = res.data;

      // Save auth state
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Role-based redirect
      if (user.role === 'employer') {
        router.push(user.profileCompleted ? 'em/dashboard' : 'em/onboarding');
      } else if (user.role === 'jobseeker') {
        router.push(user.profileCompleted ? 'jsk/dashboard' : 'jsk/onboarding');
      } else {
        // fallback for undefined roles
        router.push('/');
      }

      return { user, token }; // optional, if needed by caller

    } catch (error) {
      console.error(error);
      throw new Error('Login failed');
    }
  };


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };


  const register = async (
    nameOrCompany: string,
    email: string,
    password: string,
    role: 'jobseeker' | 'employer'
  ) => {
    try {
      // Prepare payload dynamically
      const payload =
        role === 'employer'
          ? { companyName: nameOrCompany, email, password, role }
          : { name: nameOrCompany, email, password, role };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        payload
      );

      const { token, user } = res.data;
      setToken(token);
      setUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (role === 'employer') {
        router.push('em/onboarding');
      } else {
        router.push('jsk/onboarding');
      }
    } catch (error) {
      throw new Error('Registration failed');
    }
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}