import React, { useState, useEffect } from 'react';
import deanService from '../../services/deanService';
import {
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  Building2,
  Layers
} from 'lucide-react';

export const DeanExaminations = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [boardOfExaminers, setBoardOfExaminers] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    courseCode: '',
    courseTitle: '',
    department: 'Department of Information & Communication Tech.',
    date: '',
    session: 'Morning',
    venue: 'Technology Examination Hall A'
  });
  const [toast, setToast] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schRes, boeRes] = await Promise.all([
        deanService.getExamSchedules(),
        deanService.getBoardOfExaminers()
      ]);
      if (schRes.success) setSchedules(schRes.data.schedules || []);
      if (boeRes.success) setBoardOfExaminers(boeRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await deanService.createExamSchedule(form);
      setToast('Draft exam schedule initiated for HOD consultation.');
      setShowAddModal(false);
      setForm({
        title: '',
        courseCode: '',
        courseTitle: '',
        department: 'Department of Information & Communication Tech.',
        date: '',
        session: 'Morning',
        venue: 'Technology Examination Hall A'
      });
      fetchData();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Examination Governance &amp; Board of Examiners</h1>
          <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
            Handbook Section 4.1 &amp; 4.6: Draft examination calendar with HOD input and faculty-wide results release
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
          <span>Propose Exam Date</span>
        </button>
      </div>

      {/* SECTION 1: Board of Examiners Faculty-wide View */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={20} color="#2563eb" />
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              Board of Examiners Faculty-Wide Readiness
            </h2>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '4px 12px', borderRadius: '12px' }}>
            Faculty Readiness: {boardOfExaminers?.facultyWideReadiness || '87%'}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead style={{ backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border-color)' }}>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Department</th>
                <th style={{ padding: '12px' }}>Head of Department</th>
                <th style={{ padding: '12px' }}>Total Subjects</th>
                <th style={{ padding: '12px' }}>CA Finalized</th>
                <th style={{ padding: '12px' }}>ESA Finalized</th>
                <th style={{ padding: '12px' }}>Meeting Date</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {boardOfExaminers?.departmentsStatus?.map((dept, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {dept.department}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{dept.headOfDepartment}</td>
                  <td style={{ padding: '12px' }}>{dept.totalSubjects} modules</td>
                  <td style={{ padding: '12px' }}>{dept.caFinalized} / {dept.totalSubjects}</td>
                  <td style={{ padding: '12px' }}>{dept.esaFinalized} / {dept.totalSubjects}</td>
                  <td style={{ padding: '12px' }}>{new Date(dept.meetingScheduled).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      backgroundColor: parseInt(dept.releaseReadiness) >= 90 ? '#ecfdf5' : '#eff6ff',
                      color: parseInt(dept.releaseReadiness) >= 90 ? '#059669' : '#2563eb'
                    }}>
                      {dept.releaseReadiness} Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Draft Examination Calendar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={20} color="#059669" />
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
            Examination Scheduling (Draft Calendar &amp; HOD Consultation Status)
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {schedules.map((sch) => (
            <div key={sch._id} style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-page)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  {sch.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {sch.department} · Date: <strong>{new Date(sch.date).toLocaleDateString()}</strong> · {sch.session} · {sch.venue}
                </div>
                {sch.hodFeedback && (
                  <div style={{ fontSize: '0.78rem', color: '#1e40af', marginTop: '4px' }}>
                    <strong>HOD Consultation Feedback:</strong> "{sch.hodFeedback}"
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: sch.hodStatus === 'Agreed' ? '#ecfdf5' : '#fffbeb',
                  color: sch.hodStatus === 'Agreed' ? '#059669' : '#d97706'
                }}>
                  HOD: {sch.hodStatus || 'Pending Input'}
                </span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: sch.status === 'Approved' ? '#ecfdf5' : '#eff6ff',
                  color: sch.status === 'Approved' ? '#059669' : '#2563eb'
                }}>
                  {sch.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1.1rem', fontWeight: 700 }}>
              Propose Examination Schedule Draft
            </h3>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                required
                placeholder="Title (e.g. IT402 Network Security End Semester Exam)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
                <select
                  value={form.session}
                  onChange={(e) => setForm({ ...form, session: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                >
                  <option value="Morning">Morning (09:00 - 12:00)</option>
                  <option value="Afternoon">Afternoon (13:30 - 16:30)</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Venue (e.g. Technology Examination Hall A)"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
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
                  Dispatch to HODs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeanExaminations;
