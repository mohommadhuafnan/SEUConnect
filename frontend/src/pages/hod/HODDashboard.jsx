import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import hodService from '../../services/hodService';
import {
  FileText,
  Users,
  RotateCcw,
  Megaphone,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  BarChart3,
  Award,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  Send,
  X,
  UserCheck
} from 'lucide-react';

export const HODDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Pagination for registration queue
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'sign', 'repeat', 'escalate', 'report'
  const [selectedReg, setSelectedReg] = useState(null);
  const [signingLoading, setSigningLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Escalation form state
  const [escalationForm, setEscalationForm] = useState({
    title: '',
    category: 'Medical',
    priority: 'Medium',
    details: ''
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await hodService.getDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load HOD dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSign = async (reg) => {
    try {
      setSigningLoading(true);
      const res = await hodService.signRegistration(reg._id);
      if (res.success) {
        showToast(`Registration for ${reg.studentName} (${reg.subjectCode}) signed and forwarded to Dean's Office.`);
        setActiveModal(null);
        fetchDashboard();
      }
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSigningLoading(false);
    }
  };

  const handleEscalateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await hodService.createEscalation(escalationForm);
      if (res.success) {
        showToast('Case successfully escalated to the Faculty Board agenda!');
        setActiveModal(null);
        setEscalationForm({ title: '', category: 'Medical', priority: 'Medium', details: '' });
        fetchDashboard();
      }
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e40af' }}>SEUConnect</div>
          <div style={{ color: '#64748b', marginTop: '6px' }}>Loading Head of Department workspace...</div>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    registrationFormsPending: 12,
    studentsBelow80Attendance: 8,
    repeatCandidatesNearingLimit: 5,
    escalationsToFacultyBoard: 3
  };

  const queue = data?.registrationQueue || [];
  const paginatedQueue = queue.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(queue.length / pageSize) || 1;

  const attendanceList = data?.attendanceMonitor || [];
  const boardPrep = data?.boardOfExaminersPrep || [];

  return (
    <div className="hod-dashboard-container" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          borderLeft: '4px solid #2563eb'
        }}>
          <CheckCircle2 size={18} color="#60a5fa" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          HERO BANNER (Mockup Match)
          ===================================================================== */}
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e0edff 100%)',
        border: '1px solid #bfdbfe',
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.06)'
      }}>
        {/* Background Building Illustration Watermark */}
        <div style={{
          position: 'absolute',
          right: '80px',
          bottom: '-10px',
          opacity: 0.18,
          pointerEvents: 'none'
        }}>
          <Building2 size={240} color="#1e40af" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1 }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Building2 size={30} />
          </div>

          <div>
            <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Good Morning, Dr. Amara Silva
            </h1>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e3a8a', marginTop: '3px' }}>
              Department of Information &amp; Communication Technology
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Overseeing academic excellence</span>
              <span>•</span>
              <span>Supporting our students</span>
              <span>•</span>
              <span>Building the future</span>
            </div>
          </div>
        </div>

        {/* HOD Role Badge */}
        <div style={{
          zIndex: 1,
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '8px 18px',
          borderRadius: '9999px',
          fontWeight: 700,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
        }}>
          <UserCheck size={16} />
          <span>HOD</span>
        </div>
      </div>

      {/* =====================================================================
          4 TOP KPI METRIC CARDS (Exact match to Mockup 2)
          ===================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {/* KPI 1 */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FileText size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {kpis.registrationFormsPending}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Registration Forms Pending Signature
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/hod/registrations')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginTop: '16px',
              color: '#2563eb',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textAlign: 'left'
            }}
          >
            View queue &rarr;
          </button>
        </div>

        {/* KPI 2 */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {kpis.studentsBelow80Attendance}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Students Below 80% Attendance
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/hod/attendance')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginTop: '16px',
              color: '#2563eb',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textAlign: 'left'
            }}
          >
            View students &rarr;
          </button>
        </div>

        {/* KPI 3 */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#fffbeb',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {kpis.repeatCandidatesNearingLimit}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Repeat Candidates Nearing Limit
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('repeat')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginTop: '16px',
              color: '#2563eb',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textAlign: 'left'
            }}
          >
            View details &rarr;
          </button>
        </div>

        {/* KPI 4 */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#f5f3ff',
              color: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Megaphone size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {kpis.escalationsToFacultyBoard}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Escalations to Faculty Board
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/hod/escalations')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginTop: '16px',
              color: '#2563eb',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textAlign: 'left'
            }}
          >
            View escalations &rarr;
          </button>
        </div>
      </div>

      {/* =====================================================================
          MAIN 3-COLUMN CONTENT GRID (Mockup Match)
          ===================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.9fr 0.9fr',
        gap: '20px'
      }}>
        {/* =================================================================
            COLUMN 1: Registration Sign-off Queue
            ================================================================= */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={18} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Registration Sign-off Queue
                </h2>
              </div>
              <span style={{
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '12px'
              }}>
                {queue.length} pending
              </span>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600 }}>Student Name</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600 }}>Subject</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600 }}>Teacher Signature</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedQueue.map((reg, idx) => {
                    const isSigned = reg.teacherSignature === 'Signed';
                    const isHodSigned = reg.hodSignature === 'Signed';
                    return (
                      <tr key={reg._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '10px 6px', color: 'var(--text-muted)' }}>
                          {(page - 1) * pageSize + idx + 1}
                        </td>
                        <td style={{ padding: '10px', color: 'var(--text-main)' }}>
                          <div style={{ fontWeight: 600 }}>{reg.studentName}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{reg.regNo}</div>
                        </td>
                        <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                          {reg.subjectDisplay || `${reg.subjectCode} - ${reg.subjectTitle}`}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: isSigned ? '#ecfdf5' : '#fef2f2',
                            color: isSigned ? '#059669' : '#dc2626'
                          }}>
                            {isSigned ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {isSigned ? 'Signed' : 'Missing'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                          {isHodSigned ? (
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Done</span>
                          ) : isSigned ? (
                            <button
                              onClick={() => { setSelectedReg(reg); setActiveModal('sign'); }}
                              style={{
                                backgroundColor: '#2563eb',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 14px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background-color 0.15s ease'
                              }}
                            >
                              Sign
                            </button>
                          ) : (
                            <button
                              onClick={() => { setSelectedReg(reg); setActiveModal('sign'); }}
                              style={{
                                backgroundColor: '#2563eb',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 14px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Sign
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}>
            <span>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, queue.length)} of {queue.length}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  opacity: page === 1 ? 0.5 : 1
                }}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    border: '1px solid var(--border-color)',
                    backgroundColor: page === i + 1 ? '#2563eb' : 'transparent',
                    color: page === i + 1 ? '#ffffff' : 'var(--text-main)',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    fontWeight: page === i + 1 ? 700 : 500
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                style={{
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  opacity: page === totalPages ? 0.5 : 1
                }}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================
            COLUMN 2: Attendance & Eligibility Monitor
            ================================================================= */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Calendar size={18} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Attendance &amp; Eligibility Monitor
                </h2>
              </div>
              <button
                onClick={() => navigate('/hod/attendance')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View all &rarr;
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 8px', fontWeight: 600 }}>Student Name</th>
                    <th style={{ padding: '8px 8px', fontWeight: 600 }}>Attendance</th>
                    <th style={{ padding: '8px 8px', fontWeight: 600, textAlign: 'right' }}>Eligibility</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.map((st) => {
                    const isAtRisk = st.attendance < 80;
                    return (
                      <tr key={st.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '8px 8px', color: 'var(--text-main)' }}>
                          <div style={{ fontWeight: 600 }}>{st.studentName}</div>
                          {st.regNo && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{st.regNo}</div>}
                        </td>
                        <td style={{
                          padding: '8px 8px',
                          fontWeight: 700,
                          color: isAtRisk ? '#ef4444' : '#10b981'
                        }}>
                          {st.attendance}%
                        </td>
                        <td style={{ padding: '8px 8px', textAlign: 'right' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: isAtRisk ? '#fef2f2' : '#ecfdf5',
                            color: isAtRisk ? '#dc2626' : '#059669'
                          }}>
                            {isAtRisk ? 'At Risk' : 'Eligible'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{
            paddingTop: '12px',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Showing 1-{attendanceList.length} of {attendanceList.length}
          </div>
        </div>

        {/* =================================================================
            COLUMN 3: Board of Examiners Prep (CA / ESA Progress Bars)
            ================================================================= */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Award size={18} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Board of Examiners Prep
                </h2>
              </div>
              <button
                onClick={() => navigate('/hod/board-prep')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View all &rarr;
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              CA / ESA Completion Status
            </div>

            {/* Progress list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {boardPrep.map((sub) => (
                <div key={sub.code} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-main)' }}>{sub.code}</span>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>CA: <strong style={{ color: sub.caCompletion === 100 ? '#10b981' : '#2563eb' }}>{sub.caCompletion}%</strong></span>
                      <span>ESA: <strong style={{ color: sub.esaCompletion >= 80 ? '#10b981' : sub.esaCompletion >= 60 ? '#f59e0b' : '#ef4444' }}>{sub.esaCompletion}%</strong></span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {sub.title}
                  </div>

                  {/* Dual Bar */}
                  <div style={{ display: 'flex', gap: '6px', width: '100%', alignItems: 'center' }}>
                    {/* CA bar */}
                    <div style={{ flex: 1, height: '7px', backgroundColor: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${sub.caCompletion}%`,
                        height: '100%',
                        backgroundColor: sub.caCompletion === 100 ? '#10b981' : '#2563eb',
                        borderRadius: '4px'
                      }} />
                    </div>
                    {/* ESA bar */}
                    <div style={{ flex: 1, height: '7px', backgroundColor: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${sub.esaCompletion}%`,
                        height: '100%',
                        backgroundColor: sub.esaCompletion >= 80 ? '#10b981' : sub.esaCompletion >= 60 ? '#f59e0b' : '#ef4444',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.72rem',
            color: 'var(--text-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>ⓘ Completion % based on submitted materials</span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM QUICK ACTIONS BAR (Exact match to Mockup 2)
          ===================================================================== */}
      <div style={{
        backgroundColor: '#f0f7ff',
        border: '1px solid #bfdbfe',
        borderRadius: '14px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lightbulb size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
              Quick Actions
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Access key department functions and manage your academic workflows efficiently.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/hod/registrations')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#1e293b',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <FileText size={15} color="#2563eb" />
            <span>View Registration Queue</span>
          </button>

          <button
            onClick={() => navigate('/hod/attendance')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#1e293b',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Calendar size={15} color="#059669" />
            <span>Check Attendance Report</span>
          </button>

          <button
            onClick={() => navigate('/hod/board-prep')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#1e293b',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Users size={15} color="#7c3aed" />
            <span>Exam Board Preparation</span>
          </button>

          <button
            onClick={() => setActiveModal('escalate')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#1e293b',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <BarChart3 size={15} color="#ea580c" />
            <span>Escalate to Board</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          INTERACTIVE MODAL: Registration Sign-off
          ===================================================================== */}
      {activeModal === 'sign' && selectedReg && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>HOD Subject Registration Endorsement</h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ marginBottom: '8px' }}><strong>Student:</strong> {selectedReg.studentName} ({selectedReg.regNo})</div>
              <div style={{ marginBottom: '8px' }}><strong>Subject:</strong> {selectedReg.subjectDisplay}</div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Teacher Signature:</strong>{' '}
                <span style={{ color: selectedReg.teacherSignature === 'Signed' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                  {selectedReg.teacherSignature}
                </span>
              </div>
              <div><strong>Registration Date:</strong> {new Date(selectedReg.date || Date.now()).toLocaleDateString()}</div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
              By endorsing below as Head of Department (Section 7.2 of Undergraduate Handbook), this subject registration form will be stamped and forwarded directly to the <strong>Office of the Dean</strong> for final intake approval.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                disabled={signingLoading}
                onClick={() => handleSign(selectedReg)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                {signingLoading ? 'Affixing HOD Seal...' : 'Sign and Forward to Dean'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          INTERACTIVE MODAL: Repeat Candidates Tracker
          ===================================================================== */}
      {activeModal === 'repeat' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RotateCcw size={20} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Repeat Candidates Nearing 3-Attempt Limit</h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '14px' }}>
              Per Section 4.3 of university examination rules, candidates are granted a maximum of three attempts per module. Candidates approaching or requesting a 4th grace attempt require Faculty Board approval.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {[
                { name: 'K.L. Fathima Nusra', reg: '22ICT012', sub: 'ICT21013 Data Structures', attempts: 2, status: 'Final 3rd Attempt Allowed' },
                { name: 'S. Thevakanthan', reg: '22ICT034', sub: 'ICT21023 Database Systems', attempts: 2, status: 'Final 3rd Attempt Allowed' },
                { name: 'P. Kavishan', reg: '22ICT067', sub: 'ICT12023 Mathematics for Computing', attempts: 3, status: 'Exceeded 3 Attempts — Grace Appeal Submitted' },
                { name: 'A.H. Mohamed Rizwan', reg: '22ICT055', sub: 'ICT22023 Operating Systems', attempts: 2, status: 'Final 3rd Attempt Allowed' },
                { name: 'M.S. Akeel Ahamed', reg: '23ICT019', sub: 'ICT11023 Structured Programming', attempts: 2, status: 'Final 3rd Attempt Allowed' }
              ].map((c, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: c.attempts >= 3 ? '#fffbeb' : '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.name} ({c.reg})</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.sub}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: c.attempts >= 3 ? '#fee2e2' : '#fef3c7',
                      color: c.attempts >= 3 ? '#b91c1c' : '#b45309'
                    }}>
                      Attempt {c.attempts + 1} of 3
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>{c.status}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          INTERACTIVE MODAL: Escalate to Faculty Board
          ===================================================================== */}
      {activeModal === 'escalate' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '560px',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Megaphone size={20} color="#8b5cf6" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Escalate Case to Faculty Board</h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEscalateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Agenda Item Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Repeat Grace Chance - MATH301"
                  value={escalationForm.title}
                  onChange={(e) => setEscalationForm({ ...escalationForm, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={escalationForm.category}
                    onChange={(e) => setEscalationForm({ ...escalationForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Medical">Medical Certificate Recommendation</option>
                    <option value="Repeat Grace">Repeat Grace Chance</option>
                    <option value="Exam Dates">Exam Date Proposal</option>
                    <option value="Special Needs">Special Needs Accommodation</option>
                    <option value="Discipline">Disciplinary Case</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Priority
                  </label>
                  <select
                    value={escalationForm.priority}
                    onChange={(e) => setEscalationForm({ ...escalationForm, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  HOD Recommendation &amp; Case Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the case facts, candidate medical or repeat record, and specific recommendation for the Faculty Board."
                  value={escalationForm.details}
                  onChange={(e) => setEscalationForm({ ...escalationForm, details: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Submit to Faculty Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODDashboard;
