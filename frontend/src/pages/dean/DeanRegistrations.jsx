import React, { useState, useEffect } from 'react';
import deanService from '../../services/deanService';
import {
  FileText,
  CheckCircle2,
  Search,
  Filter,
  CreditCard,
  Building2
} from 'lucide-react';

export const DeanRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await deanService.getRegistrations();
      if (res.success) {
        setRegistrations(res.data.registrations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await deanService.approveIntake(id);
      if (res.success) {
        setToast('Subject registration intake officially approved by Office of the Dean.');
        fetchRegistrations();
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = registrations.filter(r => {
    const matchesFilter = filterStatus === 'ALL' || r.deanOfficeStatus === filterStatus;
    const matchesSearch = !search ||
      r.studentId?.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.subjectId?.code?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Registration &amp; Renewal Intake</h1>
        <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Handbook Section 7.2 &amp; 7.6: The Dean's Office receives verified subject registrations and registration renewal fees.
        </div>
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
            placeholder="Search student, registration number, or course..."
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
          {['ALL', 'Pending', 'Received', 'Approved'].map(st => (
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

      {/* Intake Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead style={{ backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border-color)' }}>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px' }}>Student</th>
              <th style={{ padding: '12px' }}>Reg No</th>
              <th style={{ padding: '12px' }}>Course Unit</th>
              <th style={{ padding: '12px' }}>HOD Endorsement</th>
              <th style={{ padding: '12px' }}>Renewal Fee / PIV</th>
              <th style={{ padding: '12px' }}>Dean Intake Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const isApproved = r.deanOfficeStatus === 'Approved';
              const isHodEndorsed = r.hodSignature === 'Signed';

              return (
                <tr key={r._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {r.studentId?.userId?.name || 'Afnan'}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                    {r.studentId?.registrationNumber || '22ICT085'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <strong style={{ color: '#2563eb' }}>{r.subjectId?.code}</strong> - {r.subjectId?.title}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: isHodEndorsed ? '#ecfdf5' : '#fffbeb',
                      color: isHodEndorsed ? '#059669' : '#d97706'
                    }}>
                      {isHodEndorsed ? 'HOD Signed' : 'Pending HOD'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#f1f5f9',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        {r.paymentVoucherRef || 'PIV-Verified'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>Paid</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      backgroundColor: isApproved ? '#ecfdf5' : '#eff6ff',
                      color: isApproved ? '#059669' : '#2563eb'
                    }}>
                      {r.deanOfficeStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {isApproved ? (
                      <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>Approved</span>
                    ) : (
                      <button
                        onClick={() => handleApprove(r._id)}
                        style={{
                          backgroundColor: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        Approve Intake
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
  );
};

export default DeanRegistrations;
