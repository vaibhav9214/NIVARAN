import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { socketService } from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nivaran_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('nivaran_token') || null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('nivaran_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.getMe();
        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('nivaran_user', JSON.stringify(res.data.user));
          socketService.connect(storedToken);
        } else {
          // Token invalid or revoked
          logoutFrontend();
        }
      } catch (err) {
        console.warn('Session restoration failed:', err.response?.data?.message || err.message);
        // Only clear if 401 Unauthorized
        if (err.response?.status === 401) {
          logoutFrontend();
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data?.success && res.data.token) {
      const authToken = res.data.token;
      const authUser = res.data.user;

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('nivaran_token', authToken);
      localStorage.setItem('nivaran_user', JSON.stringify(authUser));

      socketService.connect(authToken);
      return authUser;
    }
    throw new Error(res.data?.message || 'Login failed.');
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.data?.success && res.data.token) {
      const authToken = res.data.token;
      const authUser = res.data.user;

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('nivaran_token', authToken);
      localStorage.setItem('nivaran_user', JSON.stringify(authUser));

      socketService.connect(authToken);
      return authUser;
    }
    throw new Error(res.data?.message || 'Registration failed.');
  };

  const logoutFrontend = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nivaran_token');
    localStorage.removeItem('nivaran_user');
    socketService.disconnect();
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn('Backend logout error:', err.message);
    } finally {
      logoutFrontend();
    }
  };

  const logoutAll = async () => {
    try {
      await authAPI.logoutAll();
    } catch (err) {
      console.warn('Backend logout-all error:', err.message);
    } finally {
      logoutFrontend();
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    role: user?.role || null,
    isStudent: user?.role === 'student',
    isOfficer: user?.role === 'officer',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    logoutAll,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

