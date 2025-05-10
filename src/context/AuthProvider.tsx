import React, { useState, useEffect, ReactNode } from 'react';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.get('accessToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = (token: string) => {
    cookies.set('accessToken', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict',
      secure: true,
    });
    setIsAuthenticated(true);
  };

  const logout = (redirectToLogin = true) => {
    cookies.remove('accessToken', { path: '/' });
    setIsAuthenticated(false);
    if (redirectToLogin) navigate('/login');
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
