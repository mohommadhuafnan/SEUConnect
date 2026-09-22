import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  BookOpen,
  UserCheck,
  Eye,
  EyeOff,
  Building2,
  Sparkles
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('22ict085@seu.ac.lk');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    if (role === 'student') {
      setEmail('22ict085@seu.ac.lk');
      setPassword('password123');
    } else if (role === 'lecturer') {
      setEmail('rk@seu.ac.lk');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@seu.ac.lk');
      setPassword('password123');
    }
  };

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

  return (
    <div className="login-page-container">
      {/* Dynamic Background with Faculty Photo & Cinematic Overlay */}
      <div className="login-bg-media" />
      <div className="login-overlay-gradient" />

      <div className="login-content-wrapper">
        {/* Institutional Badge Above Card */}
        <div className="login-institution-header">
          <div className="seu-crest-box">
            <span>SEU</span>
          </div>
          <div>
            <h1 className="login-portal-title">SEUConnect</h1>
            <p className="login-portal-subtitle">
              Faculty of Technology · South Eastern University of Sri Lanka
            </p>
          </div>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="login-glass-card">
          <div className="login-card-header">
            <h2 className="login-welcome-title">University Portal Sign In</h2>
            <p className="login-welcome-desc">
              Access examinations, continuous assessment, attendance, and faculty guidance.
            </p>
          </div>

          {/* Role Quick Selector Tabs */}
          <div className="role-tabs-container">
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`role-tab-btn ${selectedRole === 'student' ? 'active' : ''}`}
            >
              <GraduationCap size={15} />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('lecturer')}
              className={`role-tab-btn ${selectedRole === 'lecturer' ? 'active' : ''}`}
            >
              <BookOpen size={15} />
              <span>Lecturer</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`role-tab-btn ${selectedRole === 'admin' ? 'active' : ''}`}
            >
              <UserCheck size={15} />
              <span>Administrator</span>
            </button>
          </div>

          {error && (
            <div className="login-error-box">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Institutional Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input login-field"
                  placeholder="e.g. 22ict085@seu.ac.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={17} className="login-field-icon" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Please contact the Faculty Computer Center or Examination Division to reset your credentials.');
                  }}
                  className="login-forgot-link"
                >
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input login-field"
                  placeholder="Enter university password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={17} className="login-field-icon" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary login-submit-btn"
            >
              {loading ? (
                <span>Authenticating with Faculty Directory...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole === 'student' ? 'Student' : selectedRole === 'lecturer' ? 'Lecturer' : 'Administrator'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Account Chips */}
          <div className="login-quick-chips-section">
            <div className="login-quick-title">
              DEMO ACCOUNTS (ONE-CLICK POPULATE)
            </div>
            <div className="login-chips-grid">
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className={`login-chip ${selectedRole === 'student' ? 'selected' : ''}`}
              >
                <strong>M.N.M. Afnan</strong>
                <span>BICT · Sem 5</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('lecturer')}
                className={`login-chip ${selectedRole === 'lecturer' ? 'selected' : ''}`}
              >
                <strong>Dr. R. Ketheeswaran</strong>
                <span>Dept of ICT</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`login-chip ${selectedRole === 'admin' ? 'selected' : ''}`}
              >
                <strong>Faculty Admin</strong>
                <span>Dean's Office</span>
              </button>
            </div>
          </div>

          <div className="login-footer-security">
            <Shield size={13} />
            <span>Secure TLS 1.3 Institutional Portal · Faculty of Technology, SEUSL</span>
          </div>
        </div>
      </div>

      <style>{`
        .login-page-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justifyContent: center;
          position: relative;
          padding: 24px 16px;
          overflow-x: hidden;
        }

        .login-bg-media {
          position: absolute;
          inset: 0;
          background-image: url('/faculty-bg.jpg');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          transform: scale(1.02);
          filter: brightness(0.9);
          z-index: 0;
        }

        .login-overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(11, 31, 58, 0.88) 0%,
            rgba(15, 23, 42, 0.82) 45%,
            rgba(30, 64, 175, 0.75) 100%
          );
          backdrop-filter: blur(4px);
          z-index: 1;
        }

        .login-content-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .login-institution-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          text-align: left;
          width: 100%;
          padding: 0 4px;
        }

        .seu-crest-box {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0b1f3a 0%, #1e40af 100%);
          border: 2px solid #d97706;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.25rem;
          letter-spacing: 0.04em;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
          flex-shrink: 0;
        }

        .login-portal-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.1;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .login-portal-subtitle {
          font-size: 0.78rem;
          color: #cbd5e1;
          margin-top: 3px;
          line-height: 1.3;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        .login-glass-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 32px 28px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        [data-theme="dark"] .login-glass-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .login-card-header {
          margin-bottom: 20px;
        }

        .login-welcome-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }

        .login-welcome-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 4px;
          line-height: 1.4;
        }

        .role-tabs-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          background: var(--bg-page);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          margin-bottom: 20px;
        }

        .role-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 4px;
          font-size: 0.78rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-muted);
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .role-tab-btn.active {
          background: var(--bg-surface);
          color: var(--primary-700);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
        }

        [data-theme="dark"] .role-tab-btn.active {
          background: #1e293b;
          color: #60a5fa;
        }

        .login-field {
          padding-left: 38px !important;
          padding-right: 38px !important;
          height: 44px;
          border-radius: 9px;
          font-size: 0.9rem;
        }

        .login-field-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .login-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .login-forgot-link {
          font-size: 0.75rem;
          color: var(--primary-600);
          font-weight: 500;
          text-decoration: none;
        }

        .login-forgot-link:hover {
          text-decoration: underline;
        }

        .login-submit-btn {
          width: 100%;
          height: 46px;
          font-size: 0.94rem;
          font-weight: 600;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .login-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(30, 64, 175, 0.45);
        }

        .login-error-box {
          background-color: var(--danger-bg);
          border: 1px solid var(--danger);
          color: var(--danger);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .login-quick-chips-section {
          margin-top: 22px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .login-quick-title {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 10px;
        }

        .login-chips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .login-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 7px 6px;
          border-radius: 8px;
          background: var(--bg-page);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .login-chip strong {
          font-size: 0.72rem;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .login-chip span {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .login-chip:hover, .login-chip.selected {
          border-color: var(--primary-600);
          background: var(--primary-50);
        }

        [data-theme="dark"] .login-chip:hover, [data-theme="dark"] .login-chip.selected {
          background: rgba(30, 64, 175, 0.2);
        }

        .login-footer-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 18px;
          font-size: 0.68rem;
          color: var(--text-muted);
          text-align: center;
        }

        @media (max-width: 640px) {
          .login-glass-card {
            padding: 24px 18px;
            border-radius: 16px;
          }
          .login-chips-grid {
            grid-template-columns: 1fr;
          }
          .login-portal-title {
            font-size: 1.35rem;
          }
          .seu-crest-box {
            width: 44px;
            height: 44px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
