import React, { useState } from 'react';
import {
  Printer,
  ArrowLeft,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  FileCheck,
  Edit3,
  Calendar,
  Building,
  User,
  Phone,
  MapPin,
  BookOpen
} from 'lucide-react';

export const PrintableFormView = ({ form, student, onBack }) => {
  const defaultFormData = {
    name: student?.name || '',
    registrationNumber: student?.registrationNumber || '',
    academicYear: student?.academicYear || '2025/2026',
    semester: student?.currentSemester ? (student.currentSemester % 2 === 0 ? 'Semester II' : 'Semester I') : 'Semester I',
    examYear: 'Third Year',
    specialization: student?.specialization || 'Software Systems',
    address: student?.address || 'Faculty of Technology, SEUSL, Oluvil',
    phone: student?.phone || '077 1234567',
    applicationDate: new Date().toISOString().split('T')[0],
    
    // Repeat exam subjects
    appliedSubjects: [
      { code: 'ICT22011', title: 'Web Application Development' }
    ],

    // Medical details
    leaveFrom: '',
    leaveTo: '',
    medicalOfficer: 'University Medical Officer / Govt. Medical Officer',
    medicalReason: 'Fever / Medical Illness',
    medicalRows: [
      { date: new Date().toISOString().split('T')[0], code: 'ICT22011' }
    ],

    // PIV Voucher
    bankBranch: 'Addalaichenai',
    examFee: '500',
    medicalFee: '0',
    registrationFee: '0',
    otherFee: '0',
    amountWords: 'Five Hundred Rupees Only',

    // Generic
    remarks: ''
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('fill'); // 'fill' or 'preview'
  const [refNumber, setRefNumber] = useState('');

  // Field change handler
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Subject table row helpers
  const handleAddSubject = () => {
    if (formData.appliedSubjects.length >= 8) return;
    setFormData(prev => ({
      ...prev,
      appliedSubjects: [...prev.appliedSubjects, { code: '', title: '' }]
    }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...formData.appliedSubjects];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, appliedSubjects: updated }));
  };

  const handleRemoveSubject = (index) => {
    if (formData.appliedSubjects.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      appliedSubjects: prev.appliedSubjects.filter((_, i) => i !== index)
    }));
  };

  // Medical row helpers
  const handleAddMedicalRow = () => {
    if (formData.medicalRows.length >= 8) return;
    setFormData(prev => ({
      ...prev,
      medicalRows: [...prev.medicalRows, { date: '', code: '' }]
    }));
  };

  const handleMedicalRowChange = (index, field, value) => {
    const updated = [...formData.medicalRows];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, medicalRows: updated }));
  };

  const handleRemoveMedicalRow = (index) => {
    if (formData.medicalRows.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      medicalRows: prev.medicalRows.filter((_, i) => i !== index)
    }));
  };

  // Form Reset
  const handleReset = () => {
    setFormData(defaultFormData);
    setValidationErrors({});
    setIsSubmitted(false);
    setActiveTab('fill');
  };

  // Validation & Submit
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const errors = {};

    if (!formData.name?.trim()) errors.name = 'Full name with initials is required.';
    if (!formData.registrationNumber?.trim()) errors.registrationNumber = 'Registration number is required.';
    if (!formData.phone?.trim()) errors.phone = 'Contact phone number is required.';

    if (form.formId === 'SEU-EX-CA-REP') {
      const emptySubjects = formData.appliedSubjects.some(s => !s.code.trim() || !s.title.trim());
      if (emptySubjects) {
        errors.subjects = 'Please fill out Subject Code and Subject Title for all rows.';
      }
    }

    if (form.formId === 'SEU-MED-ABSENT' || form.formId === 'SEU-ICT-MED-LEC') {
      if (!formData.leaveFrom) errors.leaveFrom = 'Medical leave start date is required.';
      if (!formData.leaveTo) errors.leaveTo = 'Medical leave end date is required.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Generate unique official submission stamp
    const generatedRef = `SEU/FT/${new Date().getFullYear()}/${form.formId.replace('SEU-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRefNumber(generatedRef);
    setValidationErrors({});
    setIsSubmitted(true);
    setActiveTab('preview');
  };

  const handlePrint = () => {
    window.print();
  };

  // Render Document Template matching authentic university layout
  const renderOfficialDocument = () => {
    switch (form.formId) {
      case 'SEU-EX-CA-REP':
        return (
          <div className="printable-document">
            <div className="university-form-header">
              <h2>SOUTH EASTERN UNIVERSITY OF SRI LANKA</h2>
              <h3>EXAMINATION DIVISION</h3>
              <h4>APPLICATION FOR EXAMINATION (Continuous Assessment)</h4>
              <div style={{ fontSize: '0.9rem', fontStyle: 'italic', fontWeight: 'bold' }}>
                (Repeat Candidates only)
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                (This form should be completed in CAPITAL letters &amp; tick '✓' appropriate box)
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <div style={{ border: '1px solid #000', padding: '6px 14px', fontSize: '0.78rem', textAlign: 'center' }}>
                OFFICE USE ONLY<br />
                <span style={{ fontSize: '0.7rem', color: '#444' }}>Ref: {refNumber || 'SEU/EX/CA-REP'}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', lineHeight: 1.9 }}>
              <div><strong>PART - I</strong></div>
              <div>01. Name with initials: <strong>{formData.name.toUpperCase()}</strong></div>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div>02. Registration No: <strong>{formData.registrationNumber.toUpperCase()}</strong></div>
                <div>03. Current Academic Year: <strong>{formData.academicYear}</strong></div>
              </div>
              <div style={{ display: 'flex', gap: '24px', margin: '6px 0', flexWrap: 'wrap' }}>
                <div>04. Faculty: <strong>[✓] FT (Faculty of Technology)</strong></div>
                <div>05. Semester: <strong>[✓] {formData.semester}</strong></div>
                <div>06. Year of Examination: <strong>{formData.examYear}</strong></div>
              </div>
              <div>07. Field of Specialization: <strong>{formData.specialization}</strong></div>
              <div>08. Present Address: <strong>{formData.address}</strong></div>
              <div>09. Contact Mobile No: <strong>{formData.phone}</strong></div>

              <div style={{ marginTop: '14px' }}>
                <strong>10. Applied subjects:</strong>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ border: '1px solid #000', background: '#f0f0f0' }}>
                      <th style={{ border: '1px solid #000', padding: '6px', width: '50px' }}>SNo.</th>
                      <th style={{ border: '1px solid #000', padding: '6px', width: '160px' }}>Subject Code</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>Subject Title</th>
                      <th style={{ border: '1px solid #000', padding: '6px', width: '180px' }}>Signature of Head of Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.appliedSubjects.map((sub, idx) => (
                      <tr key={idx} style={{ border: '1px solid #000', height: '30px' }}>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>0{idx + 1}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontWeight: 'bold' }}>{sub.code.toUpperCase()}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px' }}>{sub.title}</td>
                        <td style={{ border: '1px solid #000' }}></td>
                      </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 5 - formData.appliedSubjects.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} style={{ border: '1px solid #000', height: '28px' }}>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>0{formData.appliedSubjects.length + i + 1}</td>
                        <td style={{ border: '1px solid #000' }}></td>
                        <td style={{ border: '1px solid #000' }}></td>
                        <td style={{ border: '1px solid #000' }}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px' }}>
                <div>Date: <strong>{formData.applicationDate}</strong></div>
                <div>Signature of Candidate: <strong>{formData.name}</strong></div>
              </div>

              <div style={{ marginTop: '26px', borderTop: '1px dashed #000', paddingTop: '10px' }}>
                <strong>Part - II (Official Verification)</strong>
                <p>Particulars from 01 - 10 are checked with faculty records and found correct.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                  <div>Signature of Subject in charge: ..................................</div>
                  <div>Assistant Registrar / FT: ........................................</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'SEU-MED-ABSENT':
        return (
          <div className="printable-document">
            <div className="university-form-header">
              <h2>SOUTH EASTERN UNIVERSITY OF SRI LANKA</h2>
              <h3>FACULTY OF TECHNOLOGY</h3>
              <h4>ABSENT BY MEDICAL FORM</h4>
            </div>

            <div style={{ fontSize: '0.9rem', lineHeight: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Name of the Student: <strong>{formData.name.toUpperCase()}</strong></div>
                <div>ACADEMIC YEAR: <strong>{formData.academicYear}</strong></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Registration Number: <strong>{formData.registrationNumber.toUpperCase()}</strong></div>
                <div>Contact Number: <strong>{formData.phone}</strong></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Medical Submission Date: <strong>{formData.applicationDate}</strong></div>
                <div>Specialization: <strong>{formData.specialization}</strong></div>
              </div>
              <div>
                Medical Leave: From <strong>{formData.leaveFrom || '.......................'}</strong> To: <strong>{formData.leaveTo || '.......................'}</strong>
              </div>
              <div>Medical Officer / Hospital: <strong>{formData.medicalOfficer}</strong></div>
              <div>Reason: <strong>{formData.medicalReason}</strong></div>

              <div style={{ marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ border: '1px solid #000', background: '#f5f5f5' }}>
                      <th style={{ border: '1px solid #000', padding: '8px', width: '160px' }}>Absent Date</th>
                      <th style={{ border: '1px solid #000', padding: '8px' }}>Subject Code</th>
                      <th style={{ border: '1px solid #000', padding: '8px' }}>Lecturer Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.medicalRows.map((row, idx) => (
                      <tr key={idx} style={{ border: '1px solid #000', height: '28px' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'center' }}>{row.date || formData.applicationDate}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'center', fontWeight: 'bold' }}>{row.code.toUpperCase()}</td>
                        <td style={{ border: '1px solid #000' }}></td>
                      </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - formData.medicalRows.length) }).map((_, i) => (
                      <tr key={`em-${i}`} style={{ border: '1px solid #000', height: '26px' }}>
                        <td style={{ border: '1px solid #000' }}></td>
                        <td style={{ border: '1px solid #000' }}></td>
                        <td style={{ border: '1px solid #000' }}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <div>Head of Department: ............................................</div>
                <div>Student Signature: <strong>{formData.name}</strong></div>
              </div>
            </div>
          </div>
        );

      case 'SEU-PIV-VOUCHER':
        const totalFee = Number(formData.examFee || 0) + Number(formData.medicalFee || 0) + Number(formData.registrationFee || 0) + Number(formData.otherFee || 0);
        return (
          <div className="printable-document" style={{ border: '2px dashed #000', maxWidth: '780px', margin: '0 auto' }}>
            <div style={{ border: '2px solid #000', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>SOUTH EASTERN UNIVERSITY OF SRI LANKA</h2>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>PAY IN VOUCHER (PIV)</h3>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginTop: '4px' }}>BURSAR'S DEPT / CUSTOMER COPY</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.78rem' }}>
                  <div><strong>Manager, People's Bank</strong></div>
                  <div>The fee should be paid by cash to credit of:</div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>South Eastern University of Sri Lanka (SEUSL)</div>
                  <div style={{ backgroundColor: '#000', color: '#fff', padding: '2px 6px', display: 'inline-block', marginTop: '2px' }}>
                    A/C No. 228 1001 9000 1704 People's Bank, Addalaichenai
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', marginTop: '12px', fontSize: '0.85rem' }}>
                <div style={{ lineHeight: 1.9 }}>
                  <div>Name: <strong>{formData.name.toUpperCase()}</strong></div>
                  <div>Address: <strong>{formData.address}</strong></div>
                  <div>Registration No: <strong>{formData.registrationNumber.toUpperCase()}</strong></div>
                  <div>Course of Study: <strong>Faculty of Technology ({formData.specialization})</strong></div>
                  <div>Amount in words: <strong>{formData.amountWords || 'Five Hundred Rupees Only'}</strong></div>
                  <div style={{ marginTop: '14px' }}>Signature: <strong>{formData.name}</strong></div>
                  <div>Date: <strong>{formData.applicationDate}</strong></div>
                </div>

                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ border: '1px solid #000', background: '#e5e7eb' }}>
                        <th style={{ border: '1px solid #000', padding: '4px' }}>Item</th>
                        <th style={{ border: '1px solid #000', padding: '4px' }}>Rs.</th>
                        <th style={{ border: '1px solid #000', padding: '4px' }}>Cts.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ border: '1px solid #000', height: '22px' }}>
                        <td style={{ border: '1px solid #000', padding: '3px 6px' }}>1 Registration Fee</td>
                        <td style={{ border: '1px solid #000', textAlign: 'right', paddingRight: '4px' }}>{formData.registrationFee}</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>00</td>
                      </tr>
                      <tr style={{ border: '1px solid #000', height: '22px' }}>
                        <td style={{ border: '1px solid #000', padding: '3px 6px' }}>2 Examination Fee</td>
                        <td style={{ border: '1px solid #000', textAlign: 'right', paddingRight: '4px' }}>{formData.examFee}</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>00</td>
                      </tr>
                      <tr style={{ border: '1px solid #000', height: '22px' }}>
                        <td style={{ border: '1px solid #000', padding: '3px 6px' }}>3 Medical Fee</td>
                        <td style={{ border: '1px solid #000', textAlign: 'right', paddingRight: '4px' }}>{formData.medicalFee}</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>00</td>
                      </tr>
                      <tr style={{ border: '2px solid #000', fontWeight: 'bold' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 6px' }}>Total Amount</td>
                        <td style={{ border: '1px solid #000', textAlign: 'right', paddingRight: '4px' }}>{totalFee}</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>00</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ marginTop: '10px', fontSize: '0.75rem', border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                    Received by cash Rs. {totalFee}/= to credit of SEUSL A/C 228100190001704<br /><br />
                    Signature &amp; Seal of Bank Teller
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'SEU-ICT-MED-LEC':
        return (
          <div className="printable-document">
            <div className="university-form-header">
              <h2>DEPARTMENT OF INFORMATION AND COMMUNICATION TECHNOLOGY</h2>
              <h3>FACULTY OF TECHNOLOGY · SEUSL</h3>
              <h4>MEDICAL SUBMISSION FORM - ABSENT FOR LECTURES</h4>
            </div>

            <div style={{ fontSize: '0.9rem', lineHeight: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Name of the Student: <strong>{formData.name.toUpperCase()}</strong></div>
                <div>Academic Year: <strong>{formData.academicYear}</strong></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Registration No: <strong>{formData.registrationNumber.toUpperCase()}</strong></div>
                <div>Contact Number: <strong>{formData.phone}</strong></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Medical Submission Date: <strong>{formData.applicationDate}</strong></div>
                <div>Specialization: <strong>{formData.specialization}</strong></div>
              </div>
              <div>Medical Leave: From <strong>{formData.leaveFrom || '...........'}</strong> To <strong>{formData.leaveTo || '...........'}</strong></div>

              <div style={{ marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ border: '1px solid #000', background: '#f5f5f5' }}>
                      <th style={{ border: '1px solid #000', padding: '6px', width: '140px' }}>Date</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>Subject Code &amp; Title</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>Lecturer Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.medicalRows.map((r, i) => (
                      <tr key={i} style={{ border: '1px solid #000', height: '28px' }}>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>{r.date || formData.applicationDate}</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>{r.code.toUpperCase()}</td>
                        <td style={{ border: '1px solid #000' }}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <div>Signature of Department Head: ......................................</div>
                <div>Student Signature: <strong>{formData.name}</strong></div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="printable-document">
            <div className="university-form-header">
              <h2>SOUTH EASTERN UNIVERSITY OF SRI LANKA</h2>
              <h3>{form.officialTitle || form.name}</h3>
              <h4>{form.issuingDivision}</h4>
            </div>
            <div style={{ padding: '16px', lineHeight: 1.9, fontSize: '0.9rem' }}>
              <div>01. Student Name: <strong>{formData.name.toUpperCase()}</strong></div>
              <div>02. Registration No: <strong>{formData.registrationNumber.toUpperCase()}</strong></div>
              <div>03. Academic Year: <strong>{formData.academicYear}</strong></div>
              <div>04. Degree &amp; Specialization: <strong>{formData.specialization}</strong></div>
              <div>05. Contact Mobile: <strong>{formData.phone}</strong></div>
              <div>06. Date of Submission: <strong>{formData.applicationDate}</strong></div>
              {formData.remarks && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Student Remarks / Justification:</strong>
                  <p style={{ marginTop: '4px', fontStyle: 'italic' }}>{formData.remarks}</p>
                </div>
              )}
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                <div>Date: <strong>{formData.applicationDate}</strong></div>
                <div>Student Signature: <strong>{formData.name}</strong></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: 'var(--bg-surface)',
        padding: '14px 20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Form Details
        </button>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-page)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('fill')}
            className={`btn btn-sm ${activeTab === 'fill' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Edit3 size={14} /> 1. Fill &amp; Type Form
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isSubmitted) handleSubmit();
              else setActiveTab('preview');
            }}
            className={`btn btn-sm ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileCheck size={14} /> 2. Official Document {isSubmitted && '✓'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary btn-sm"
            title="Reset to default values"
          >
            <RotateCcw size={15} /> Reset
          </button>

          {isSubmitted && (
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
            >
              <Printer size={15} /> Download Official PDF / Print
            </button>
          )}
        </div>
      </div>

      {/* Submission Success Alert */}
      {isSubmitted && activeTab === 'preview' && (
        <div className="no-print" style={{
          backgroundColor: 'var(--success-bg)',
          border: '1px solid var(--success)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 color="var(--success)" size={22} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                Form Submitted &amp; Verified Successfully!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Official Verification Ref: <strong>{refNumber}</strong>. You can now download or print the completed official document.
              </div>
            </div>
          </div>
          <button onClick={handlePrint} className="btn btn-primary btn-sm">
            <Download size={14} /> Download / Print PDF Now
          </button>
        </div>
      )}

      {/* Validation Errors Alert */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="no-print" style={{
          backgroundColor: 'var(--danger-bg)',
          border: '1px solid var(--danger)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle color="var(--danger)" size={20} />
          <div style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>
            <strong>Please correct the following:</strong> {Object.values(validationErrors).join(' ')}
          </div>
        </div>
      )}

      {/* TAB 1: Interactive Form Input Fields */}
      {activeTab === 'fill' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Student Information */}
          <div className="seu-card">
            <div className="seu-card-header">
              <div className="seu-card-title">
                <User size={18} color="var(--primary-600)" />
                <span>Part I: Student &amp; Academic Identity</span>
              </div>
              <span className="badge badge-info">{form.category}</span>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name with Initials *</label>
                <input
                  type="text"
                  className={`form-input ${validationErrors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. M.N.M. Afnan"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Number *</label>
                <input
                  type="text"
                  className={`form-input ${validationErrors.registrationNumber ? 'is-invalid' : ''}`}
                  value={formData.registrationNumber}
                  onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  placeholder="e.g. 22ICT085"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Academic Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.academicYear}
                  onChange={(e) => handleChange('academicYear', e.target.value)}
                  placeholder="2025/2026"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Semester</label>
                <select
                  className="form-select"
                  value={formData.semester}
                  onChange={(e) => handleChange('semester', e.target.value)}
                >
                  <option value="Semester I">Semester I (Odd)</option>
                  <option value="Semester II">Semester II (Even)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Degree Programme / Specialization</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.specialization}
                  onChange={(e) => handleChange('specialization', e.target.value)}
                  placeholder="e.g. Software Systems / Network Technology"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Mobile Number *</label>
                <input
                  type="tel"
                  className={`form-input ${validationErrors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="e.g. +94 77 1234567"
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Present Address in University / Residence</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Hostel / Home Address"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Form Specific Input Fields */}
          {form.formId === 'SEU-EX-CA-REP' && (
            <div className="seu-card">
              <div className="seu-card-header">
                <div className="seu-card-title">
                  <BookOpen size={18} color="var(--primary-600)" />
                  <span>Part II: Continuous Assessment Repeat Subjects</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={14} /> Add Subject
                </button>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Specify all repeat subjects for which Continuous Assessment (CA) repeat examinations are requested.
              </p>

              {validationErrors.subjects && (
                <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '10px' }}>
                  {validationErrors.subjects}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {formData.appliedSubjects.map((sub, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    padding: '10px',
                    backgroundColor: 'var(--bg-page)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '24px' }}>
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '140px', textTransform: 'uppercase', fontWeight: 600 }}
                      placeholder="Subject Code"
                      value={sub.code}
                      onChange={(e) => handleSubjectChange(idx, 'code', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1, minWidth: '180px' }}
                      placeholder="Subject Title (e.g. Web Application Development)"
                      value={sub.title}
                      onChange={(e) => handleSubjectChange(idx, 'title', e.target.value)}
                      required
                    />
                    {formData.appliedSubjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Remove Subject"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(form.formId === 'SEU-MED-ABSENT' || form.formId === 'SEU-ICT-MED-LEC') && (
            <div className="seu-card">
              <div className="seu-card-header">
                <div className="seu-card-title">
                  <Calendar size={18} color="var(--primary-600)" />
                  <span>Part II: Medical Leave Details</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedicalRow}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={14} /> Add Absent Date
                </button>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Medical Leave Start Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.leaveFrom}
                    onChange={(e) => handleChange('leaveFrom', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Medical Leave End Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.leaveTo}
                    onChange={(e) => handleChange('leaveTo', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Endorsing Medical Officer / Hospital</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.medicalOfficer}
                    onChange={(e) => handleChange('medicalOfficer', e.target.value)}
                    placeholder="e.g. University Medical Centre, SEUSL"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason / Medical Condition</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.medicalReason}
                    onChange={(e) => handleChange('medicalReason', e.target.value)}
                    placeholder="e.g. Viral Fever / Hospitalization"
                  />
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <label className="form-label">Absent Dates &amp; Missed Subjects</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.medicalRows.map((r, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="date"
                        className="form-input"
                        style={{ width: '180px' }}
                        value={r.date}
                        onChange={(e) => handleMedicalRowChange(idx, 'date', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-input"
                        style={{ flex: 1, textTransform: 'uppercase' }}
                        placeholder="Subject Code (e.g. ICT22011)"
                        value={r.code}
                        onChange={(e) => handleMedicalRowChange(idx, 'code', e.target.value)}
                      />
                      {formData.medicalRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicalRow(idx)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {form.formId === 'SEU-PIV-VOUCHER' && (
            <div className="seu-card">
              <div className="seu-card-header">
                <div className="seu-card-title">
                  <Building size={18} color="var(--primary-600)" />
                  <span>Part II: People's Bank Payment Breakdown</span>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Examination Fee (Rs.)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.examFee}
                    onChange={(e) => handleChange('examFee', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Medical Fee (Rs.)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.medicalFee}
                    onChange={(e) => handleChange('medicalFee', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Registration / Re-registration Fee (Rs.)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.registrationFee}
                    onChange={(e) => handleChange('registrationFee', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Amount in Words</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.amountWords}
                    onChange={(e) => handleChange('amountWords', e.target.value)}
                    placeholder="e.g. Five Hundred Rupees Only"
                  />
                </div>
              </div>
            </div>
          )}

          {form.formId !== 'SEU-EX-CA-REP' && form.formId !== 'SEU-MED-ABSENT' && form.formId !== 'SEU-ICT-MED-LEC' && form.formId !== 'SEU-PIV-VOUCHER' && (
            <div className="seu-card">
              <div className="seu-card-header">
                <div className="seu-card-title">
                  <FileCheck size={18} color="var(--primary-600)" />
                  <span>Part II: Submission Request &amp; Remarks</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Student Statement / Detailed Explanation</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={formData.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  placeholder="Provide any specific details or grounds for this application..."
                />
              </div>
            </div>
          )}

          {/* Form Action Controls (Reset & Submit) */}
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
            >
              <RotateCcw size={16} /> Reset Form
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontWeight: 600 }}
              >
                <FileCheck size={16} /> Submit &amp; Generate Official Document
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Generated Official University Document View */}
      {activeTab === 'preview' && (
        <div>
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            backgroundColor: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('fill')}
              className="btn btn-secondary btn-sm"
            >
              <Edit3 size={14} /> Edit Entered Information
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
            >
              <Printer size={15} /> Print / Save as Official PDF
            </button>
          </div>

          {renderOfficialDocument()}
        </div>
      )}
    </div>
  );
};

export default PrintableFormView;
