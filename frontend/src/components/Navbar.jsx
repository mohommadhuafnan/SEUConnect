import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, Moon, Sun, User as UserIcon, LogOut, Shield, CheckCircle2, ChevronDown, BookOpen, Search } from 'lucide-react';
import studentService from '../services/studentService';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isDean = user?.role === 'dean';
  const isHOD = user?.role === 'hod';

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await studentService.getNotifications();
        if (res.success) {
          setNotifications(res.data.notifications.slice(0, 5));
          setUnreadCount(res.data.unreadCount || (isDean ? 5 : isHOD ? 3 : 0));
        } else {
          setUnreadCount(isDean ? 5 : isHOD ? 3 : 0);
        }
      } catch (err) {
        setUnreadCount(isDean ? 5 : isHOD ? 3 : 0);
      }
    };
    fetchNotifs();
  }, [isDean, isHOD]);

  const handleMarkRead = async (id) => {
    try {
      await studentService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const getSearchPlaceholder = () => {
    if (isDean) return 'Search departments, subjects, or students...';
    if (isHOD) return 'Search students, subjects, or pages...';
    return 'Search portal resources, subjects, or forms...';
  };

  const getInitials = () => {
    if (isDean) return 'DE';
    if (isHOD) return 'DR';
    return user?.name?.slice(0, 2).toUpperCase() || 'US';
  };

  const getUserTitle = () => {
    if (isDean) return 'Dr. Eleanor Grant';
    if (isHOD) return 'Dr. Amara Silva';
    return user?.name || 'User';
  };

  const getUserSubtitle = () => {
    if (isDean) return 'Dean of Faculty';
    if (isHOD) return 'Head of Department';
    return user?.email || '';
  };

  return (
    <header className="seu-navbar" style={{
      height: 'var(--navbar-height)',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <button
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm nav-menu-toggle"
          style={{ padding: '6px 10px' }}
          title="Toggle Navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #0b1f3a 0%, #1e40af 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1rem'
          }}>
            SEU
          </div>
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              SEUConnect
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Faculty of Technology · SEUSL
            </div>
          </div>
        </div>
      </div>

      {/* Center Search Input (Screenshot match) */}
      <div style={{ flex: 1, maxWidth: '480px', display: 'none', margin: '0 auto' }} className="nav-search-container">
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder={getSearchPlaceholder()}
            style={{
              width: '100%',
              padding: '8px 14px 8px 36px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-page)',
              color: 'var(--text-main)',
              fontSize: '0.84rem',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        {/* Role badge */}
        <span className="badge badge-info" style={{
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          backgroundColor: isDean ? '#1e3a8a' : isHOD ? '#0369a1' : undefined,
          color: '#ffffff',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '12px'
        }}>
          {isDean ? 'DEAN' : isHOD ? 'HOD' : user?.role}
        </span>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            display: 'flex'
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              display: 'flex'
            }}
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'var(--danger)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: '0',
              width: '320px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Notifications</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unreadCount} unread</span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n._id}
                      onClick={() => handleMarkRead(n._id)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-light)',
                        backgroundColor: n.isRead ? 'transparent' : 'var(--bg-surface-hover)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-main)' }}>{n.title}</div>
                        {!n.isRead && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-600)' }}></span>}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {n.message.length > 80 ? n.message.slice(0, 80) + '...' : n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu (Avatar Pill Matching Mockup) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isDean ? '#1e3a8a' : isHOD ? '#0284c7' : 'var(--primary-100)',
              color: isDean || isHOD ? '#ffffff' : 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.88rem',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials()
              )}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>{getUserTitle()}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{getUserSubtitle()}</div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          <style>{`
            @media (min-width: 768px) {
              .nav-search-container {
                display: block !important;
              }
            }
          `}</style>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '220px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000,
              padding: '6px'
            }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-light)', marginBottom: '4px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <a
                href={user?.role === 'student' ? '/student/profile' : user?.role === 'lecturer' ? '/lecturer/profile' : '/admin/dashboard'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)'
                }}
                className="btn-menu-item"
              >
                <UserIcon size={16} /> My Profile
              </a>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  color: 'var(--danger)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
