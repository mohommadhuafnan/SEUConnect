import React, { useState, useEffect } from 'react';
import hodService from '../../services/hodService';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Bell,
  Mail,
  ArrowRight
} from 'lucide-react';

export const HODAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [notifyModal, setNotifyModal] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('Urgent: Your attendance in one or more courses has dropped below the compulsory 80% threshold required for examination eligibility under Section 4.1 of the University Handbook. Please submit certified medical endorsements or report to the Head of Department office.');
  const [toast, setToast] = useState('');

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await hodService.getAttendance();
      if (res.success) {
        setRecords(res.data.attendanceRecords || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await hodService.sendBulkNotification({
        title: 'Formal Notice: 80% Attendance Threshold Alert',
        message: notifyMessage,
        priority: 'High'
      });
      setToast('Attendance warning notification broadcasted to students.');
      setNotifyModal(false);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = records.filter(r => {
    const matchesFilter = filterStatus === 'ALL' || r.eligibility === filterStatus;
    const matchesSearch = !search ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.regNo.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const atRiskCount = records.filter(r => r.attendance < 80).length;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {toast && (
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderLeft: '4px solid #2563eb'
        }}>
          <CheckCircle2 size={18} color="#60a5fa" />
          <span>{toast}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Attendance &amp; Eligibility Monitor</h1>
          <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
            Handbook Section 4.1: Students below 80% attendance are barred from examinations unless excused.
          </div>
        </div>

        <button
          onClick={() => setNotifyModal(true)}
          style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Bell size={16} />
          <span>Alert At-Risk Students ({atRiskCount})</span>
        </button>
      </div>

      {/* Filter Row */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search student name, registration number, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.85rem',
              width: '100%',
              maxWidth: '360px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'At Risk', 'Eligible'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: filterStatus === st ? '#2563eb' : 'transparent',
                color: filterStatus === st ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead style={{ backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border-color)' }}>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px' }}>Student Name</th>
              <th style={{ padding: '12px' }}>Registration No</th>
              <th style={{ padding: '12px' }}>Course Code</th>
              <th style={{ padding: '12px' }}>Attended / Total</th>
              <th style={{ padding: '12px' }}>Attendance %</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Eligibility Standing</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const isAtRisk = r.attendance < 80;
              return (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {r.studentName}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{r.regNo}</td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#2563eb' }}>{r.subject}</td>
                  <td style={{ padding: '12px' }}>{r.sessionsAttended} / {r.totalSessions} sessions</td>
                  <td style={{ padding: '12px', fontWeight: 800, color: isAtRisk ? '#ef4444' : '#10b981' }}>
                    {r.attendance}%
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      backgroundColor: isAtRisk ? '#fef2f2' : '#ecfdf5',
                      color: isAtRisk ? '#dc2626' : '#059669'
                    }}>
                      {isAtRisk ? 'At Risk (<80%)' : 'Eligible'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Notify Modal */}
      {notifyModal && (
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
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 700 }}>Dispatch Attendance Warning</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
              Broadcast an official notification to all {atRiskCount} students in the department below the 80% threshold.
            </p>
            <form onSubmit={handleSendNotification}>
              <textarea
                rows={5}
                required
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.84rem'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setNotifyModal(false)}
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
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Send Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODAttendance;
