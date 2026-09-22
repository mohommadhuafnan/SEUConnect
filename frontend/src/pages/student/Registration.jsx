import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card, StatCard } from '../../components/StatCard';
import { CalendarCheck, Plus, Trash2, CheckCircle2, AlertCircle, Clock, BookOpen } from 'lucide-react';

export const StudentRegistration = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchRegistration = async () => {
    try {
      const res = await studentService.getRegistration();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistration();
  }, []);

  const handleRegister = async (subjectId) => {
    setActionLoading(true);
    setNotification(null);
    try {
      const res = await studentService.registerSubject(subjectId);
      if (res.success) {
        setNotification({ type: 'success', text: res.message });
        await fetchRegistration();
      }
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDrop = async (subjectId) => {
    if (!confirm('Are you sure you want to drop this registered course?')) return;
    setActionLoading(true);
    setNotification(null);
    try {
      const res = await studentService.dropSubject(subjectId);
      if (res.success) {
        setNotification({ type: 'success', text: res.message });
        await fetchRegistration();
      }
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading semester registration data...</div>;
  }

  const { currentSemester, maxCredits, registeredCredits, remainingCreditsAllowed, registeredRecords, availableSubjects } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Semester Subject Registration &amp; Add/Drop</h1>
        <p>Enroll in compulsory and elective subjects for the current semester according to credit workload rules.</p>
      </div>

      {notification && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: notification.type === 'success' ? '#065f46' : '#dc2626',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem'
        }}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Credit Load Indicators */}
      <div className="grid-3">
        <StatCard
          title="Current Registered Credits"
          value={`${registeredCredits || 0} Credits`}
          subtext="Enrolled this semester"
          icon={CalendarCheck}
          color="primary"
          badgeText="Workload"
        />
        <StatCard
          title="Maximum Allowed Credit Load"
          value={`${maxCredits || 22} Credits`}
          subtext="Faculty ceiling per handbook"
          icon={BookOpen}
          color="accent"
          badgeText="Regulatory Limit"
        />
        <StatCard
          title="Available Remaining Capacity"
          value={`${remainingCreditsAllowed || 0} Credits`}
          subtext="Remaining credit slots"
          icon={Plus}
          color="success"
          badgeText="Capacity"
        />
      </div>

      {/* Registration Period Alert */}
      <div className="seu-card" style={{ backgroundColor: 'var(--info-bg)', borderColor: '#bae6fd', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Clock size={24} color="#0284c7" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0369a1' }}>
            Active Registration Window: {currentSemester?.name}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#0284c7', marginTop: '2px' }}>
            Students are permitted to add or drop elective modules until October 31, 2026. Any credit overload beyond 22 credits requires written approval from the Dean.
          </div>
        </div>
      </div>

      {/* Currently Registered Subjects */}
      <Card title={`Enrolled Subjects (${registeredRecords?.length || 0})`}>
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Title</th>
                <th>Credits</th>
                <th>Theory / Practical</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registeredRecords?.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No subjects enrolled yet for this semester.
                  </td>
                </tr>
              ) : (
                registeredRecords?.map(reg => (
                  <tr key={reg._id}>
                    <td><strong>{reg.subjectId?.code}</strong></td>
                    <td>{reg.subjectId?.title}</td>
                    <td><span className="badge badge-neutral">{reg.subjectId?.credits} Credits</span></td>
                    <td>{reg.subjectId?.theoryHours}h Lec / {reg.subjectId?.practicalHours}h Lab</td>
                    <td><span className="badge badge-success">{reg.status}</span></td>
                    <td>
                      <button
                        onClick={() => handleDrop(reg.subjectId?._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)', borderColor: 'var(--border-color)' }}
                        disabled={actionLoading}
                      >
                        <Trash2 size={14} /> Drop
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Available Subjects to Add */}
      <Card title="Available Department Modules">
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Type</th>
                <th>Enrollment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableSubjects?.map(sub => (
                <tr key={sub._id}>
                  <td><strong>{sub.code}</strong></td>
                  <td>{sub.title}</td>
                  <td><span className="badge badge-neutral">{sub.credits} Credits</span></td>
                  <td>{sub.isGPA ? 'GPA Course' : 'Non-GPA'}</td>
                  <td>
                    {sub.isRegistered ? (
                      <span className="badge badge-success">Enrolled</span>
                    ) : (
                      <span className="badge badge-neutral">Available</span>
                    )}
                  </td>
                  <td>
                    {!sub.isRegistered && (
                      <button
                        onClick={() => handleRegister(sub._id)}
                        className="btn btn-primary btn-sm"
                        disabled={actionLoading || registeredCredits + sub.credits > maxCredits}
                      >
                        <Plus size={14} /> Add Subject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentRegistration;
