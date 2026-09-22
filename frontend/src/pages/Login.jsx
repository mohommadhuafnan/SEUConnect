import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both university email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(res.redirectPath, { replace: true });
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Authentication service error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setTestAccount = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0b1f3a',
      backgroundImage: 'radial-gradient(circle at 50% 20%, #163e75 0%, #0b1f3a 70%)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'var(--bg-surface, #ffffff)',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        padding: '36px 32px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* University Crest Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            backgroundColor: '#0b1f3a',
            border: '2px solid #d97706',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.4rem',
            marginBottom: '12px'
          }}>
            SEU
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b1f3a', letterSpacing: '-0.02em', margin: 0 }}>
            SEUConnect
          </h1>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e40af', marginTop: '3px' }}>
            Faculty of Technology
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            South Eastern University of Sri Lanka
          </div>
          <div style={{
            display: 'inline-block',
            marginTop: '12px',
            padding: '4px 12px',
            backgroundColor: '#eff6ff',
            color: '#1e40af',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            Internal University Portal
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px'
          }}>
            <AlertCircle size={16} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">University Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. 22ict085@seu.ac.lk / rk@seu.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '38px' }}
                required
              />
              <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact the Faculty Technology Computer Center or Examination Division to reset your institutional credentials.'); }} style={{ fontSize: '0.75rem', color: '#2563eb' }}>
                Forgot Password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="Enter university password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px' }}
                required
              />
              <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to University Account'}
          </button>
        </form>

        {/* Quick Access Profiles for Testing */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
            Quick Sign-In Test Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setTestAccount('22ict085@seu.ac.lk', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '6px 4px' }}
            >
              Student (Afnan)
            </button>
            <button
              type="button"
              onClick={() => setTestAccount('rk@seu.ac.lk', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '6px 4px' }}
            >
              Lecturer (Dr. RK)
            </button>
            <button
              type="button"
              onClick={() => setTestAccount('admin@seu.ac.lk', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '6px 4px' }}
            >
              Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.72rem', color: '#94a3b8' }}>
          Authorized Institutional Access Only · Academic Session 2025/2026
        </div>
      </div>
    </div>
  );
};

export default Login;
