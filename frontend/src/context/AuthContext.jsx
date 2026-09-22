import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('seuconnect_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('seuconnect_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('seuconnect_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        if (res.success) {
          setUser(res.data.user);
          setProfile(res.data.profile);
          localStorage.setItem('seuconnect_user', JSON.stringify(res.data.user));
          if (res.data.profile) {
            localStorage.setItem('seuconnect_profile', JSON.stringify(res.data.profile));
          }
        }
      } catch (err) {
        console.error('Session validation error:', err.message);
        localStorage.removeItem('seuconnect_token');
        localStorage.removeItem('seuconnect_user');
        localStorage.removeItem('seuconnect_profile');
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success) {
      const { token, user, profile, redirectPath } = res.data;
      localStorage.setItem('seuconnect_token', token);
      localStorage.setItem('seuconnect_user', JSON.stringify(user));
      if (profile) {
        localStorage.setItem('seuconnect_profile', JSON.stringify(profile));
      }
      setUser(user);
      setProfile(profile);
      return { success: true, redirectPath, role: user.role };
    }
    return { success: false, message: res.message };
  };

  const logout = () => {
    localStorage.removeItem('seuconnect_token');
    localStorage.removeItem('seuconnect_user');
    localStorage.removeItem('seuconnect_profile');
    setUser(null);
    setProfile(null);
    window.location.href = '/login';
  };

  const updateUserProfile = (updatedUser, updatedProfile) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('seuconnect_user', JSON.stringify(updatedUser));
    }
    if (updatedProfile) {
      setProfile(updatedProfile);
      localStorage.setItem('seuconnect_profile', JSON.stringify(updatedProfile));
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, role: user?.role, loading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
