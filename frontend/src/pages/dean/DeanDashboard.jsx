import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import deanService from '../../services/deanService';
import {
  FileText,
  Users,
  Calendar,
  AlertTriangle,
  Building2,
  Zap,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sliders,
  BarChart3,
  X,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const DeanDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Agenda tab filter: 'All', 'Exam Dates', 'Medical', 'Repeat Grace'
  const [agendaTab, setAgendaTab] = useState('All');

  // Interactive Modals
  const [activeModal, setActiveModal] = useState(null); // 'agenda_detail', 'new_agenda', 'intake_queue'
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // New agenda form
  const [newAgendaForm, setNewAgendaForm] = useState({
    title: '',
    category: 'Exam Dates',
    department: 'Department of Information & Communication Tech.',
    priority: 'Medium',
    details: ''
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await deanService.getDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load Dean dashboard.');
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

  const handleUpdateAgendaStatus = async (item, newStatus, decision) => {
    try {
      setActionLoading(true);
      const res = await deanService.updateAgendaItem(item._id, {
        status: newStatus,
        boardDecision: decision || `Status updated to ${newStatus} by Dean of Faculty.`
      });
      if (res.success) {
        showToast(`Agenda item "${item.title}" marked as ${newStatus}.`);
        setActiveModal(null);
        fetchDashboard();
      }
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAgendaSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await deanService.createAgendaItem(newAgendaForm);
      if (res.success) {
        showToast('New agenda item successfully scheduled for next Faculty Board meeting.');
        setActiveModal(null);
        setNewAgendaForm({
          title: '',
          category: 'Exam Dates',
          department: 'Department of Information & Communication Tech.',
          priority: 'Medium',
          details: ''
        });
        fetchDashboard();
      }
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e40af' }}>SEUConnect</div>
          <div style={{ color: '#64748b', marginTop: '6px' }}>Loading Dean of Faculty workspace...</div>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    registrationFormsAtDeanOffice: 24,
    facultyAttendanceCompliance: 87,
    attendanceComplianceDelta: 6,
    facultyBoardAgendaItemsPending: 7,
    highPriorityAgendaItems: 3,
    studentsAtWithdrawalRisk: 14,
    withdrawalRiskDelta: 4
  };

  const departmentComparison = data?.departmentComparison || [];
  const comparisonSummary = data?.comparisonSummary || { facultyAverageAttendance: 85, totalRepeatCandidates: 124 };
  const allAgenda = data?.facultyBoardAgenda || [];

  const filteredAgenda = agendaTab === 'All'
    ? allAgenda
    : allAgenda.filter(item => item.category === agendaTab);

  const categoryCounts = data?.agendaCategoryCounts || {
    all: allAgenda.length,
    examDates: allAgenda.filter(i => i.category === 'Exam Dates').length,
    medical: allAgenda.filter(i => i.category === 'Medical').length,
    repeatGrace: allAgenda.filter(i => i.category === 'Repeat Grace').length
  };

  // April 2025 calendar days setup
  const calendarDays = [
    { day: 31, isPrev: true },
    { day: 1 }, { day: 2 }, { day: 3 },
    { day: 4, hasDeadline: true },
    { day: 5 }, { day: 6 },
    { day: 7 }, { day: 8 }, { day: 9 },
    { day: 10, isSelected: true, hasExam: true },
    { day: 11, hasExam: true }, { day: 12 }, { day: 13 },
    { day: 14, hasExam: true }, { day: 15 }, { day: 16 },
    { day: 17, hasMeeting: true },
    { day: 18, hasDeadline: true }, { day: 19 }, { day: 20 },
    { day: 21 }, { day: 22 }, { day: 23 },
    { day: 24, hasExam: true },
    { day: 25, hasMeeting: true }, { day: 26 }, { day: 27 },
    { day: 28, hasExam: true }, { day: 29 }, { day: 30 },
    { day: 1, isNext: true }, { day: 2, isNext: true }, { day: 3, isNext: true }, { day: 4, isNext: true }
  ];

  return (
    <div className="dean-dashboard-container" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
              Good Morning, Dean — Faculty of Technology
            </h1>
            <div style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Excellence in Teaching</span>
              <span>•</span>
              <span>Innovation in Research</span>
              <span>•</span>
              <span>Impact in Society</span>
            </div>
          </div>
        </div>

        {/* Dean Role Badge */}
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
          <span>DEAN</span>
        </div>
      </div>

      {/* =====================================================================
          4 TOP KPI METRIC CARDS (Exact match to Mockup 1)
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
          boxShadow: 'var(--shadow-sm)'
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
                {kpis.registrationFormsAtDeanOffice}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Registration Forms at Dean's Office
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Awaiting review and approval
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/dean/registrations')}
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
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {kpis.facultyAttendanceCompliance}%
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Faculty-wide Attendance Compliance
              </div>
              <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
                ↑ {kpis.attendanceComplianceDelta}% vs. last term
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/dean/departments')}
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
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {kpis.facultyBoardAgendaItemsPending}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Faculty Board Agenda Items Pending
              </div>
              <div style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 600, marginTop: '4px' }}>
                • {kpis.highPriorityAgendaItems} high priority
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/dean/agenda')}
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
            View agenda &rarr;
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
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {kpis.studentsAtWithdrawalRisk}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>
                Students at Withdrawal Risk
              </div>
              <div style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 600, marginTop: '4px' }}>
                ↑ {kpis.withdrawalRiskDelta} vs. last term
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/dean/withdrawal-risk')}
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
      </div>

      {/* =====================================================================
          MAIN 3-COLUMN CONTENT GRID (Exact Match to Mockup 1)
          ===================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 1.05fr 0.8fr',
        gap: '20px'
      }}>
        {/* =================================================================
            COLUMN 1: Department Comparison Chart
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} color="#2563eb" />
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Department Comparison
                </h2>
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-page)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>This Term</span>
                <ChevronDown size={14} />
              </div>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Attendance Compliance vs. Repeat Candidates
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.74rem', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#1d4ed8', borderRadius: '2px' }} />
                <span>Attendance Compliance (%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#60a5fa', borderRadius: '2px' }} />
                <span>Repeat Candidates (count)</span>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentComparison} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis dataKey="department" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                      fontSize: '0.75rem',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="attendanceCompliance" name="Attendance Compliance (%)" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="repeatCandidates" name="Repeat Candidates (count)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            paddingTop: '12px',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.74rem',
            color: 'var(--text-muted)'
          }}>
            ⓘ Faculty average attendance compliance: <strong>{comparisonSummary.facultyAverageAttendance}%</strong> | Total repeat candidates: <strong>{comparisonSummary.totalRepeatCandidates}</strong>
          </div>
        </div>

        {/* =================================================================
            COLUMN 2: Faculty Board Agenda
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#2563eb" />
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Faculty Board Agenda
                </h2>
              </div>
              <button
                onClick={() => navigate('/dean/agenda')}
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

            {/* Filter Tabs matching Mockup */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {[
                { label: 'All', count: categoryCounts.all },
                { label: 'Exam Dates', count: categoryCounts.examDates },
                { label: 'Medical', count: categoryCounts.medical },
                { label: 'Repeat Grace', count: categoryCounts.repeatGrace }
              ].map(tab => (
                <button
                  key={tab.label}
                  onClick={() => setAgendaTab(tab.label)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    border: 'none',
                    backgroundColor: agendaTab === tab.label ? '#2563eb' : '#f1f5f9',
                    color: agendaTab === tab.label ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Item List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '310px', overflowY: 'auto' }}>
              {filteredAgenda.slice(0, 5).map(item => {
                const isExam = item.category === 'Exam Dates';
                const isMed = item.category === 'Medical';
                const isHigh = item.priority === 'High';
                const isMedPri = item.priority === 'Medium';
                const isApproved = item.status === 'Approved';
                const isUnderReview = item.status === 'Under Review';

                return (
                  <div
                    key={item._id}
                    onClick={() => { setSelectedAgenda(item); setActiveModal('agenda_detail'); }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-page)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isExam ? <Calendar size={16} /> : isMed ? <Plus size={16} /> : <RotateCcw size={16} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {item.department} · {new Date(item.requestedDate || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '10px',
                        backgroundColor: isHigh ? '#fef2f2' : isMedPri ? '#fffbeb' : '#ecfdf5',
                        color: isHigh ? '#dc2626' : isMedPri ? '#d97706' : '#059669'
                      }}>
                        {item.priority}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: isApproved ? '#ecfdf5' : isUnderReview ? '#f0fdfa' : '#eff6ff',
                        color: isApproved ? '#059669' : isUnderReview ? '#0d9488' : '#2563eb'
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
            <button
              onClick={() => navigate('/dean/agenda')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#2563eb',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View all agenda items &rarr;
            </button>
          </div>
        </div>

        {/* =================================================================
            COLUMN 3: Examination Scheduling Calendar
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#2563eb" />
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Examination Scheduling
                </h2>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                April 2025 v
              </div>
            </div>

            {/* Calendar Widget */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.72rem' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} style={{ fontWeight: 700, color: 'var(--text-muted)', padding: '4px 0' }}>
                  {day}
                </div>
              ))}

              {calendarDays.slice(0, 35).map((d, i) => (
                <div
                  key={i}
                  style={{
                    height: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    color: d.isPrev || d.isNext ? '#cbd5e1' : 'var(--text-main)',
                    fontWeight: d.isSelected ? 800 : 500,
                    backgroundColor: d.isSelected ? '#2563eb' : 'transparent',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <span style={{ color: d.isSelected ? '#ffffff' : undefined }}>{d.day}</span>
                  {/* Event Dots */}
                  <div style={{ display: 'flex', gap: '2px', position: 'absolute', bottom: '2px' }}>
                    {d.hasExam && <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: d.isSelected ? '#ffffff' : '#2563eb' }} />}
                    {d.hasMeeting && <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#0d9488' }} />}
                    {d.hasDeadline && <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#f97316' }} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} /> Exams
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0d9488' }} /> Board Meeting
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f97316' }} /> Deadline
              </span>
            </div>
          </div>

          {/* Next Window Callout */}
          <div
            onClick={() => navigate('/dean/examinations')}
            style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={18} color="#2563eb" />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a' }}>
                  Next exam scheduling window
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Starts 21 Apr 2025 (3 days remaining)
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#2563eb" />
          </div>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM QUICK ACTIONS BAR (Exact match to Mockup 1)
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
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
              Quick Actions
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Manage faculty-level operations and approvals efficiently.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/dean/agenda')}
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
            <span>View Faculty Board Agenda</span>
          </button>

          <button
            onClick={() => navigate('/dean/examinations')}
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
            <span>Manage Exam Schedule</span>
          </button>

          <button
            onClick={() => setActiveModal('new_agenda')}
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
            <Plus size={15} color="#7c3aed" />
            <span>Add Agenda Item</span>
          </button>

          <button
            onClick={() => navigate('/dean/departments')}
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
            <Users size={15} color="#ea580c" />
            <span>View Department Performance</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          INTERACTIVE MODAL: Agenda Item Review & Board Decision
          ===================================================================== */}
      {activeModal === 'agenda_detail' && selectedAgenda && (
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
                <FileText size={20} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Faculty Board Agenda Review</h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ marginBottom: '8px' }}><strong>Title:</strong> {selectedAgenda.title}</div>
              <div style={{ marginBottom: '8px' }}><strong>Category:</strong> {selectedAgenda.category}</div>
              <div style={{ marginBottom: '8px' }}><strong>Department:</strong> {selectedAgenda.department}</div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Priority:</strong>{' '}
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  backgroundColor: selectedAgenda.priority === 'High' ? '#fef2f2' : '#fffbeb',
                  color: selectedAgenda.priority === 'High' ? '#dc2626' : '#d97706'
                }}>
                  {selectedAgenda.priority}
                </span>
              </div>
              <div style={{ marginBottom: '8px' }}><strong>Current Status:</strong> {selectedAgenda.status}</div>
              <div><strong>Details:</strong> {selectedAgenda.details || 'No additional notes attached.'}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                disabled={actionLoading}
                onClick={() => handleUpdateAgendaStatus(selectedAgenda, 'Under Review')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#f1f5f9',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem'
                }}
              >
                Mark Under Review
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleUpdateAgendaStatus(selectedAgenda, 'Approved', 'Approved by Dean & Faculty Board under Section 4.1')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}
              >
                Approve (Faculty Board)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          INTERACTIVE MODAL: Add New Faculty Board Agenda Item
          ===================================================================== */}
      {activeModal === 'new_agenda' && (
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
                <Plus size={20} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Add Faculty Board Agenda Item</h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAgendaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Agenda Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exam Date Proposal - IT402"
                  value={newAgendaForm.title}
                  onChange={(e) => setNewAgendaForm({ ...newAgendaForm, title: e.target.value })}
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
                    value={newAgendaForm.category}
                    onChange={(e) => setNewAgendaForm({ ...newAgendaForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Exam Dates">Exam Dates</option>
                    <option value="Medical">Medical Certificate</option>
                    <option value="Repeat Grace">Repeat Grace Chance</option>
                    <option value="Special Needs">Special Needs Examination</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Priority
                  </label>
                  <select
                    value={newAgendaForm.priority}
                    onChange={(e) => setNewAgendaForm({ ...newAgendaForm, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Department
                </label>
                <select
                  value={newAgendaForm.department}
                  onChange={(e) => setNewAgendaForm({ ...newAgendaForm, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Department of Information & Communication Tech.">CS &amp; IT (Dept of ICT)</option>
                  <option value="Department of Electrical Engineering">Electrical Engineering</option>
                  <option value="Department of Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Department of Business & Management">Business &amp; Management</option>
                  <option value="Department of Civil Engineering">Civil Engineering</option>
                  <option value="Department of Mathematics">Math &amp; Physics</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Board Motion &amp; Memorandum Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline the matter requiring decision by the Faculty Board (Section 1.2 & 4.1 of Handbook)."
                  value={newAgendaForm.details}
                  onChange={(e) => setNewAgendaForm({ ...newAgendaForm, details: e.target.value })}
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
                  disabled={actionLoading}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Schedule on Board Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeanDashboard;
