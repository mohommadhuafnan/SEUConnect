import React, { useState, useEffect } from 'react';
import deanService from '../../services/deanService';
import {
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Calendar,
  RotateCcw,
  Sliders,
  FileText
} from 'lucide-react';

export const DeanAgenda = () => {
  const [loading, setLoading] = useState(true);
  const [agenda, setAgenda] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [decisionText, setDecisionText] = useState('');
  const [toast, setToast] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Exam Dates',
    department: 'Department of Information & Communication Tech.',
    priority: 'Medium',
    details: ''
  });

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      const res = await deanService.getAgenda();
      if (res.success) {
        setAgenda(res.data.agenda || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  const handleDecision = async (newStatus) => {
    if (!selectedItem) return;
    try {
      await deanService.updateAgendaItem(selectedItem._id, {
        status: newStatus,
        boardDecision: decisionText || `Faculty Board resolution approved on ${new Date().toLocaleDateString()}`
      });
      setToast(`Agenda item "${selectedItem.title}" set to ${newStatus}.`);
      setSelectedItem(null);
      setDecisionText('');
      fetchAgenda();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await deanService.createAgendaItem(form);
      setToast('Item added to Faculty Board agenda.');
      setShowAddModal(false);
      setForm({ title: '', category: 'Exam Dates', department: 'Department of Information & Communication Tech.', priority: 'Medium', details: '' });
      fetchAgenda();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = activeTab === 'All'
    ? agenda
    : agenda.filter(i => i.category === activeTab);

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
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Faculty Board Agenda Builder</h1>
          <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
            Handbook Section 1.2 &amp; 4.1: Chaired by the Dean — Official board motions, exam dates, medicals &amp; repeat grace appeals
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
          <span>Add Agenda Item</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['All', 'Exam Dates', 'Medical', 'Repeat Grace', 'Special Needs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid var(--border-color)',
              backgroundColor: activeTab === tab ? '#2563eb' : 'var(--bg-surface)',
              color: activeTab === tab ? '#ffffff' : 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Agenda Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(item => {
          const isHigh = item.priority === 'High';
          const isApproved = item.status === 'Approved';
          const isUnderReview = item.status === 'Under Review';

          return (
            <div key={item._id} style={{
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
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#eff6ff',
                      color: '#2563eb'
                    }}>
                      {item.category}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: isHigh ? '#fef2f2' : '#fffbeb',
                      color: isHigh ? '#dc2626' : '#d97706'
                    }}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Department: <strong>{item.department}</strong> · Date Scheduled: {new Date(item.requestedDate || item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '14px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    backgroundColor: isApproved ? '#ecfdf5' : isUnderReview ? '#f0fdfa' : '#eff6ff',
                    color: isApproved ? '#059669' : isUnderReview ? '#0d9488' : '#2563eb'
                  }}>
                    {item.status}
                  </span>
                  <button
                    onClick={() => { setSelectedItem(item); setDecisionText(item.boardDecision || ''); }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: 'transparent',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Decide
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, backgroundColor: 'var(--bg-page)', padding: '12px', borderRadius: '8px' }}>
                {item.details || 'No case facts attached.'}
              </div>

              {item.boardDecision && (
                <div style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: '#065f46'
                }}>
                  <strong>Faculty Board Resolution:</strong> {item.boardDecision} ({new Date(item.decisionDate || Date.now()).toLocaleDateString()})
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decision Modal */}
      {selectedItem && (
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
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 700 }}>
              Faculty Board Resolution: {selectedItem.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
              Record the decision reached by the Faculty Board under Dean chairmanship.
            </p>
            <textarea
              rows={4}
              required
              placeholder="Enter official resolution or minutes notation..."
              value={decisionText}
              onChange={(e) => setDecisionText(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'none' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDecision('Under Review')}
                style={{ padding: '8px 14px', borderRadius: '6px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', fontWeight: 600 }}
              >
                Under Review
              </button>
              <button
                type="button"
                onClick={() => handleDecision('Rejected')}
                style={{ padding: '8px 14px', borderRadius: '6px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', fontWeight: 700 }}
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleDecision('Approved')}
                style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#059669', color: '#ffffff', border: 'none', fontWeight: 700 }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
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
            maxWidth: '520px',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 700 }}>
              Add Agenda Item
            </h3>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                required
                placeholder="Title (e.g. Exam Date Proposal - IT402)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                >
                  <option value="Exam Dates">Exam Dates</option>
                  <option value="Medical">Medical Certificate</option>
                  <option value="Repeat Grace">Repeat Grace</option>
                  <option value="Special Needs">Special Needs</option>
                </select>
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
              <textarea
                rows={3}
                required
                placeholder="Details of the motion..."
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'none' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700 }}
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeanAgenda;
