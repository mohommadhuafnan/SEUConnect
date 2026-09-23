import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-700)' }}>SEUConnect</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Verifying institutional credentials...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const StudentRoute = () => {
  const { user } = useAuth();
  if (user?.role !== 'student' && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export const LecturerRoute = () => {
  const { user } = useAuth();
  if (user?.role !== 'lecturer' && user?.role !== 'hod' && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export const HODRoute = () => {
  const { user } = useAuth();
  if (user?.role !== 'hod' && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export const DeanRoute = () => {
  const { user } = useAuth();
  if (user?.role !== 'dean' && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export const AdminRoute = () => {
  const { user } = useAuth();
  if (user?.role !== 'admin' && user?.role !== 'systemAdmin') {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};
