import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card } from '../../components/StatCard';
import { Bell, Check, Clock, AlertTriangle } from 'lucide-react';

export const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await studentService.getNotifications();
      if (res.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await studentService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Faculty Announcements &amp; Notifications</h1>
        <p>Institutional circulars, examination deadlines, and academic notices published by university administration.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading announcements...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No notifications on record.</div>
        ) : notifications.map(n => (
          <div
            key={n._id}
            className="seu-card"
            style={{
              borderLeft: `4px solid ${n.priority === 'Urgent' ? '#ef4444' : n.priority === 'High' ? '#d97706' : 'var(--primary-600)'}`,
              opacity: n.isRead ? 0.8 : 1
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-info">{n.type}</span>
                <span className={`badge ${n.priority === 'Urgent' || n.priority === 'High' ? 'badge-danger' : 'badge-neutral'}`}>
                  {n.priority}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {new Date(n.createdAt).toLocaleDateString()}
              </div>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{n.title}</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{n.message}</p>

            {!n.isRead && (
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => handleMarkRead(n._id)} className="btn btn-secondary btn-sm">
                  <Check size={14} /> Mark as Read
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const StudentPenalties = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const res = await studentService.getPenalties();
        if (res.success) setPenalties(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPenalties();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Student Disciplinary Standing &amp; Penalties</h1>
        <p>Confidential institutional record of disciplinary notices, library infractions, or examination board decisions strictly isolated to your account.</p>
      </div>

      <div className="seu-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Checking student record...</div>
        ) : penalties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              ✓
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Clean Institutional Record</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
              No active disciplinary inquiries, examination penalties, or administrative holds are registered against your account.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="seu-table">
              <thead>
                <tr>
                  <th>Ref Number</th>
                  <th>Description</th>
                  <th>Related Regulation</th>
                  <th>Issued Date</th>
                  <th>Status</th>
                  <th>Required Action</th>
                </tr>
              </thead>
              <tbody>
                {penalties.map(p => (
                  <tr key={p._id}>
                    <td><strong>{p.refNumber}</strong></td>
                    <td>{p.description}</td>
                    <td>{p.relatedRule}</td>
                    <td>{new Date(p.issuedDate).toLocaleDateString()}</td>
                    <td><span className="badge badge-warning">{p.status}</span></td>
                    <td style={{ color: 'var(--primary-700)', fontWeight: 600 }}>{p.requiredAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
