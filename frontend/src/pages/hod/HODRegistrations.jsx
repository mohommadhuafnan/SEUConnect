import React, { useState, useEffect } from 'react';
import hodService from '../../services/hodService';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

export const HODRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [filterSig, setFilterSig] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState('');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await hodService.getRegistrations();
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

  const handleSignSingle = async (id) => {
    try {
      const res = await hodService.signRegistration(id);
      if (res.success) {
        setToast('Subject registration signed and forwarded to Dean Office.');
        fetchRegistrations();
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBatchSign = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await hodService.batchSignRegistrations(selectedIds);
      if (res.success) {
        setToast(`Successfully batch signed ${selectedIds.length} registration forms.`);
        setSelectedIds([]);
        fetchRegistrations();
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = registrations.filter(r => {
    const matchesSig = filterSig === 'ALL' || r.teacherSignature === filterSig;
    const matchesSearch = !search ||
      r.studentId?.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.subjectId?.code?.toLowerCase().includes(search.toLowerCase());
    return matchesSig && matchesSearch;
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Subject Registration Sign-off Queue</h1>
          <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
            Handbook Section 7.2: Head of Department and Teacher Sign-off Management
          </div>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBatchSign}
            style={{
              backgroundColor: '#2563eb',
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
            <CheckSquare size={16} />
            <span>Batch Sign Selected ({selectedIds.length})</span>
          </button>
        )}
      </div>

      {/* Filters */}
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
            placeholder="Search by student name, reg no, or subject code..."
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
          {['ALL', 'Signed', 'Missing'].map(sig => (
            <button
              key={sig}
              onClick={() => setFilterSig(sig)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: filterSig === sig ? '#2563eb' : 'transparent',
                color: filterSig === sig ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Teacher: {sig}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead style={{ backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border-color)' }}>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 14px', width: '40px' }}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(filtered.filter(r => r.hodSignature !== 'Signed').map(r => r._id));
                    else setSelectedIds([]);
                  }}
                  checked={selectedIds.length > 0 && selectedIds.length === filtered.filter(r => r.hodSignature !== 'Signed').length}
                />
              </th>
              <th style={{ padding: '12px' }}>Student</th>
              <th style={{ padding: '12px' }}>Registration No</th>
              <th style={{ padding: '12px' }}>Subject Code &amp; Title</th>
              <th style={{ padding: '12px' }}>Teacher Signature</th>
              <th style={{ padding: '12px' }}>HOD Signature</th>
              <th style={{ padding: '12px' }}>Dean Office Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading registration sign-off queue...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No subject registration records found matching the criteria.
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const isHodSigned = r.hodSignature === 'Signed';
                const isTeacherSigned = r.teacherSignature === 'Signed';

                return (
                  <tr key={r._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <input
                        type="checkbox"
                        disabled={isHodSigned}
                        checked={selectedIds.includes(r._id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds([...selectedIds, r._id]);
                          else setSelectedIds(selectedIds.filter(id => id !== r._id));
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {r.studentId?.userId?.name || 'Aisha Rahman'}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      {r.studentId?.registrationNumber || '22ICT001'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ color: '#2563eb' }}>{r.subjectId?.code || 'CS501'}</strong> - {r.subjectId?.title || 'Data Structures'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: isTeacherSigned ? '#ecfdf5' : '#fef2f2',
                        color: isTeacherSigned ? '#059669' : '#dc2626',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {isTeacherSigned ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {r.teacherSignature || 'Signed'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: isHodSigned ? '#ecfdf5' : '#fffbeb',
                        color: isHodSigned ? '#059669' : '#d97706'
                      }}>
                        {r.hodSignature || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: r.deanOfficeStatus === 'Approved' ? '#ecfdf5' : '#eff6ff',
                        color: r.deanOfficeStatus === 'Approved' ? '#059669' : '#2563eb'
                      }}>
                        {r.deanOfficeStatus || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {isHodSigned ? (
                        <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>Endorsed</span>
                      ) : (
                        <button
                          onClick={() => handleSignSingle(r._id)}
                          style={{
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                        >
                          Sign Form
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HODRegistrations;
