import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  FileText,
  Award,
  TrendingUp,
  HeartHandshake,
  Users,
  FileSpreadsheet,
  Bell,
  AlertCircle,
  Bot,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckSquare,
  BarChart3,
  Sliders,
  ShieldCheck,
  FolderOpen,
  Building2
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, onOpenAI }) => {
  const { user, logout } = useAuth();
  const [formsDropdownOpen, setFormsDropdownOpen] = useState(true);

  const role = user?.role;

  const renderStudentLinks = () => (
    <>
      <div className="sidebar-section-title">MAIN</div>
      <NavLink to="/student/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <div className="sidebar-section-title">ACADEMIC</div>
      <NavLink to="/student/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <User size={18} />
        <span>Academic Profile</span>
      </NavLink>
      <NavLink to="/student/registration" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <CalendarCheck size={18} />
        <span>Semester Registration</span>
      </NavLink>
      <NavLink to="/student/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <ClipboardList size={18} />
        <span>Attendance</span>
      </NavLink>
      <NavLink to="/student/medical" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <FileText size={18} />
        <span>Medical Requests</span>
      </NavLink>
      <NavLink to="/student/examination" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Award size={18} />
        <span>Examinations</span>
      </NavLink>
      <NavLink to="/student/results" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <BarChart3 size={18} />
        <span>Results</span>
      </NavLink>
      <NavLink to="/student/gpa" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <GraduationCap size={18} />
        <span>GPA / CGPA</span>
      </NavLink>
      <NavLink to="/student/progress" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <TrendingUp size={18} />
        <span>Academic Progress</span>
      </NavLink>

      <div className="sidebar-section-title">STUDENT SERVICES</div>
      <NavLink to="/student/processes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <BookOpen size={18} />
        <span>Process Guidance</span>
      </NavLink>
      <NavLink to="/student/welfare" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <HeartHandshake size={18} />
        <span>Welfare & Scholarships</span>
      </NavLink>
      <NavLink to="/student/societies" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Users size={18} />
        <span>Societies & Clubs</span>
      </NavLink>

      {/* Expandable Faculty Forms & Instructions */}
      <div style={{ marginTop: '4px' }}>
        <button
          onClick={() => setFormsDropdownOpen(!formsDropdownOpen)}
          className="sidebar-link"
          style={{ width: '100%', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileSpreadsheet size={18} />
            <span>Faculty Forms & Instructions</span>
          </div>
          {formsDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {formsDropdownOpen && (
          <div style={{ paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
            <NavLink to="/student/forms" end className={({ isActive }) => `sidebar-sublink ${isActive ? 'active' : ''}`}>
              All Forms & Circulars
            </NavLink>
            <NavLink to="/student/forms?category=Examination" className="sidebar-sublink">
              Examination Forms
            </NavLink>
            <NavLink to="/student/forms?category=Medical / Attendance" className="sidebar-sublink">
              Medical & Attendance
            </NavLink>
            <NavLink to="/student/forms?category=Finance & Fees" className="sidebar-sublink">
              People's Bank PIV Voucher
            </NavLink>
          </div>
        )}
      </div>

      <NavLink to="/student/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Bell size={18} />
        <span>Notifications</span>
      </NavLink>
      <NavLink to="/student/penalties" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <AlertCircle size={18} />
        <span>Penalties / Disciplinary</span>
      </NavLink>
    </>
  );

  const renderLecturerLinks = () => (
    <>
      <div className="sidebar-section-title">MAIN</div>
      <NavLink to="/lecturer/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <div className="sidebar-section-title">ACADEMIC INSTRUCTION</div>
      <NavLink to="/lecturer/courses" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <BookOpen size={18} />
        <span>My Assigned Courses</span>
      </NavLink>
      <NavLink to="/lecturer/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <ClipboardList size={18} />
        <span>Record Attendance</span>
      </NavLink>
      <NavLink to="/lecturer/ca-marks" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <CheckSquare size={18} />
        <span>Continuous Assessment (CA)</span>
      </NavLink>
      <NavLink to="/lecturer/esa-marks" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Award size={18} />
        <span>End Semester Exam (ESA)</span>
      </NavLink>

      <div className="sidebar-section-title">SERVICES & FORMS</div>
      <NavLink to="/student/forms" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <FileSpreadsheet size={18} />
        <span>Faculty Forms & Documents</span>
      </NavLink>
      <NavLink to="/student/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Bell size={18} />
        <span>Faculty Notices</span>
      </NavLink>
      <NavLink to="/lecturer/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <User size={18} />
        <span>My Profile</span>
      </NavLink>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <div className="sidebar-section-title">ADMINISTRATION</div>
      <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} />
        <span>Overview Dashboard</span>
      </NavLink>

      <div className="sidebar-section-title">USER MANAGEMENT</div>
      <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Users size={18} />
        <span>Users & Accounts</span>
      </NavLink>

      <div className="sidebar-section-title">ACADEMIC CONTROL</div>
      <NavLink to="/admin/subjects" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <BookOpen size={18} />
        <span>Curriculum & Subjects</span>
      </NavLink>
      <NavLink to="/admin/medical" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <FileText size={18} />
        <span>Medical Requests Review</span>
      </NavLink>

      <div className="sidebar-section-title">PROCESS & FORMS</div>
      <NavLink to="/admin/processes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <FolderOpen size={18} />
        <span>Process Guidance Manager</span>
      </NavLink>
      <NavLink to="/admin/forms" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <FileSpreadsheet size={18} />
        <span>Faculty Forms Manager</span>
      </NavLink>

      <div className="sidebar-section-title">SYSTEM CONFIG</div>
      <NavLink to="/admin/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Sliders size={18} />
        <span>Academic Rules Engine</span>
      </NavLink>
    </>
  );

  const renderHODLinks = () => (
    <>
      <div className="sidebar-section-title">DEPARTMENT HEAD</div>
      <NavLink to="/hod/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/hod/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Users size={18} />
        <span>Students</span>
      </NavLink>
      <NavLink to="/hod/registrations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <FileText size={18} />
        <span>Registration</span>
      </NavLink>
      <NavLink to="/hod/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <CalendarCheck size={18} />
        <span>Attendance</span>
      </NavLink>
      <NavLink to="/hod/examinations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Award size={18} />
        <span>Examinations</span>
      </NavLink>
      <NavLink to="/hod/board-prep" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <BarChart3 size={18} />
        <span>Reports</span>
      </NavLink>
      <NavLink to="/hod/escalations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <HeartHandshake size={18} />
        <span>Faculty Board</span>
      </NavLink>
      <NavLink to="/admin/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Sliders size={18} />
        <span>Settings</span>
      </NavLink>
    </>
  );

  const renderDeanLinks = () => (
    <>
      <div className="sidebar-section-title">DEAN OFFICE</div>
      <NavLink to="/dean/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/dean/departments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <GraduationCap size={18} />
        <span>Faculty Overview</span>
      </NavLink>
      <NavLink to="/dean/departments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Building2 size={18} />
        <span>Departments</span>
      </NavLink>
      <NavLink to="/dean/withdrawal-risk" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Users size={18} />
        <span>Students</span>
      </NavLink>
      <NavLink to="/dean/registrations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <FileText size={18} />
        <span>Registration</span>
      </NavLink>
      <NavLink to="/dean/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <CalendarCheck size={18} />
        <span>Attendance</span>
      </NavLink>
      <NavLink to="/dean/examinations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Award size={18} />
        <span>Examinations</span>
      </NavLink>
      <NavLink to="/dean/agenda" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <CheckSquare size={18} />
        <span>Faculty Board</span>
      </NavLink>
      <NavLink to="/dean/departments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <BarChart3 size={18} />
        <span>Reports</span>
      </NavLink>
      <NavLink to="/admin/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Sliders size={18} />
        <span>Settings</span>
      </NavLink>
    </>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
          className="mobile-backdrop"
        />
      )}

      <aside className={`seu-sidebar ${isOpen ? 'open' : ''}`} style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        backgroundColor: 'var(--bg-sidebar)',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 999,
        transition: 'transform 0.25s ease'
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--accent-gold)',
            color: '#0b1f3a',
            fontWeight: 900,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            SEU
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.02em', color: '#ffffff' }}>
              SEUConnect
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Faculty of Technology
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}>
          {role === 'student' && renderStudentLinks()}
          {role === 'lecturer' && renderLecturerLinks()}
          {role === 'hod' && renderHODLinks()}
          {role === 'dean' && renderDeanLinks()}
          {(role === 'admin' || role === 'systemAdmin' || role === 'facultyAdmin') && renderAdminLinks()}
        </div>

        {/* Bottom Branding (Mockup match) */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Building2 size={16} color="#60a5fa" />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600 }}>Building Tomorrow Together</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>SEUConnect v1.0</div>
          </div>
        </div>

        {/* Footer Tools */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <button
            onClick={onOpenAI}
            className="sidebar-ai-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(217, 119, 6, 0.15)',
              border: '1px solid rgba(217, 119, 6, 0.4)',
              color: '#fbbf24',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <Bot size={18} />
            <span>SEUConnect AI Assistant</span>
          </button>

          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              textAlign: 'left'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar-section-title {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 10px 12px 4px 12px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 6px;
          color: #cbd5e1;
          font-size: 0.86rem;
          font-weight: 500;
          transition: all 0.15s ease;
          text-decoration: none;
        }
        .sidebar-link:hover {
          background-color: rgba(255,255,255,0.06);
          color: #ffffff;
        }
        .sidebar-link.active {
          background-color: #1e40af;
          color: #ffffff;
          font-weight: 600;
        }
        .sidebar-sublink {
          font-size: 0.8rem;
          color: #94a3b8;
          padding: 6px 10px;
          border-radius: 4px;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .sidebar-sublink:hover, .sidebar-sublink.active {
          color: #ffffff;
        }
        @media (max-width: 1024px) {
          .seu-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            transform: translateX(-100%);
          }
          .seu-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
