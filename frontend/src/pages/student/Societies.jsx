import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card } from '../../components/StatCard';
import { Users, UserPlus, CheckCircle2 } from 'lucide-react';

export const StudentSocieties = () => {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchSocieties = async () => {
    try {
      const res = await studentService.getSocieties();
      if (res.success) setSocieties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  const handleJoin = async (id) => {
    try {
      const res = await studentService.joinSociety(id);
      if (res.success) {
        setMsg('Membership joined successfully!');
        await fetchSocieties();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Faculty Societies &amp; Student Clubs</h1>
        <p>Explore co-curricular organizations, hackathons, open source clubs, and department associations.</p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading faculty societies...
          </div>
        ) : societies.map(s => (
          <div key={s._id} className="seu-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-info">{s.category}</span>
                <span className={`badge ${s.membershipStatus === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                  {s.membershipStatus}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{s.name} ({s.shortCode})</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                {s.description}
              </p>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', backgroundColor: 'var(--bg-surface-hover)', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
                <div>President: <strong>{s.president || 'Student Committee'}</strong></div>
                <div>Senior Treasurer: <strong>{s.seniorTreasurer || 'Senior Faculty Member'}</strong></div>
                {s.meetingSchedule && <div style={{ marginTop: '4px' }}>Meetings: <strong>{s.meetingSchedule}</strong></div>}
              </div>
            </div>

            {s.membershipStatus !== 'Active' ? (
              <button onClick={() => handleJoin(s._id)} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                <UserPlus size={14} /> Join Society
              </button>
            ) : (
              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#10b981', fontWeight: 600, padding: '6px' }}>
                ✓ Enrolled Active Member
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSocieties;
