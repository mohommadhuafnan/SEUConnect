import React, { useState, useEffect } from 'react';
import deanService from '../../services/deanService';
import {
  AlertTriangle,
  Users,
  Search,
  CheckCircle2,
  Mail,
  Send,
  Building2
} from 'lucide-react';

export const DeanWithdrawalRisk = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const fetchWithdrawalRisk = async () => {
    try {
      setLoading(true);
      const res = await deanService.getWithdrawalRisk();
      if (res.success) {
        setList(res.data.withdrawalList || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRisk();
  }, []);

  const handleDispatchNotice = (student) => {
    setToast(`Formal 8-Week Continuous Absence Notice dispatched to ${student.name} and Senior Assistant Registrar.`);
    setTimeout(() => setToast(''), 4000);
  };

  const filtered = list.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.regNo.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

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

      <div>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Continuous Absence &amp; Withdrawal Risk Register</h1>
        <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Handbook Section 3.2: Students absent for 8 or more continuous weeks without certified cause are automatically deemed withdrawn under SEUSL policy.
        </div>
      </div>

      {/* Search */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search candidate name, reg no, or department..."
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

        <div style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 700 }}>
          {list.length} Students At Risk of University Deregistration
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
              <th style={{ padding: '12px' }}>Department</th>
              <th style={{ padding: '12px' }}>Continuous Absence</th>
              <th style={{ padding: '12px' }}>Last Logged Attendance</th>
              <th style={{ padding: '12px' }}>Administrative Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const isImmediate = s.weeksAbsent >= 9;
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {s.name}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{s.regNo}</td>
                  <td style={{ padding: '12px' }}>{s.department}</td>
                  <td style={{ padding: '12px', fontWeight: 800, color: '#dc2626' }}>
                    {s.weeksAbsent} consecutive weeks
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                    {new Date(s.lastAttended).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: isImmediate ? '#fef2f2' : '#fffbeb',
                      color: isImmediate ? '#dc2626' : '#d97706'
                    }}>
                      {s.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDispatchNotice(s)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.76rem',
                        cursor: 'pointer'
                      }}
                    >
                      Dispatch Show-Cause
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeanWithdrawalRisk;
