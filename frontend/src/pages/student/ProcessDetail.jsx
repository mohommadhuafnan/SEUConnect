import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { processService } from '../../services/extraServices';
import { Card } from '../../components/StatCard';
import { ArrowLeft, CheckCircle2, Clock, Building, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export const StudentProcessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processDoc, setProcessDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const res = await processService.getProcessById(id);
        if (res.success) {
          setProcessDoc(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProcess();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading university process guide...</div>;
  }

  if (!processDoc) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Process guide not found.</p>
        <button onClick={() => navigate('/student/processes')} className="btn btn-secondary" style={{ marginTop: '12px' }}>
          Back to Processes Directory
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate('/student/processes')} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
        <ArrowLeft size={14} /> Back to Process Guides
      </button>

      {/* Process Header */}
      <div className="seu-card" style={{ borderLeft: '5px solid var(--primary-700)' }}>
        <span className="badge badge-info" style={{ marginBottom: '8px' }}>{processDoc.category}</span>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{processDoc.title}</h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.6 }}>
          {processDoc.purpose}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', fontSize: '0.82rem' }}>
          <div>Who can use: <strong>{processDoc.whoCanUse}</strong></div>
          <div>Eligibility: <strong>{processDoc.eligibility}</strong></div>
          <div>Submission Office: <strong>{processDoc.submissionLocation}</strong></div>
          <div>Deadline: <strong style={{ color: '#d97706' }}>{processDoc.deadlineInfo}</strong></div>
        </div>
      </div>

      {/* Step-by-Step Guidance */}
      <Card title="Step-by-Step Procedure">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {processDoc.steps?.map(step => (
            <div
              key={step.stepNumber}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-700)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                {step.stepNumber}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.6 }}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Linked Official Forms & Documents */}
      {processDoc.linkedForms && processDoc.linkedForms.length > 0 && (
        <Card title="Required University Forms for this Process">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {processDoc.linkedForms.map(form => (
              <div
                key={form.formId}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-surface)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-success">Official Form</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{form.formId}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginTop: '8px', color: 'var(--text-main)' }}>
                    {form.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Submission: {form.submissionLocation}
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <button
                    onClick={() => navigate(`/student/forms/${form.formId}`)}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <FileText size={14} /> Open Form &amp; Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Next Action & Support */}
      <div className="seu-card" style={{ backgroundColor: 'var(--success-bg)', borderColor: '#a7f3d0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <CheckCircle2 size={22} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#065f46' }}>What should you do next?</div>
            <div style={{ fontSize: '0.86rem', color: '#047857', marginTop: '4px', lineHeight: 1.5 }}>
              {processDoc.nextAction || 'Monitor your student portal dashboard for status verification and departmental confirmation.'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '8px' }}>
              Faculty Support Office: <strong>{processDoc.contactOffice}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProcessDetail;
