import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
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
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  HelpCircle,
  X
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('22ict085@seu.ac.lk');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    if (role === 'student') {
      setEmail('22ict085@seu.ac.lk');
      setPassword('password123');
    } else if (role === 'lecturer') {
      setEmail('rk@seu.ac.lk');
      setPassword('password123');
    } else if (role === 'hod') {
      setEmail('hod@seu.ac.lk');
      setPassword('password123');
    } else if (role === 'dean') {
      setEmail('dean@seu.ac.lk');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@seu.ac.lk');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your university email address and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(res.redirectPath, { replace: true });
      } else {
        setError(res.message || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Authentication service is temporarily unavailable. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seu-login-split-page">
      {/* =====================================================================
          LEFT HERO PANEL: Modern University Branding & Campus Highlights
          ===================================================================== */}
      <div className="login-left-hero">
        <div className="hero-bg-media" />
        <div className="hero-overlay-scrim" />

        <div className="hero-inner-content">
          {/* Top Crest & Bilingual Heraldry */}
          <div className="hero-top-crest-block">
            <div className="hero-crest-badge">
              <span className="crest-initials">SEU</span>
              <div className="crest-gold-ring" />
            </div>

            <div className="hero-titles">
              <div className="trilingual-sinhala">ශ්‍රී ලංකා අග්නිදිග විශ්වවිද්‍යාලය</div>
              <div className="trilingual-tamil">இலங்கை தென்கிழக்குப் பல்கலைக்கழகம்</div>
              <div className="trilingual-english">SOUTH EASTERN UNIVERSITY OF SRI LANKA</div>
              <div className="hero-faculty-label">
                Faculty of Technology · Oluvil, Sri Lanka
              </div>
            </div>
          </div>

          {/* Main Brand Message */}
          <div className="hero-center-message">
            <div className="live-status-pill">
              <span className="live-pulse-dot" />
              <span>Academic Year 2025/2026 · Online Campus Portal</span>
            </div>

            <h1 className="hero-headline">
              Integrated Campus Management &amp; Academic Hub
            </h1>

            <p className="hero-description">
              Unified digital infrastructure connecting students, faculty lecturers, departments, and academic administration for South Eastern University of Sri Lanka.
            </p>

            {/* Quick Feature Pillars */}
            <div className="hero-features-grid">
              <div className="hero-feature-item">
                <div className="feature-icon-box">
                  <FileText size={17} />
                </div>
                <div>
                  <div className="feature-title">Official Faculty Forms</div>
                  <div className="feature-desc">7 printable templates, PIV bank slips &amp; repeat exam forms</div>
                </div>
              </div>

              <div className="hero-feature-item">
                <div className="feature-icon-box">
                  <GraduationCap size={17} />
                </div>
                <div>
                  <div className="feature-title">Examinations &amp; Results</div>
                  <div className="feature-desc">Continuous assessment (CA), ESA clearance &amp; GPA tracking</div>
                </div>
              </div>

              <div className="hero-feature-item">
                <div className="feature-icon-box">
                  <Building2 size={17} />
                </div>
                <div>
                  <div className="feature-title">Department Coordination</div>
                  <div className="feature-desc">Dept. of ICT &amp; Dept. of Biosystems Technology</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Campus Metrics & Motto */}
          <div className="hero-bottom-metrics">
            <div className="metric-col">
              <div className="metric-val">1,200+</div>
              <div className="metric-lbl">Undergraduates</div>
            </div>
            <div className="metric-divider" />
            <div className="metric-col">
              <div className="metric-val">100%</div>
              <div className="metric-lbl">Digital Workflows</div>
            </div>
            <div className="metric-divider" />
            <div className="metric-col">
              <div className="metric-val">24/7</div>
              <div className="metric-lbl">Cloud Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          RIGHT PANEL: High-Contrast Institutional Sign-In Card
          ===================================================================== */}
      <div className="login-right-form-panel">
        <div className="login-form-container">
          {/* Mobile Header (displayed on small screens only) */}
          <div className="mobile-crest-header">
            <div className="mobile-crest-box">SEU</div>
            <div>
              <div className="mobile-brand-name">SEUConnect</div>
              <div className="mobile-faculty-sub">Faculty of Technology · SEUSL</div>
            </div>
          </div>

          {/* Form Header */}
          <div className="login-heading-area">
            <div className="portal-badge-pill">
              <Sparkles size={13} color="var(--primary-600)" />
              <span>Official Institutional Sign-In</span>
            </div>
            <h2 className="login-title">Welcome to SEUConnect</h2>
            <p className="login-subtitle">
              Sign in with your official university credentials to access academic records and faculty services.
            </p>
          </div>

          {/* Role Segmented Controller */}
          <div className="role-selector-segmented" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`role-seg-btn ${selectedRole === 'student' ? 'active' : ''}`}
            >
              <GraduationCap size={15} />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('lecturer')}
              className={`role-seg-btn ${selectedRole === 'lecturer' ? 'active' : ''}`}
            >
              <BookOpen size={15} />
              <span>Lecturer</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('hod')}
              className={`role-seg-btn ${selectedRole === 'hod' ? 'active' : ''}`}
            >
              <UserCheck size={15} />
              <span>HOD</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('dean')}
              className={`role-seg-btn ${selectedRole === 'dean' ? 'active' : ''}`}
            >
              <Building2 size={15} />
              <span>Dean</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`role-seg-btn ${selectedRole === 'admin' ? 'active' : ''}`}
            >
              <ShieldCheck size={15} />
              <span>Admin</span>
            </button>
          </div>

          <div className="role-context-hint">
            {selectedRole === 'student' && (
              <span>🎓 <strong>Student Portal:</strong> Access course registration, attendance, exam admission &amp; official faculty forms.</span>
            )}
            {selectedRole === 'lecturer' && (
              <span>📖 <strong>Lecturer Portal:</strong> Record lecture attendance, submit Continuous Assessment (CA) &amp; ESA scores.</span>
            )}
            {selectedRole === 'hod' && (
              <span>👔 <strong>Head of Department:</strong> Sign subject registration forms, monitor &lt;80% attendance, supervise Board of Examiners CA/ESA &amp; escalate cases.</span>
            )}
            {selectedRole === 'dean' && (
              <span>🏛️ <strong>Dean Portal:</strong> Chair Faculty Board, manage registration &amp; fee intake, build agenda, schedule exams &amp; monitor withdrawal risks.</span>
            )}
            {selectedRole === 'admin' && (
              <span>🛡️ <strong>Faculty Administration:</strong> Govern curriculum modules, academic regulations &amp; student identities.</span>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="login-alert-banner">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="input-group-box">
              <label className="input-label" htmlFor="seu-email">
                Institutional Email Address
              </label>
              <div className="input-relative-wrap">
                <input
                  id="seu-email"
                  type="email"
                  className="login-text-input"
                  placeholder="e.g. 22ict085@seu.ac.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <Mail size={17} className="input-leading-icon" />
              </div>
            </div>

            <div className="input-group-box">
              <div className="input-label-row">
                <label className="input-label" htmlFor="seu-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="forgot-password-link"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-relative-wrap">
                <input
                  id="seu-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-text-input"
                  placeholder="Enter university password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Lock size={17} className="input-leading-icon" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-trailing-eye"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-remember-row">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this terminal</span>
              </label>
              <span className="domain-pill">@seu.ac.lk</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-action-btn"
            >
              {loading ? (
                <div className="btn-spinner-wrap">
                  <span className="spinner-circle" />
                  <span>Authenticating with Faculty Directory...</span>
                </div>
              ) : (
                <>
                  <span>
                    Sign In as {selectedRole === 'student' ? 'Student' : selectedRole === 'lecturer' ? 'Lecturer' : 'Administrator'}
                  </span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="demo-accounts-card">
            <div className="demo-header-row">
              <span className="demo-badge">ONE-CLICK DEMO ACCESS</span>
              <span className="demo-hint">Click any profile below to auto-fill</span>
            </div>

            <div className="demo-chips-grid">
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className={`demo-profile-chip ${selectedRole === 'student' ? 'active' : ''}`}
              >
                <div className="demo-avatar student-avatar">ST</div>
                <div className="demo-meta">
                  <div className="demo-name">M.N.M. Afnan</div>
                  <div className="demo-role">Student · BICT Sem 5</div>
                </div>
                {selectedRole === 'student' && <CheckCircle2 size={15} className="demo-check" />}
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('lecturer')}
                className={`demo-profile-chip ${selectedRole === 'lecturer' ? 'active' : ''}`}
              >
                <div className="demo-avatar lecturer-avatar">LE</div>
                <div className="demo-meta">
                  <div className="demo-name">Dr. R. Ketheeswaran</div>
                  <div className="demo-role">Lecturer · Dept of ICT</div>
                </div>
                {selectedRole === 'lecturer' && <CheckCircle2 size={15} className="demo-check" />}
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`demo-profile-chip ${selectedRole === 'admin' ? 'active' : ''}`}
              >
                <div className="demo-avatar admin-avatar">AD</div>
                <div className="demo-meta">
                  <div className="demo-name">Faculty Administrator</div>
                  <div className="demo-role">Dean's Office · Admin</div>
                </div>
                {selectedRole === 'admin' && <CheckCircle2 size={15} className="demo-check" />}
              </button>
            </div>
          </div>

          {/* Security & Institutional Footer */}
          <div className="login-security-footer">
            <div className="security-tag">
              <ShieldCheck size={14} color="#10b981" />
              <span>TLS 1.3 Certified Institutional Security</span>
            </div>
            <div className="university-copyright">
              © {new Date().getFullYear()} South Eastern University of Sri Lanka · Faculty of Technology
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          HELP & CREDENTIAL RESET MODAL
          ===================================================================== */}
      {showHelpModal && (
        <div className="login-modal-backdrop" onClick={() => setShowHelpModal(false)}>
          <div className="login-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="login-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="modal-icon-circle">
                  <HelpCircle size={20} color="var(--primary-600)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    Institutional Account Assistance
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    SEUSL Technology Computer Center &amp; Helpdesk
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="modal-close-btn"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-content-body">
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                Institutional SEUConnect credentials are tied to your official <code>@seu.ac.lk</code> directory account. Password resets require verification by the university systems administrator.
              </p>

              <div className="contact-card-box">
                <div className="contact-row">
                  <Building2 size={16} color="var(--primary-600)" />
                  <div>
                    <strong>Faculty Technology Computer Center (FT-CC)</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ground Floor, Faculty of Technology Complex, Oluvil</div>
                  </div>
                </div>

                <div className="contact-row" style={{ marginTop: '10px' }}>
                  <Mail size={16} color="var(--primary-600)" />
                  <div>
                    <strong>IT Support Email:</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600 }}>cc.ft@seu.ac.lk</div>
                  </div>
                </div>

                <div className="contact-row" style={{ marginTop: '10px' }}>
                  <FileText size={16} color="var(--primary-600)" />
                  <div>
                    <strong>Official Email Request Form:</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>New students can download Form <code>SEU-EMAIL-REQ</code> from the Forms Catalog.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer-action">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Understood, Return to Sign-In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          EMBEDDED STYLES: Responsive Split-Screen Layout & Typography
          ===================================================================== */}
      <style>{`
        .seu-login-split-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          background-color: var(--bg-page);
          color: var(--text-main);
          font-family: var(--font-family);
          overflow-x: hidden;
        }

        /* ---------------- LEFT HERO PANEL ---------------- */
        .login-left-hero {
          position: relative;
          flex: 1.15;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          padding: 48px 56px;
          background-color: #07152b;
          color: #ffffff;
          overflow: hidden;
          border-right: 1px solid rgba(217, 119, 6, 0.28);
        }

        .hero-bg-media {
          position: absolute;
          inset: 0;
          background-image: url('/faculty-bg.jpg');
          background-size: cover;
          background-position: center center;
          transform: scale(1.05);
          filter: brightness(0.85);
          transition: transform 10s ease;
          z-index: 0;
        }

        .seu-login-split-page:hover .hero-bg-media {
          transform: scale(1.08);
        }

        .hero-overlay-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            145deg,
            rgba(7, 21, 43, 0.94) 0%,
            rgba(11, 31, 58, 0.88) 45%,
            rgba(30, 64, 175, 0.82) 100%
          );
          backdrop-filter: blur(3px);
          z-index: 1;
        }

        .hero-inner-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          gap: 36px;
        }

        /* Hero Crest Header */
        .hero-top-crest-block {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .hero-crest-badge {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0b1f3a 0%, #1e40af 100%);
          border: 2px solid #d97706;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .crest-initials {
          font-weight: 900;
          font-size: 1.35rem;
          color: #ffffff;
          letter-spacing: 0.05em;
        }

        .crest-gold-ring {
          position: absolute;
          inset: -4px;
          border-radius: 18px;
          border: 1px dashed rgba(217, 119, 6, 0.6);
        }

        .hero-titles {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .trilingual-sinhala {
          font-size: 0.82rem;
          font-weight: 700;
          color: #fde68a;
          line-height: 1.25;
        }

        .trilingual-tamil {
          font-size: 0.78rem;
          font-weight: 700;
          color: #fef3c7;
          line-height: 1.25;
        }

        .trilingual-english {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #ffffff;
          line-height: 1.3;
          margin-top: 2px;
        }

        .hero-faculty-label {
          font-size: 0.8rem;
          color: #93c5fd;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* Center Content */
        .hero-center-message {
          max-width: 560px;
        }

        .live-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.76rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 20px;
        }

        .live-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulseGreen 2s infinite;
        }

        @keyframes pulseGreen {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        .hero-headline {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin: 0 0 16px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .hero-description {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #cbd5e1;
          margin-bottom: 30px;
        }

        .hero-features-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .hero-feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .hero-feature-item:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateX(4px);
        }

        .feature-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(30, 64, 175, 0.6);
          border: 1px solid rgba(147, 197, 253, 0.4);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
        }

        .feature-desc {
          font-size: 0.76rem;
          color: #94a3b8;
        }

        /* Hero Metrics Bottom */
        .hero-bottom-metrics {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
        }

        .metric-col {
          display: flex;
          flex-direction: column;
        }

        .metric-val {
          font-size: 1.4rem;
          font-weight: 800;
          color: #fde68a;
          letter-spacing: -0.01em;
          line-height: 1;
        }

        .metric-lbl {
          font-size: 0.72rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        .metric-divider {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.15);
        }

        /* ---------------- RIGHT FORM PANEL ---------------- */
        .login-right-form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justifyContent: center;
          padding: 40px 32px;
          background: var(--bg-page);
          min-height: 100vh;
        }

        .login-form-container {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
        }

        /* Mobile Crest Header */
        .mobile-crest-header {
          display: none;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .mobile-crest-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #0b1f3a;
          border: 2px solid #d97706;
          color: #ffffff;
          font-weight: 900;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-brand-name {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .mobile-faculty-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        /* Heading Area */
        .login-heading-area {
          margin-bottom: 24px;
        }

        .portal-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: var(--primary-50);
          color: var(--primary-600);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 10px;
        }

        [data-theme="dark"] .portal-badge-pill {
          background: rgba(30, 64, 175, 0.2);
          color: #93c5fd;
        }

        .login-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          margin: 0 0 6px 0;
          line-height: 1.2;
        }

        .login-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
        }

        /* Role Segmented Controller */
        .role-selector-segmented {
          display: flex;
          padding: 4px;
          background: var(--bg-surface-hover);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          gap: 4px;
          margin-bottom: 10px;
        }

        .role-seg-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .role-seg-btn:hover {
          color: var(--text-main);
        }

        .role-seg-btn.active {
          background: var(--bg-surface);
          color: var(--primary-600);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          font-weight: 700;
        }

        [data-theme="dark"] .role-seg-btn.active {
          color: #60a5fa;
          background: #1e293b;
        }

        .role-context-hint {
          font-size: 0.77rem;
          color: var(--text-muted);
          background: var(--bg-surface);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          margin-bottom: 18px;
          line-height: 1.45;
        }

        /* Alert */
        .login-alert-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          background-color: var(--danger-bg);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--danger);
          font-size: 0.84rem;
          margin-bottom: 18px;
          line-height: 1.4;
        }

        /* Inputs */
        .auth-form-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .forgot-password-link {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--primary-600);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .forgot-password-link:hover {
          color: var(--primary-700);
        }

        .input-relative-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-text-input {
          width: 100%;
          height: 44px;
          padding: 0 42px 0 38px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-main);
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .login-text-input:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .input-leading-icon {
          position: absolute;
          left: 12px;
          color: var(--text-subtle);
          pointer-events: none;
        }

        .input-trailing-eye {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-subtle);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .input-trailing-eye:hover {
          color: var(--text-main);
        }

        .form-remember-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .remember-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .domain-pill {
          font-size: 0.72rem;
          font-family: monospace;
          color: var(--text-subtle);
          background: var(--bg-surface-hover);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border-light);
        }

        .login-action-btn {
          width: 100%;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-600) 100%);
          color: #ffffff;
          border: none;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(30, 64, 175, 0.35);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 4px;
        }

        .login-action-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-700) 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(30, 64, 175, 0.45);
        }

        .login-action-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .btn-spinner-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .spinner-circle {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Demo Accounts Card */
        .demo-accounts-card {
          margin-top: 24px;
          padding: 16px;
          border-radius: var(--radius-lg);
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
        }

        .demo-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .demo-badge {
          font-size: 0.7rem;
          font-weight: 800;
          color: #b45309;
          background: #fef3c7;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        [data-theme="dark"] .demo-badge {
          background: rgba(217, 119, 6, 0.2);
          color: #fde68a;
        }

        .demo-hint {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .demo-chips-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .demo-profile-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-surface-hover);
          color: var(--text-main);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          width: 100%;
        }

        .demo-profile-chip:hover {
          border-color: var(--primary-500);
          background: var(--primary-50);
        }

        [data-theme="dark"] .demo-profile-chip:hover {
          background: rgba(30, 64, 175, 0.15);
        }

        .demo-profile-chip.active {
          border-color: var(--primary-600);
          background: rgba(30, 64, 175, 0.08);
          box-shadow: 0 0 0 1px var(--primary-600);
        }

        .demo-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .student-avatar {
          background: #dbeafe;
          color: #1e40af;
        }

        .lecturer-avatar {
          background: #e0e7ff;
          color: #4338ca;
        }

        .admin-avatar {
          background: #fef3c7;
          color: #92400e;
        }

        .demo-meta {
          flex: 1;
        }

        .demo-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }

        .demo-role {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .demo-check {
          color: var(--primary-600);
        }

        /* Security Footer */
        .login-security-footer {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
        }

        .security-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .university-copyright {
          font-size: 0.7rem;
          color: var(--text-subtle);
        }

        /* Modal */
        .login-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        .login-modal-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 480px;
          padding: 24px;
          box-shadow: var(--shadow-xl);
          animation: slideUp 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .login-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--primary-50);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .modal-close-btn:hover {
          background: var(--bg-surface-hover);
          color: var(--text-main);
        }

        .contact-card-box {
          background: var(--bg-surface-hover);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 14px;
          margin-bottom: 18px;
        }

        .contact-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        /* ---------------- RESPONSIVE BREAKPOINTS ---------------- */
        @media (max-width: 992px) {
          .seu-login-split-page {
            flex-direction: column;
          }

          .login-left-hero {
            flex: none;
            min-height: auto;
            padding: 36px 24px;
            border-right: none;
            border-bottom: 1px solid rgba(217, 119, 6, 0.3);
          }

          .hero-headline {
            font-size: 1.6rem;
          }

          .hero-features-grid,
          .hero-bottom-metrics {
            display: none;
          }

          .mobile-crest-header {
            display: flex;
          }

          .login-right-form-panel {
            padding: 32px 20px;
          }
        }

        @media (max-width: 600px) {
          .login-left-hero {
            padding: 24px 16px;
          }

          .hero-titles .trilingual-sinhala,
          .hero-titles .trilingual-tamil {
            display: none;
          }

          .login-title {
            font-size: 1.5rem;
          }

          .role-seg-btn span {
            font-size: 0.78rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
