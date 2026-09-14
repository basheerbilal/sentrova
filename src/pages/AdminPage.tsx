import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiAdminUser } from '../types';
import { api } from '../services/api';
import { AdminLogin } from '../admin/AdminLogin';
import { AdminLayout } from '../admin/AdminLayout';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<ApiAdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const user = await api.getProfile();
          setAdminUser(user);
        } catch (err) {
          api.clearToken();
          setAdminUser(null);
        }
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleAdminLoginSuccess = (user: ApiAdminUser) => {
    setAdminUser(user);
  };

  const handleAdminLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore network errors on logout
    }
    api.clearToken();
    setAdminUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#087BFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Loading SENTROVA Admin...</span>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToSite={() => navigate('/')}
      />
    );
  }

  return (
    <AdminLayout
      admin={adminUser}
      onLogout={handleAdminLogout}
      onViewSite={() => navigate('/')}
    />
  );
};
