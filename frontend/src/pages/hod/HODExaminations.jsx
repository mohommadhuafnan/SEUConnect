import React, { useState, useEffect } from 'react';
import hodService from '../../services/hodService';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  FileCheck
} from 'lucide-react';

export const HODExaminations = () => {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [feedbackSchedule, setFeedbackSchedule] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('Agreed');
  const [toast, setToast] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prepRes, examRes] = await Promise.all([
        hodService.getBoardPrep(),
        hodService.getExamConsultations()
      ]);
      if (prepRes.success) setSubjects(prepRes.data.subjects || []);
      if (examRes.success) setSchedules(examRes.data.schedules || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackSchedule) return;

    try {
      await hodService.submitExamFeedback(feedbackSchedule._id, {
        hodFeedback: feedbackText,
        hodStatus: feedbackStatus
      });
      setToast('Consultation feedback submitted to Office of the Dean.');
      setFeedbackSchedule(null);
      setFeedbackText('');
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

      <div>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Examinations &amp; Results Governance</h1>
        <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Handbook Section 4.1 &amp; 4.6: Board of Examiners Preparation and Exam Date Consultation
        </div>
      </div>

      {/* SECTION 1: Board of Examiners Prep View */}
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
          <Award size={20} color="#2563eb" />
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
            Board of Examiners Preparation View (CA &amp; ESA Clearance)
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead style={{ backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border-color)' }}>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Course Code &amp; Title</th>
                <th style={{ padding: '12px' }}>Lecturer In-Charge</th>
                <th style={{ padding: '12px' }}>Enrolled</th>
                <th style={{ padding: '12px' }}>CA Submitted</th>
                <th style={{ padding: '12px' }}>ESA Submitted</th>
                <th style={{ padding: '12px' }}>Readiness</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.code} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                    <span style={{ color: '#2563eb' }}>{s.code}</span> - {s.title}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{s.lecturer}</td>
                  <td style={{ padding: '12px' }}>{s.enrolledCount} students</td>
                  <td style={{ padding: '12px' }}>
                    <strong>{s.caSubmitted}</strong> / {s.enrolledCount} ({s.caCompletion}%)
                  </td>
                  <td style={{ padding: '12px' }}>
                    <strong>{s.esaSubmitted}</strong> / {s.enrolledCount} ({s.esaCompletion}%)
                  </td>
                  <td style={{ padding: '12px', width: '140px' }}>
                    <div style={{ height: '6px', backgroundColor: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.round((s.caCompletion + s.esaCompletion) / 2)}%`,
                        height: '100%',
                        backgroundColor: s.caCompletion === 100 && s.esaCompletion >= 80 ? '#10b981' : '#2563eb'
                      }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: s.status === 'Ready for Review' ? '#ecfdf5' : '#eff6ff',
                      color: s.status === 'Ready for Review' ? '#059669' : '#2563eb'
                    }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Exam Date Consultation */}
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
            Examination Date Consultation (Dean &amp; HOD Collation)
          </h2>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
          Under Section 4.1, examination dates are drafted by the Dean in consultation with Heads of Department before final Faculty Board confirmation.
        </p>

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
                  Date: <strong>{new Date(sch.date).toLocaleDateString()}</strong> · Session: <strong>{sch.session}</strong> · Venue: <strong>{sch.venue}</strong>
                </div>
                {sch.hodFeedback && (
                  <div style={{ fontSize: '0.78rem', color: '#1e40af', marginTop: '6px', fontStyle: 'italic' }}>
                    HOD Input: "{sch.hodFeedback}" ({sch.hodStatus})
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: sch.hodStatus === 'Agreed' ? '#ecfdf5' : '#fffbeb',
                  color: sch.hodStatus === 'Agreed' ? '#059669' : '#d97706'
                }}>
                  {sch.hodStatus || 'Pending Input'}
                </span>
                <button
                  onClick={() => {
                    setFeedbackSchedule(sch);
                    setFeedbackText(sch.hodFeedback || '');
                    setFeedbackStatus(sch.hodStatus || 'Agreed');
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Give Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackSchedule && (
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
              Consultation Feedback: {feedbackSchedule.title}
            </h3>
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  HOD Position
                </label>
                <select
                  value={feedbackStatus}
                  onChange={(e) => setFeedbackStatus(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                >
                  <option value="Agreed">Agreed with Proposed Date</option>
                  <option value="Revision Requested">Revision Requested (Clash or Incomplete CA)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Department Notes &amp; Rationale
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide recommendations for the Dean (e.g. lab equipment ready, lecture syllabus completed, no clashes with other years)."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setFeedbackSchedule(null)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'none' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700 }}
                >
                  Submit Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODExaminations;
