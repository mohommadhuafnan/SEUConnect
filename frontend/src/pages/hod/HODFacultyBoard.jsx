import React, { useState, useEffect } from 'react';
import hodService from '../../services/hodService';
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  Plus,
  AlertCircle,
  FileText
} from 'lucide-react';

export const HODFacultyBoard = () => {
  const [loading, setLoading] = useState(true);
  const [escalations, setEscalations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Medical',
    priority: 'Medium',
    details: ''
  });
  const [toast, setToast] = useState('');

  const fetchEscalations = async () => {
    try {
      setLoading(true);
      const res = await hodService.getEscalations();
      if (res.success) {
        setEscalations(res.data.escalations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await hodService.createEscalation(form);
      setToast('Matter successfully escalated to the Faculty Board.');
      setShowAddModal(false);
      setForm({ title: '', category: 'Medical', priority: 'Medium', details: '' });
      fetchEscalations();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

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
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Escalations to Faculty Board</h1>
          <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
            Handbook Section 1.2 &amp; 4.1: Departmental matters submitted for Faculty Board determination
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
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
          <Plus size={16} />
          <span>New Escalation</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {escalations.length === 0 && !loading ? (
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
            No departmental cases currently escalated to the Faculty Board.
          </div>
        ) : (
          escalations.map((esc) => {
            const isApproved = esc.status === 'Approved';
            const isUnderReview = esc.status === 'Under Review';
            const isHigh = esc.priority === 'High';

            return (
              <div key={esc._id} style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{esc.title}</span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#eff6ff',
                        color: '#2563eb'
                      }}>
                        {esc.category}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: isHigh ? '#fef2f2' : '#fffbeb',
                        color: isHigh ? '#dc2626' : '#d97706'
                      }}>
                        {esc.priority} Priority
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                      Escalated on: {new Date(esc.requestedDate || esc.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '14px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    backgroundColor: isApproved ? '#ecfdf5' : isUnderReview ? '#f0fdfa' : '#fffbeb',
                    color: isApproved ? '#059669' : isUnderReview ? '#0d9488' : '#d97706'
                  }}>
                    {esc.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, backgroundColor: 'var(--bg-page)', padding: '12px', borderRadius: '8px' }}>
                  {esc.details || 'No case notes provided.'}
                </div>

                {esc.boardDecision && (
                  <div style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#065f46'
                  }}>
                    <strong>Faculty Board Decision:</strong> {esc.boardDecision} ({new Date(esc.decisionDate || Date.now()).toLocaleDateString()})
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showAddModal && (
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
            maxWidth: '540px',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1.1rem', fontWeight: 700 }}>
              Submit Departmental Case to Faculty Board
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Case Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical Certificate Verification - CS501"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="Medical">Medical Certificate Recommendation</option>
                    <option value="Repeat Grace">Repeat Grace Chance Request</option>
                    <option value="Exam Dates">Exam Date Consultation</option>
                    <option value="Special Needs">Special Needs Examination</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Case Facts &amp; Department Justification
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the candidate circumstance, relevant regulations, and Head of Department's recommendation."
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'none' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700 }}
                >
                  Escalate Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODFacultyBoard;
