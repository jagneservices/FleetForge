import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('ff_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const persist = (token, u) => {
    if (token) localStorage.setItem('ff_token', token);
    if (u) localStorage.setItem('ff_user', JSON.stringify(u));
    setUser(u);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persist(data.access_token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, company_name) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { email, password, company_name });
      persist(data.access_token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('ff_token');
    localStorage.removeItem('ff_user');
    setUser(null);
  }, []);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('ff_token');
    if (token && !user) {
      api.get('/auth/me')
        .then((r) => persist(null, r.data))
        .catch(() => logout());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
