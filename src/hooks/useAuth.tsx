'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { authService } from '@/services/auth';
import { ApiError } from '@/lib/api';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authChecked = useRef(false);

  useEffect(() => {
    // Prevent duplicate auth checks on re-renders
    if (authChecked.current) return;

    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          // Only logout on authentication errors (401, 403)
          // Don't logout on network errors or server errors
          if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
            authService.logout();
          }
        }
      }
      setIsLoading(false);
      authChecked.current = true;
    };
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { user } = await authService.login(credentials);
    setUser(user);
  };

  const register = async (credentials: RegisterCredentials) => {
    const { user } = await authService.register(credentials);
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
