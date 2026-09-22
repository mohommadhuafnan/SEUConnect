import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card, StatCard } from '../../components/StatCard';
import { FileText, Upload, CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const StudentMedical = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // 4-Step Wizard State
  const [step, setStep] = useState(1);
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [reason, setReason] = useState('');
  const [medicalCenterName, setMedicalCenterName] = useState('University Medical Center - SEUSL');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [file, setFile] = useState(null);

  const fetchMedicals = async () => {
    try {
      const res = await studentService.getMedicalRequests();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    try {
      const formData = new FormData();
      formData.append('leaveFrom', leaveFrom);
      formData.append('leaveTo', leaveTo);
      formData.append('reason', reason);
      formData.append('medicalCenterName', medicalCenterName);
      formData.append('certificateNumber', certificateNumber);
      formData.append('doctorName', doctorName);
      if (file) formData.append('document', file);

      const res = await studentService.submitMedicalRequest(formData);
      if (res.success) {
        setSuccessMsg(`Medical request registered successfully! Reference ID: ${res.data.requestId}`);
        setStep(1);
        setLeaveFrom('');
        setLeaveTo('');
        setReason('');
        setCertificateNumber('');
        setDoctorName('');
        setFile(null);
        await fetchMedicals();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Medical Absence Requests</h1>
        <p>Submit and track medical certificates for missed lectures, practical laboratories, or continuous assessments.</p>
      </div>

      {successMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 4-Step Submission Card */}
      <Card title="New Medical Certificate Submission">
        {/* Stepper Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' }}>
          {[
            { num: 1, title: 'Leave Period & Reason' },
            { num: 2, title: 'Medical Authority Details' },
            { num: 3, title: 'Certificate Attachment' },
            { num: 4, title: 'Review & Confirm' }
          ].map(s => (
            <div
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: step >= s.num ? 1 : 0.4,
                cursor: step > s.num ? 'pointer' : 'default'
              }}
              onClick={() => { if (step > s.num) setStep(s.num); }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: step === s.num ? 'var(--primary-600)' : step > s.num ? '#10b981' : 'var(--border-color)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Leave Period & Reason */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Medical Leave Start Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={leaveFrom}
                  onChange={(e) => setLeaveFrom(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Medical Leave End Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={leaveTo}
                  onChange={(e) => setLeaveTo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Diagnosis / Reason for Absence *</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Describe clinical reason (e.g. Acute viral fever with physician ordered bed rest)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (!leaveFrom || !leaveTo || !reason) {
                    alert('Please complete all required fields.');
                    return;
                  }
                  setStep(2);
                }}
              >
                Next Step <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Medical Authority Details */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Issuing Health Institution *</label>
              <select
                className="form-select"
                value={medicalCenterName}
                onChange={(e) => setMedicalCenterName(e.target.value)}
              >
                <option value="University Medical Center - SEUSL">University Medical Center - SEUSL</option>
                <option value="District General Hospital, Kalmunai">District General Hospital, Kalmunai</option>
                <option value="Teaching Hospital, Batticaloa">Teaching Hospital, Batticaloa</option>
                <option value="Base Hospital, Sammanthurai">Base Hospital, Sammanthurai</option>
                <option value="Other Registered Government Hospital">Other Registered Government Hospital</option>
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Certificate Serial Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MC/UMC/2026/894"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Medical Officer / Physician Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. S.M. Farook (CMO)"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                Next Step <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: File Upload */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Upload Scanned Medical Certificate (PDF, JPG, PNG)</label>
              <input
                type="file"
                className="form-input"
                accept=".pdf,image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Ensure official hospital seal and doctor's SLMC registration number are legible.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>
                Review Summary <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: 'var(--bg-surface-hover)', padding: '16px', borderRadius: '8px', fontSize: '0.88rem', lineHeight: 1.8 }}>
              <div><strong>Period:</strong> {leaveFrom} to {leaveTo}</div>
              <div><strong>Reason:</strong> {reason}</div>
              <div><strong>Medical Facility:</strong> {medicalCenterName}</div>
              <div><strong>Physician / Certificate:</strong> {doctorName || 'Not specified'} ({certificateNumber || 'N/A'})</div>
              <div><strong>Attached File:</strong> {file ? file.name : 'Physical copy to be produced to Head of Dept'}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(3)}>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Confirm & Submit to Faculty Board'}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Submitted Requests History */}
      <Card title={`Previous Medical Submissions (${requests.length})`}>
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Leave Period</th>
                <th>Reason</th>
                <th>Medical Center</th>
                <th>Submitted On</th>
                <th>Current Status</th>
                <th>Official Remarks</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No medical requests on record.
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req._id}>
                    <td><strong>{req.requestId}</strong></td>
                    <td>{new Date(req.leaveFrom).toLocaleDateString()} – {new Date(req.leaveTo).toLocaleDateString()}</td>
                    <td>{req.reason}</td>
                    <td>{req.medicalCenterName}</td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        req.status === 'Approved' ? 'badge-success' :
                        req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {req.remarks || 'Under administrative review by Faculty Committee'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentMedical;
