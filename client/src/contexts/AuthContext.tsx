import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery<{ user: User }>({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const value: AuthContextType = {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
