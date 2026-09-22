import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formService } from '../../services/extraServices';
import { useAuth } from '../../context/AuthContext';
import PrintableFormView from '../../components/PrintableFormView';
import { Card } from '../../components/StatCard';
import { ArrowLeft, Printer, Download, CheckCircle, Clock, Building, FileText, AlertCircle } from 'lucide-react';

export const StudentFormDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, user } = useAuth();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await formService.getFormById(id);
        if (res.success) {
          setForm(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading form specification...</div>;
  }

  if (!form) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Faculty form not found.</p>
        <button onClick={() => navigate('/student/forms')} className="btn btn-secondary" style={{ marginTop: '12px' }}>
          Back to Forms Directory
        </button>
      </div>
    );
  }

  const studentDetails = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    address: user?.address,
    registrationNumber: profile?.registrationNumber,
    indexNumber: profile?.indexNumber,
    degreeProgramme: profile?.degreeProgramme,
    academicYear: profile?.academicYear,
    currentSemester: profile?.currentSemester,
    specialization: profile?.specialization
  };

  if (showPrintView) {
    return <PrintableFormView form={form} student={studentDetails} onBack={() => setShowPrintView(false)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate('/student/forms')} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
        <ArrowLeft size={14} /> Back to Forms Directory
      </button>

      {/* Form Header Card */}
      <div className="seu-card" style={{ borderTop: '4px solid var(--primary-700)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-info">{form.category}</span>
              <span className="badge badge-neutral">Ref: {form.formId}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Version {form.version}</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{form.name}</h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Issuing Authority: <strong>{form.issuingDivision}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowPrintView(true)} className="btn btn-primary">
              <Printer size={16} /> Open Printable Digital Template
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Specifications */}
      <div className="grid-2">
        <Card title="Purpose &amp; Eligibility">
          <div style={{ fontSize: '0.88rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <strong>Purpose of this Form:</strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{form.purpose}</p>
            </div>
            <div>
              <strong>Who Should Complete This?</strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{form.whoShouldUse}</p>
            </div>
            <div>
              <strong>When Should It Be Used?</strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{form.whenToUse}</p>
            </div>
            <div>
              <strong>Eligibility Criteria:</strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{form.eligibility}</p>
            </div>
          </div>
        </Card>

        <Card title="Submission &amp; Approvals">
          <div style={{ fontSize: '0.88rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <strong>Submission Location / Office:</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <Building size={16} color="var(--primary-600)" />
                <span>{form.submissionLocation}</span>
              </div>
            </div>
            <div>
              <strong>Submission Deadline:</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', marginTop: '2px' }}>
                <Clock size={16} />
                <span>{form.deadline}</span>
              </div>
            </div>
            <div>
              <strong>Required Approvals &amp; Signatures:</strong>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {form.approvalRequirements?.map((app, i) => (
                  <li key={i}>{app}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Required Supporting Documents & Instructions */}
      <Card title="Required Supporting Documents">
        <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
          {form.requiredDocuments?.map((doc, idx) => (
            <li key={idx}><strong>{doc}</strong></li>
          ))}
        </ul>
      </Card>

      <Card title="Step-by-Step Instructions">
        <ol style={{ paddingLeft: '20px', fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
          {form.instructions?.map((inst, idx) => (
            <li key={idx} style={{ marginBottom: '6px' }}>{inst}</li>
          ))}
        </ol>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowPrintView(true)} className="btn btn-primary">
            <Printer size={16} /> Fill and Print Form Now
          </button>
        </div>
      </Card>
    </div>
  );
};

export default StudentFormDetail;
