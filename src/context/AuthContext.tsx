import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: (redirectToLogin?: boolean) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
