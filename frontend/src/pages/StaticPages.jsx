import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleReturn = () => {
    if (user?.role === 'student') navigate('/student/dashboard');
    else if (user?.role === 'lecturer') navigate('/lecturer/dashboard');
    else if (user?.role === 'admin') navigate('/admin/dashboard');
    else navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-page)',
      padding: '24px'
    }}>
      <div className="seu-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '40px 32px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <ShieldAlert size={36} />
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          403 — Unauthorized Access
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          You do not possess the required institutional privileges or security clearance to access this resource.
        </p>
        <button onClick={handleReturn} className="btn btn-primary" style={{ width: '100%' }}>
          <ArrowLeft size={16} /> Return to Your Authorized Dashboard
        </button>
      </div>
    </div>
  );
};

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-page)',
      padding: '24px'
    }}>
      <div className="seu-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '40px 32px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary-700)', lineHeight: 1 }}>
          404
        </h1>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '12px 0 6px 0', color: 'var(--text-main)' }}>
          Page Not Found
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
          The requested university module or record does not exist on SEUConnect.
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ width: '100%' }}>
          Go Back
        </button>
      </div>
    </div>
  );
};
