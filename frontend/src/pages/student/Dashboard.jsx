import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import { processService } from '../../services/extraServices';
import { StatCard, Card } from '../../components/StatCard';
import {
  GraduationCap,
  CalendarCheck,
  ClipboardCheck,
  Clock,
  Search,
  ArrowRight,
  FileSpreadsheet,
  AlertTriangle,
  Award,
  CheckCircle,
  FileText,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await studentService.getDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleProcessSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const res = await processService.searchGuidance(searchQuery);
      if (res.success) {
        setSearchResults(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading student academic profile...
      </div>
    );
  }

  const { student, metrics, performance, deadlines } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Student Welcome Header */}
      <div className="seu-card" style={{
        background: 'linear-gradient(135deg, #0b1f3a 0%, #1e3a8a 100%)',
        color: '#ffffff',
        border: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{
              backgroundColor: 'rgba(217, 119, 6, 0.25)',
              border: '1px solid rgba(217, 119, 6, 0.6)',
              color: '#fbbf24',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              South Eastern University of Sri Lanka · Faculty of Technology
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '8px', color: '#ffffff' }}>
              Good Morning, {student?.name}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px', fontSize: '0.86rem', color: '#cbd5e1' }}>
              <div>Reg No: <strong>{student?.registrationNumber}</strong></div>
              <div>•</div>
              <div>Programme: <strong>{student?.degreeProgramme}</strong></div>
              <div>•</div>
              <div>Current: <strong>Semester 0{student?.currentSemester}</strong></div>
              <div>•</div>
              <div>Specialization: <strong>{student?.specialization}</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/student/gpa')} className="btn btn-secondary btn-sm" style={{ backgroundColor: '#ffffff', color: '#0b1f3a' }}>
              <Award size={16} /> View GPA Report
            </button>
            <button onClick={() => navigate('/student/forms')} className="btn btn-sm" style={{ backgroundColor: '#d97706', color: '#ffffff' }}>
              <FileSpreadsheet size={16} /> Faculty Forms
            </button>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid-4">
        <StatCard
          title="Current SGPA"
          value={metrics?.sgpa?.toFixed(2) || '3.42'}
          subtext="Target: First Class (≥ 3.70)"
          icon={GraduationCap}
          color="primary"
          badgeText={`Sem ${student?.currentSemester}`}
        />
        <StatCard
          title="Current CGPA"
          value={metrics?.cgpa?.toFixed(2) || '3.38'}
          subtext={performance?.estimatedClass || 'Second Upper'}
          icon={Award}
          color="accent"
          badgeText="Cumulative"
        />
        <StatCard
          title="Attendance Standing"
          value={`${metrics?.attendancePercent || 86}%`}
          subtext="ESA Minimum: 80%"
          icon={ClipboardCheck}
          color={metrics?.attendancePercent >= 80 ? 'success' : 'danger'}
          badgeText={metrics?.examEligibility || 'Eligible'}
        />
        <StatCard
          title="Registered Credits"
          value={`${metrics?.registeredCredits || 18} / ${metrics?.maxCredits || 22}`}
          subtext={`${22 - (metrics?.registeredCredits || 18)} credits remaining`}
          icon={CalendarCheck}
          color="primary"
          badgeText="Semester Load"
        />
      </div>

      {/* Process Guidance Search Section ("What do you need to do?") */}
      <div className="seu-card" style={{ borderLeft: '4px solid #1e40af' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="var(--primary-600)" /> What do you need to do?
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Instant institutional guidance: Search faculty procedures, required forms, submission locations, and approval steps.
          </p>
        </div>

        <form onSubmit={handleProcessSearch} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder='Try "I need a medical form", "How do I register repeat exam?", "PIV bank voucher"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={searching}>
            {searching ? 'Searching...' : 'Find Process'}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Suggested:</span>
          {['CA Repeat Form', 'Medical Excuse for Lectures', 'People\'s Bank PIV Voucher', 'Add / Drop Modules'].map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setSearchQuery(topic); }}
              className="badge badge-neutral"
              style={{ cursor: 'pointer', background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)' }}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Search Results Display */}
        {searchResults && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Found Guidance &amp; Forms:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {searchResults.processes?.map(p => (
                <div
                  key={p.processId}
                  onClick={() => navigate(`/student/processes/${p.processId}`)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-hover)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.purpose}</div>
                  </div>
                  <span className="badge badge-info"><BookOpen size={12} /> Process Guide</span>
                </div>
              ))}

              {searchResults.forms?.map(f => (
                <div
                  key={f.formId}
                  onClick={() => navigate(`/student/forms/${f.formId}`)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-hover)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{f.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Submission: {f.submissionLocation}</div>
                  </div>
                  <span className="badge badge-success"><FileText size={12} /> Official Form</span>
                </div>
              ))}

              {searchResults.processes?.length === 0 && searchResults.forms?.length === 0 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                  No exact process found for this query. Ask SEUConnect AI Assistant for interactive help!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Academic Performance Chart & Quick Actions */}
      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Performance Chart */}
        <Card title="Academic Progression Trend (SGPA)">
          <div style={{ height: '240px', width: '100%', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance?.semesterTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="semester" stroke="var(--text-muted)" fontSize={12} />
                <YAxis domain={[2.5, 4.0]} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-main)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sgpa"
                  name="Semester GPA"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#1e40af' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Credits Completed</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{performance?.creditsCompleted || 78}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Credits Remaining</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{performance?.creditsRemaining || 52}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Degree Progress</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#10b981' }}>{performance?.degreeProgressPercent || 60}%</div>
            </div>
          </div>
        </Card>

        {/* Important Quick Actions */}
        <Card title="Quick Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Register Subjects', icon: CalendarCheck, route: '/student/registration' },
              { label: 'Check Attendance', icon: ClipboardCheck, route: '/student/attendance' },
              { label: 'Exam Registration', icon: Award, route: '/student/examination' },
              { label: 'View Results', icon: Award, route: '/student/results' },
              { label: 'Submit Medical Request', icon: FileText, route: '/student/medical' },
              { label: 'Calculate GPA Report', icon: GraduationCap, route: '/student/gpa' },
              { label: 'Degree Progress', icon: ArrowRight, route: '/student/progress' },
              { label: 'Find a Faculty Form', icon: FileSpreadsheet, route: '/student/forms' }
            ].map((act, i) => (
              <button
                key={i}
                onClick={() => navigate(act.route)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', fontSize: '0.84rem', padding: '9px 12px' }}
              >
                <act.icon size={16} color="var(--primary-600)" />
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card title="Upcoming Institutional Deadlines">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {deadlines?.map(dl => (
            <div key={dl.id} style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-warning">{dl.type}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#d97706' }}>{dl.status}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{dl.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> Deadline: {dl.deadline}
              </div>
              <button
                onClick={() => navigate(dl.actionUrl)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '10px' }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
