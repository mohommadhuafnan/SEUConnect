import React, { useState, useRef } from 'react';
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
  Mail,
  MapPin,
  BookOpen,
  UploadCloud,
  FileUp,
  FileText,
  Clock,
  Check,
  X
} from 'lucide-react';

export const PrintableFormView = ({ form, student, onBack }) => {
  const signatureInputRef = useRef(null);
  const receiptInputRef = useRef(null);
  const medicalCertInputRef = useRef(null);
  const pivInputRef = useRef(null);

  const defaultFormData = {
    // Basic Details
    title: 'Mr.',
    name: student?.name || '',
    firstName: student?.name?.split(' ').slice(0, -1).join(' ') || student?.name || '',
    lastName: student?.name?.split(' ').slice(-1)[0] || '',
    registrationNumber: student?.registrationNumber || '22ICT085',
    indexNumber: student?.indexNumber || 'ICT22085',
    designation: 'Student - ' + (student?.registrationNumber || '22ICT085'),
    department: student?.department || 'Department of Information and Communication Technology',
    faculty: 'Faculty of Technology',
    employmentType: 'Temporary (Student)',
    preferredEmailPrefix: student?.registrationNumber ? student.registrationNumber.toLowerCase() : '22ict085',
    emailPurpose: 'Academic coursework, LMS access, official faculty correspondence, and exam indexing',
    whatsappNo: student?.phone || '+94 77 1234567',
    personalEmail: student?.email || 'afnan.personal@gmail.com',

    academicYear: student?.academicYear || '2025/2026',
    semester: student?.currentSemester ? (student.currentSemester % 2 === 0 ? 'Semester II' : 'Semester I') : 'Semester I',
    semShort: student?.currentSemester % 2 === 0 ? 'II' : 'I',
    courseYear: '3rd',
    examYear: 'Third Year',
    specialization: student?.specialization || 'Software Systems',
    address: student?.address || 'Faculty of Technology Hostel, SEUSL, Oluvil',
    phone: student?.phone || '+94 77 1234567',
    applicationDate: new Date().toISOString().split('T')[0],

    // Uploaded Assets
    signatureImage: null,
    signatureName: '',
    receiptImage: null,
    receiptFileName: '',
    medicalCertImage: null,
    medicalCertFileName: '',
    pivImage: null,
    pivFileName: '',

    // 1. MEDICAL SUBMISSION FORM (SEU-MED-ABSENT / SEU-ICT-MED-LEC) - 2-PAGE FORM
    medicalCandidateType: 'Fresh', // 'Repeat' | 'Fresh'
    medicalSubjectType: 'Attendance for the Lecture', // 'Attendance for the Lecture' | 'End Semester Examination' | 'Continuous Assessment (CA)' | 'Any Other'
    medicalOtherSpecify: '',
    leaveFrom: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    leaveTo: new Date().toISOString().split('T')[0],
    medicalReason: 'Diagnosed with acute viral fever with severe fatigue requiring medically recommended clinical rest.',
    medicalSubjectsList: [
      { sno: 1, code: 'ICT11012', title: 'Foundation of Information Technology' },
      { sno: 2, code: 'ICT11023', title: 'Structured Programming Fundamentals' },
      { sno: 3, code: 'ICT12013', title: 'Object Oriented Programming' },
      { sno: 4, code: '', title: '' },
      { sno: 5, code: '', title: '' },
      { sno: 6, code: '', title: '' },
      { sno: 7, code: '', title: '' },
      { sno: 8, code: '', title: '' }
    ],

    // 2. APPLICATION FOR EXAMINATION (SEU-EX-ESA-REP / SEU-EX-CA-REP) - 2-PAGE FORM
    examBatch: '2022/2023',
    examFaculty: 'FT',
    examMedium: 'English',
    examSemester: 'I',
    examAppliedFor: 'Repeat',
    examAttempts: '1',
    examFeesPaid: '400',
    examSubjects: [
      { sno: '01', code: 'ICT21013', title: 'Data Structures and Algorithms' },
      { sno: '02', code: 'ICT21023', title: 'Database Management Systems' },
      { sno: '03', code: 'ICT21032', title: 'Computer Networks' },
      { sno: '04', code: 'ICT22011', title: 'Web Application Development' },
      { sno: '05', code: '', title: '' },
      { sno: '06', code: '', title: '' },
      { sno: '07', code: '', title: '' },
      { sno: '08', code: '', title: '' },
      { sno: '09', code: '', title: '' },
      { sno: '10', code: '', title: '' },
      { sno: '11', code: '', title: '' },
      { sno: '12', code: '', title: '' }
    ],

    // 3. RE-SCRUTINIZATION (SEU-EX-RESCRUTINY)
    examNameYear: 'Third Year Examination in Technology - Semester I - 2025/2026',
    rescrutinyCode: 'ICT22011',
    rescrutinyTitle: 'Web Application Development',
    gradeReceived: 'C-',
    amountPaid: '500',
    receiptNo: 'PB-SEU-849201',

    // 4. PAY IN VOUCHER (SEU-PIV-VOUCHER)
    pivPurpose: 'Repeat Examination Fee',
    pivCategory: 'Examination Fee',
    pivAmount: '400',
    pivCourse: student?.degreeProgramme || 'Bachelor of Information and Communication Technology (BICT)',
    pivAccountNo: '228 1001 9000 1704',
    pivBankBranch: "People's Bank, Addalaichenai Branch",
    examFee: '400',
    medicalFee: '0',
    registrationFee: '0',
    otherFee: '0',
    amountWords: 'Four Hundred Rupees Only',

    remarks: ''
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('fill');
  const [refNumber, setRefNumber] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Upload Handlers
  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file for signature (PNG, JPG, JPEG).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData(prev => ({
          ...prev,
          signatureImage: uploadEvent.target?.result,
          signatureName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setFormData(prev => ({ ...prev, signatureImage: null, signatureName: '' }));
    if (signatureInputRef.current) signatureInputRef.current.value = '';
  };

  const handleMedicalCertUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData(prev => ({
          ...prev,
          medicalCertImage: uploadEvent.target?.result,
          medicalCertFileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedicalCert = () => {
    setFormData(prev => ({ ...prev, medicalCertImage: null, medicalCertFileName: '' }));
    if (medicalCertInputRef.current) medicalCertInputRef.current.value = '';
  };

  const handlePivUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData(prev => ({
          ...prev,
          pivImage: uploadEvent.target?.result,
          pivFileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePiv = () => {
    setFormData(prev => ({ ...prev, pivImage: null, pivFileName: '' }));
    if (pivInputRef.current) pivInputRef.current.value = '';
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receiptFileName: file.name
      }));
    }
  };

  // Table Change Handlers
  const handleMedicalSubjectChange = (index, field, value) => {
    const updated = [...formData.medicalSubjectsList];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, medicalSubjectsList: updated }));
  };

  const handleExamSubjectChange = (index, field, value) => {
    const updated = [...formData.examSubjects];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, examSubjects: updated }));
  };

  // Reset Handler
  const handleReset = () => {
    setFormData(defaultFormData);
    setValidationErrors({});
    setIsSubmitted(false);
    setActiveTab('fill');
    if (signatureInputRef.current) signatureInputRef.current.value = '';
    if (receiptInputRef.current) receiptInputRef.current.value = '';
    if (medicalCertInputRef.current) medicalCertInputRef.current.value = '';
    if (pivInputRef.current) pivInputRef.current.value = '';
  };

  // Validation & Submit
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const errors = {};

    if (!formData.name?.trim()) errors.name = 'Full name is required.';
    if (!formData.registrationNumber?.trim()) errors.registrationNumber = 'Registration number is required.';

    if (form.formId === 'SEU-MED-ABSENT' || form.formId === 'SEU-ICT-MED-LEC') {
      if (!formData.department?.trim()) errors.department = 'Department name is required.';
      if (!formData.address?.trim()) errors.address = 'Postal address is required.';
      if (!formData.leaveFrom) errors.leaveFrom = 'Medical leave start date is required.';
      if (!formData.leaveTo) errors.leaveTo = 'Medical leave end date is required.';
      if (!formData.medicalReason?.trim()) errors.medicalReason = 'Please state the reason for absence.';
      if (formData.medicalSubjectType === 'Any Other' && !formData.medicalOtherSpecify?.trim()) {
        errors.medicalOtherSpecify = 'Please specify the custom subject category.';
      }
      const hasSubject = formData.medicalSubjectsList.some(s => s.code.trim() && s.title.trim());
      if (!hasSubject) {
        errors.medicalSubjects = 'Please enter at least one requested subject with Code and Title.';
      }
    }

    if (form.formId === 'SEU-EX-ESA-REP' || form.formId === 'SEU-EX-CA-REP') {
      if (!formData.indexNumber?.trim()) errors.indexNumber = 'Index number is required.';
      if (!formData.examBatch?.trim()) errors.examBatch = 'Current batch / intake year is required.';
      if (!formData.address?.trim()) errors.address = 'Present address is required.';
      if (!formData.phone?.trim()) errors.phone = 'Contact mobile number is required.';
      const hasSubject = formData.examSubjects.some(s => s.code.trim() && s.title.trim());
      if (!hasSubject) {
        errors.examSubjects = 'Please list at least one applied subject.';
      }
    }

    if (form.formId === 'SEU-EMAIL-REQ') {
      if (!formData.preferredEmailPrefix?.trim()) errors.preferredEmailPrefix = 'Preferred Email prefix is required.';
      if (!formData.whatsappNo?.trim()) errors.whatsappNo = 'WhatsApp number is required.';
      if (!formData.personalEmail?.trim()) errors.personalEmail = 'Personal email address is required.';
    }

    if (form.formId === 'SEU-EX-RESCRUTINY') {
      if (!formData.rescrutinyCode?.trim()) errors.rescrutinyCode = 'Subject code is required.';
      if (!formData.gradeReceived?.trim()) errors.gradeReceived = 'Grade received is required.';
      if (!formData.receiptNo?.trim()) errors.receiptNo = 'Receipt number is required.';
    }

    if (form.formId === 'SEU-PIV-VOUCHER') {
      if (!formData.name?.trim()) errors.name = 'Depositor name is required.';
      if (!formData.registrationNumber?.trim()) errors.registrationNumber = 'Registration number is required.';
      if (!formData.pivAmount?.toString().trim() && !formData.examFeesPaid?.toString().trim()) {
        errors.pivAmount = 'Amount in figures is required.';
      }
      if (!formData.amountWords?.trim()) errors.amountWords = 'Amount in words is required.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const cleanCode = form.formId.replace('SEU-', '');
    const generatedRef = `SEU/FT/${new Date().getFullYear()}/${cleanCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRefNumber(generatedRef);
    setValidationErrors({});
    setIsSubmitted(true);
    setActiveTab('preview');
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper: University Seal Crest SVG
  const renderUniversityCrest = () => (
    <svg width="60" height="60" viewBox="0 0 100 100" style={{ display: 'block', margin: '0 auto 4px auto' }}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="#000000" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#000000" strokeWidth="1" strokeDasharray="2,2" />
      {/* Sun rays on top */}
      <path d="M 50,18 L 50,11 M 42,21 L 37,15 M 58,21 L 63,15 M 35,26 L 29,22 M 65,26 L 71,22" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
      {/* Central Shield */}
      <path d="M 33,32 L 67,32 C 67,52 50,68 50,68 C 50,68 33,52 33,32 Z" fill="#ffffff" stroke="#000000" strokeWidth="2" />
      {/* Open Book inside shield */}
      <path d="M 38,44 C 44,42 49,45 50,47 C 51,45 56,42 62,44 L 62,56 C 56,54 51,57 50,59 C 49,57 44,54 38,56 Z" fill="none" stroke="#000" strokeWidth="1.6" />
      <line x1="50" y1="47" x2="50" y2="59" stroke="#000" strokeWidth="1.5" />
      {/* Laurel Wreath */}
      <path d="M 23,45 C 21,58 29,74 50,81 C 71,74 79,58 77,45" fill="none" stroke="#000000" strokeWidth="2" />
      {/* Base Ribbon */}
      <path d="M 30,81 L 50,77 L 70,81 L 65,85 L 35,85 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
    </svg>
  );

  // Render Signature Element in Document
  const renderDocumentSignature = () => {
    if (formData.signatureImage) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={formData.signatureImage}
            alt="Candidate Signature"
            style={{ maxHeight: '42px', maxWidth: '160px', objectFit: 'contain' }}
          />
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#111' }}>
            {formData.name}
          </div>
        </div>
      );
    }
    return (
      <div style={{ fontStyle: 'italic', fontFamily: 'cursive', fontSize: '1.05rem', color: '#0b2545' }}>
        {formData.name || 'Candidate Signature'}
      </div>
    );
  };

  /* =========================================================================
     DOCUMENT RENDERER: SWITCH PER FORM ID
     ========================================================================= */
  const renderOfficialDocument = () => {
    switch (form.formId) {
      /* =====================================================================
         FORM A: MEDICAL SUBMISSION FORM (2-PAGE UNIFIED OFFICIAL FORM)
         ===================================================================== */
      case 'SEU-MED-ABSENT':
      case 'SEU-ICT-MED-LEC':
        return (
          <div className="printable-document">
            {/* -------------------- PAGE 1 (FRONT SIDE) -------------------- */}
            <div className="printable-page-block">
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {renderUniversityCrest()}
                <div style={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: 1.3 }}>
                  ශ්‍රී ලංකා අග්නිදිග විශ්වවිද්‍යාලය
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 'bold', lineHeight: 1.3 }}>
                  இலங்கை தென்கிழக்குப் பல்கலைக்கழகம்
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 'bold', letterSpacing: '0.04em', lineHeight: 1.3 }}>
                  SOUTH EASTERN UNIVERSITY OF SRI LANKA
                </div>
                {/* Double Rule */}
                <div style={{ borderTop: '2px solid #000', borderBottom: '1px solid #000', height: '3px', margin: '6px 0 8px 0' }} />
                <div style={{ fontSize: '0.92rem', fontWeight: 'bold', letterSpacing: '0.03em' }}>
                  OFFICE OF THE DEAN, FACULTY OF TECHNOLOGY
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', textDecoration: 'underline', marginTop: '6px', letterSpacing: '0.04em' }}>
                  MEDICAL SUBMISSION FORM
                </div>
              </div>

              {/* Sections 1 & 2: Two-column box layout */}
              <div className="med-form-top-grid" style={{ display: 'grid', gridTemplateColumns: '1.18fr 0.82fr', gap: '8px', marginTop: '12px' }}>
                {/* Section 1: Details of the Applicant */}
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '3px' }}>
                    1. Details of the Applicant:
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <tbody>
                      <tr style={{ border: '1px solid #000' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', width: '42%', fontWeight: 600 }}>Name</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px' }}><strong>{formData.name.toUpperCase()}</strong></td>
                      </tr>
                      <tr style={{ border: '1px solid #000' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontWeight: 600 }}>Registration Number</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px' }}><strong>{formData.registrationNumber.toUpperCase()}</strong></td>
                      </tr>
                      <tr style={{ border: '1px solid #000' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontWeight: 600 }}>Index Number</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px' }}>{formData.indexNumber.toUpperCase()}</td>
                      </tr>
                      <tr style={{ border: '1px solid #000' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontWeight: 600 }}>
                          Are you a Repeat or Fresh Candidate?
                        </td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px' }}>
                          <span style={{ marginRight: '14px' }}>
                            [{formData.medicalCandidateType === 'Repeat' ? '✓' : ' '}] Repeat
                          </span>
                          <span>
                            [{formData.medicalCandidateType === 'Fresh' ? '✓' : ' '}] Fresh
                          </span>
                        </td>
                      </tr>
                      <tr style={{ border: '1px solid #000' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontWeight: 600 }}>Department</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px' }}>{formData.department}</td>
                      </tr>
                      <tr style={{ border: '1px solid #000' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontWeight: 600 }}>Postal Address</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontSize: '0.78rem' }}>{formData.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 2: Subject (Please tick one) */}
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '3px' }}>
                    2. Subject (Please ✓ one) :
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <tbody>
                      <tr style={{ border: '1px solid #000', height: '34px' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontWeight: 500 }}>Attendance for the Lecture</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'center', width: '38px', fontWeight: 'bold' }}>
                          {formData.medicalSubjectType === 'Attendance for the Lecture' ? '✓' : ''}
                        </td>
                      </tr>
                      <tr style={{ border: '1px solid #000', height: '34px' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontWeight: 500 }}>End Semester Examination</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'center', fontWeight: 'bold' }}>
                          {formData.medicalSubjectType === 'End Semester Examination' ? '✓' : ''}
                        </td>
                      </tr>
                      <tr style={{ border: '1px solid #000', height: '34px' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', fontWeight: 500 }}>Continuous Assessment (CA)</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'center', fontWeight: 'bold' }}>
                          {formData.medicalSubjectType === 'Continuous Assessment (CA)' ? '✓' : ''}
                        </td>
                      </tr>
                      <tr style={{ border: '1px solid #000', height: '62px' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', verticalAlign: 'top', fontWeight: 500 }}>
                          Any Other (Please Specify)<br />
                          {formData.medicalSubjectType === 'Any Other' && formData.medicalOtherSpecify && (
                            <span style={{ fontSize: '0.78rem', color: '#111', fontWeight: 'bold', textDecoration: 'underline' }}>
                              {formData.medicalOtherSpecify}
                            </span>
                          )}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'center', verticalAlign: 'top', fontWeight: 'bold' }}>
                          {formData.medicalSubjectType === 'Any Other' ? '✓' : ''}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Dates */}
              <div style={{ marginTop: '12px', fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  3. Please specify the dates for which you are applying for medical leave:
                </div>
                <div style={{ display: 'flex', gap: '40px', paddingLeft: '8px' }}>
                  <div>
                    <strong>From:</strong> &nbsp;
                    <span style={{ borderBottom: '1px dotted #000', padding: '0 20px', fontWeight: 'bold' }}>
                      {formData.leaveFrom || '....................................'}
                    </span>
                  </div>
                  <div>
                    <strong>To:</strong> &nbsp;
                    <span style={{ borderBottom: '1px dotted #000', padding: '0 20px', fontWeight: 'bold' }}>
                      {formData.leaveTo || '....................................'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Reason for absence */}
              <div style={{ marginTop: '10px', fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  4. Please state the reason for the absence. <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>(Please annex the certified medical certificate and use additional sheets if necessary)</span>
                </div>
                <div style={{
                  border: '1px solid #000',
                  minHeight: '68px',
                  padding: '8px 10px',
                  lineHeight: 1.4,
                  fontSize: '0.82rem'
                }}>
                  {formData.medicalReason}
                  {formData.medicalCertFileName && (
                    <div style={{ marginTop: '6px', fontSize: '0.75rem', fontWeight: 'bold', color: '#065f46' }}>
                      [✓ Annexed: Certified Medical Certificate attached — {formData.medicalCertFileName}]
                    </div>
                  )}
                </div>
              </div>

              {/* Section 5: Requested Subject/s (8-Row Table) */}
              <div style={{ marginTop: '10px', fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  5. Requested Subject/s: <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>(Please list the subjects for which you are requesting consideration due to your absence)</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ border: '1px solid #000', background: '#f8fafc' }}>
                      <th style={{ border: '1px solid #000', padding: '4px', width: '50px', textAlign: 'center' }}>S.No</th>
                      <th style={{ border: '1px solid #000', padding: '4px', width: '150px', textAlign: 'center' }}>Subject Code</th>
                      <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Subject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.medicalSubjectsList.slice(0, 8).map((sub, i) => (
                      <tr key={i} style={{ border: '1px solid #000', height: '22px' }}>
                        <td style={{ border: '1px solid #000', textAlign: 'center', padding: '2px 4px' }}>{i + 1}</td>
                        <td style={{ border: '1px solid #000', padding: '2px 8px', fontWeight: 'bold' }}>{sub.code.toUpperCase()}</td>
                        <td style={{ border: '1px solid #000', padding: '2px 8px' }}>{sub.title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Page 1 Bottom Sign-off */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '18px', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ borderBottom: '1px dotted #000', width: '180px', paddingBottom: '2px' }}>
                    <strong>{formData.applicationDate}</strong>
                  </div>
                  <div style={{ marginTop: '2px' }}>Date</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ minWidth: '180px', minHeight: '38px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    {renderDocumentSignature()}
                  </div>
                  <div style={{ borderTop: '1px dotted #000', paddingTop: '2px', marginTop: '2px' }}>
                    Signature of the Student
                  </div>
                </div>
              </div>

              {/* Page 1 Bottom Examination Notice */}
              <div style={{
                marginTop: '12px',
                fontSize: '0.7rem',
                lineHeight: 1.35,
                fontStyle: 'italic',
                borderTop: '1px solid #ccc',
                paddingTop: '6px',
                color: '#333'
              }}>
                <strong>Note:</strong> If this request pertains to a final examination, please attach a copy of the notice sent to the Senior Assistant Registrar regarding your absence. As per university policy, if a student falls ill during examinations, the student or guardian must notify the Senior Assistant Registrar in writing within 48 hours. A valid medical certificate must be submitted within two weeks of the last exam date.
              </div>
            </div>

            {/* SCREEN PAGE SEPARATOR */}
            <div className="page-divider-screen">
              Page 2: Back Side (For Office Use &amp; HoD / Dean Endorsements)
            </div>

            {/* PRINT PAGE BREAK */}
            <div className="form-page-break" />

            {/* -------------------- PAGE 2 (BACK SIDE) -------------------- */}
            <div className="printable-page-block" style={{ minHeight: '600px', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.88rem', lineHeight: 2.2 }}>
                <div><strong>For Office Use:</strong></div>
                <div style={{ paddingLeft: '16px' }}>
                  <div>• Date Received: ....................................................</div>
                  <div>• Remarks (if any): .................................................................................................................................................</div>
                  <div style={{ borderBottom: '1px dotted #000', height: '22px' }}></div>
                </div>

                <div style={{ margin: '30px 0 10px 0', borderTop: '1px solid #000', paddingTop: '16px' }}>
                  <strong>Recommended /Approved by the Head of Department:</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px', paddingLeft: '16px' }}>
                  <div>Date: ....................................................</div>
                  <div>Signature: ........................................................................................</div>
                </div>

                <div style={{ margin: '36px 0 10px 0', borderTop: '1px solid #000', paddingTop: '16px' }}>
                  <strong>Forwarding to Dean's Office:</strong>
                </div>
                <div style={{ paddingLeft: '16px' }}>
                  <div>• Date Received: ....................................................</div>
                  <div>• Remarks (if any): .................................................................................................................................................</div>
                  <div style={{ borderBottom: '1px dotted #000', height: '22px' }}></div>
                </div>

                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
                  <div style={{ textAlign: 'center', fontSize: '0.82rem' }}>
                    <div style={{ minHeight: '50px' }}></div>
                    <div style={{ borderTop: '1px solid #000', paddingTop: '4px', fontWeight: 'bold' }}>
                      Dean / Faculty of Technology
                    </div>
                    <div style={{ fontSize: '0.74rem' }}>South Eastern University of Sri Lanka</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      /* =====================================================================
         FORM B: APPLICATION FOR EXAMINATION (2-PAGE UNIFIED OFFICIAL FORM)
         ===================================================================== */
      case 'SEU-EX-ESA-REP':
      case 'SEU-EX-CA-REP':
      default:
        return (
          <div className="printable-document">
            {/* -------------------- PAGE 1 (FRONT SIDE) -------------------- */}
            <div className="printable-page-block">
              {/* Top Row: Crest, Titles, and Office Use Box */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ width: '65px' }}>
                  {renderUniversityCrest()}
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 'bold', letterSpacing: '0.04em' }}>
                    SOUTH EASTERN UNIVERSITY OF SRI LANKA
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 'bold' }}>
                    EXAMINATIONS DIVISION
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 'bold', textDecoration: 'underline', marginTop: '2px' }}>
                    APPLICATION FOR EXAMINATION
                  </div>
                  <div style={{ fontSize: '0.75rem', fontStyle: 'italic', marginTop: '2px' }}>
                    (This form should be completed in BLOCK CAPITAL letters &amp; Tick ✓ appropriate box)
                  </div>
                </div>
                <div style={{ border: '1px solid #000', padding: '4px 10px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  OFFICE USE ONLY<br />
                  <span style={{ fontSize: '0.68rem', fontWeight: 'normal' }}>{refNumber || 'REF / EXAM'}</span>
                </div>
              </div>

              {/* PART - I */}
              <div style={{ fontSize: '0.82rem', lineHeight: 1.8 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>PART - I</div>

                {/* 01. Name with initials */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '3px 0' }}>
                  <span style={{ minWidth: '150px' }}>01. Name with initials:</span>
                  <div style={{ border: '1px solid #000', padding: '2px 8px', fontWeight: 'bold', fontSize: '0.78rem' }}>
                    [{formData.title === 'Mr.' ? '✓' : ' '}] Mr. &nbsp;|&nbsp; [{formData.title === 'Ms.' ? '✓' : ' '}] Ms.
                  </div>
                  <div style={{ border: '1px solid #000', flex: 1, padding: '2px 8px', fontWeight: 'bold' }}>
                    {formData.name.toUpperCase()}
                  </div>
                </div>

                {/* 02. Registration No */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '3px 0' }}>
                  <span style={{ minWidth: '150px' }}>02. Registration No:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ border: '1px solid #000', padding: '2px 8px', fontWeight: 'bold' }}>SEU</span>
                    <span style={{ border: '1px solid #000', padding: '2px 8px', fontWeight: 'bold' }}>IS</span>
                    <span style={{ border: '1px solid #000', padding: '2px 8px', fontWeight: 'bold' }}>FT</span>
                    <span style={{ border: '1px solid #000', padding: '2px 10px', fontWeight: 'bold' }}>
                      {formData.registrationNumber.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* 03. Current Batch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '3px 0' }}>
                  <span style={{ minWidth: '450px' }}>
                    03. Current Batch (If transferred to others batch indicate intake academic year):
                  </span>
                  <div style={{ border: '1px solid #000', padding: '2px 14px', fontWeight: 'bold' }}>
                    {formData.examBatch || '2022 / 2023'}
                  </div>
                </div>

                {/* 04 - 07 Four Box Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr 1fr', gap: '8px', margin: '4px 0', fontSize: '0.78rem' }}>
                  {/* 04. Faculty */}
                  <div style={{ border: '1px solid #000', padding: '3px 6px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>04. Faculty:</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['FAC', 'FE', 'FIA', 'FMC', 'FT'].map(f => (
                        <span key={f}>[{formData.examFaculty === f ? '✓' : ' '}] {f}</span>
                      ))}
                    </div>
                  </div>

                  {/* 05. Medium */}
                  <div style={{ border: '1px solid #000', padding: '3px 6px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>05. Medium:</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span>[{formData.examMedium === 'English' ? '✓' : ' '}] English</span>
                      <span>[{formData.examMedium === 'Tamil' ? '✓' : ' '}] Tamil</span>
                    </div>
                  </div>

                  {/* 06. Semester */}
                  <div style={{ border: '1px solid #000', padding: '3px 6px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>06. Semester:</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span>[{formData.examSemester === 'I' ? '✓' : ' '}] I</span>
                      <span>[{formData.examSemester === 'II' ? '✓' : ' '}] II</span>
                    </div>
                  </div>

                  {/* 07. Applied for */}
                  <div style={{ border: '1px solid #000', padding: '3px 6px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>07. Applied for:</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span>[{formData.examAppliedFor === 'Fresh' ? '✓' : ' '}] Fresh</span>
                      <span>[{formData.examAppliedFor === 'Repeat' ? '✓' : ' '}] Repeat</span>
                    </div>
                  </div>
                </div>

                {/* 08. Year of Examinations */}
                <div style={{ margin: '4px 0' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.78rem' }}>
                    08. Year of Examinations: <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(Use Separate form each year)</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid #000', textAlign: 'center', fontSize: '0.76rem' }}>
                    {['First Year', 'Second Year', 'Third Year', 'Fourth Year'].map(yr => (
                      <div key={yr} style={{ borderRight: yr !== 'Fourth Year' ? '1px solid #000' : 'none', padding: '3px 4px' }}>
                        [{formData.examYear === yr ? '✓' : ' '}] {yr}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 09. Field of Specialization */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '3px 0' }}>
                  <span style={{ minWidth: '180px' }}>09. Field of Specialization (if any):</span>
                  <div style={{ border: '1px solid #000', flex: 1, padding: '2px 8px' }}>
                    {formData.specialization}
                  </div>
                </div>

                {/* 10. Present Address */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '3px 0' }}>
                  <span style={{ minWidth: '180px' }}>10. Present Address:</span>
                  <div style={{ border: '1px solid #000', flex: 1, padding: '2px 8px', fontSize: '0.78rem' }}>
                    {formData.address}
                  </div>
                </div>

                {/* 11. Contact Mobile No */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '3px 0' }}>
                  <span style={{ minWidth: '180px' }}>11. Contact Mobile No:</span>
                  <div style={{ border: '1px solid #000', padding: '2px 14px', fontWeight: 'bold' }}>
                    {formData.phone}
                  </div>
                </div>

                {/* 12. Applied Subjects Table (12 Rows) */}
                <div style={{ marginTop: '6px' }}>
                  <div style={{ fontWeight: 'bold' }}>12. Applied Subjects:</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', marginTop: '2px' }}>
                    <thead>
                      <tr style={{ border: '1px solid #000', background: '#f1f5f9' }}>
                        <th style={{ border: '1px solid #000', padding: '3px', width: '38px', textAlign: 'center' }}>S.No</th>
                        <th style={{ border: '1px solid #000', padding: '3px', width: '160px', textAlign: 'center' }}>Subject Code (Specify Clearly)</th>
                        <th style={{ border: '1px solid #000', padding: '3px', textAlign: 'center' }}>Subject Title</th>
                        <th style={{ border: '1px solid #000', padding: '3px', width: '170px', textAlign: 'center' }}>Signature of Head of department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.examSubjects.map((sub, i) => (
                        <tr key={i} style={{ border: '1px solid #000', height: '19px' }}>
                          <td style={{ border: '1px solid #000', textAlign: 'center', padding: '1px' }}>{sub.sno || (i < 9 ? `0${i + 1}` : `${i + 1}`)}</td>
                          <td style={{ border: '1px solid #000', padding: '1px 6px', fontWeight: 'bold' }}>{sub.code.toUpperCase()}</td>
                          <td style={{ border: '1px solid #000', padding: '1px 6px' }}>{sub.title}</td>
                          <td style={{ border: '1px solid #000' }}></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 13. Attempts completed */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem' }}>
                  <div>13. Repeat candidates please state No. of attempts completed:</div>
                  <div style={{ border: '1px solid #000', padding: '2px 18px', fontWeight: 'bold' }}>
                    {formData.examAttempts || '0'}
                  </div>
                </div>

                {/* Page 1 Bottom Note */}
                <div style={{
                  marginTop: '6px',
                  fontSize: '0.7rem',
                  lineHeight: 1.35,
                  fontStyle: 'italic',
                  borderTop: '1px solid #ccc',
                  paddingTop: '4px'
                }}>
                  <strong>Note:</strong> Please note that a Candidate is eligible for 3 consecutive attempts irrespective of whether a candidate appears for a schedule examinations or not, after completion of course work. Each scheduled examination will be counted as an exhausted attempt.
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.68rem', color: '#555' }}>
                  <span>D:\NAZAR MHM\EXAMS\Formats\App. of Exam</span>
                  <span style={{ fontWeight: 'bold' }}>(P.T.O)</span>
                </div>
              </div>
            </div>

            {/* SCREEN PAGE SEPARATOR */}
            <div className="page-divider-screen">
              Page 2: Back Side (PIV Voucher Affix &amp; Verifications)
            </div>

            {/* PRINT PAGE BREAK */}
            <div className="form-page-break" />

            {/* -------------------- PAGE 2 (BACK SIDE) -------------------- */}
            <div className="printable-page-block" style={{ paddingTop: '8px' }}>
              {/* Page Number Center Header */}
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
                02
              </div>

              {/* 14. Fees paid by Repeat Candidate */}
              <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                <div>
                  14. Fees paid by Repeat Candidate of Rs. &nbsp;
                  <span style={{ borderBottom: '1px dotted #000', padding: '0 20px', fontWeight: 'bold' }}>
                    {formData.examFeesPaid || '400'} /=
                  </span>
                </div>
                <div style={{ fontStyle: 'italic', fontSize: '0.78rem' }}>
                  (Please affix a copy of paying in Voucher as proof of the payment of examination fees)
                </div>
                <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>
                  Payment: Rs. 100/- per subject for Four (04) and more subject Rs. 400/-
                </div>

                {/* Huge Affix Box for PIV */}
                <div style={{
                  border: '1.5px solid #000',
                  height: '320px',
                  margin: '12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: '#fafafa',
                  overflow: 'hidden'
                }}>
                  {formData.pivImage ? (
                    <img
                      src={formData.pivImage}
                      alt="Affixed PIV Receipt"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{
                      transform: 'rotate(-25deg)',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      color: '#666666',
                      letterSpacing: '0.04em',
                      textAlign: 'center',
                      userSelect: 'none'
                    }}>
                      A copy of PIV should be affix here
                    </div>
                  )}
                  {formData.pivFileName && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '12px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      padding: '2px 8px',
                      border: '1px solid #333',
                      fontSize: '0.72rem',
                      fontWeight: 'bold'
                    }}>
                      Affixed: {formData.pivFileName}
                    </div>
                  )}
                </div>

                {/* Candidate Truth Declaration */}
                <div style={{ fontSize: '0.82rem', margin: '8px 0' }}>
                  The above details are given by me true and correct according to my knowledge.
                </div>

                {/* Date & Signature Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
                  <div>
                    Date: &nbsp;
                    <span style={{ borderBottom: '1px dotted #000', padding: '0 20px', fontWeight: 'bold' }}>
                      {formData.applicationDate}
                    </span>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ minWidth: '180px', minHeight: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      {renderDocumentSignature()}
                    </div>
                    <div style={{ borderTop: '1px dotted #000', paddingTop: '2px', fontSize: '0.78rem' }}>
                      Signature of Candidate
                    </div>
                  </div>
                </div>

                {/* Part - II Verification */}
                <div style={{ borderTop: '1.5px solid #000', marginTop: '16px', paddingTop: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Part - II</div>
                  <div style={{ fontSize: '0.8rem', marginBottom: '14px' }}>
                    Particulars from 01 - 14 are checked with me and found correct
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1.2fr', alignItems: 'flex-end', fontSize: '0.78rem' }}>
                    <div>
                      <div>........................................................</div>
                      <div style={{ fontWeight: 'bold' }}>Signature of Subject in-charge</div>
                      <div>Dept. of ............................................</div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      Date: ....................................
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div>........................................................</div>
                      <div style={{ fontWeight: 'bold' }}>Senior Asst. Registrar</div>
                      <div>Faculty of ........................................</div>
                      <div style={{ fontSize: '0.7rem', color: '#666' }}>(seal)</div>
                    </div>
                  </div>
                </div>

                {/* Part - III Registration Approval */}
                <div style={{ borderTop: '1.5px solid #000', marginTop: '16px', paddingTop: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Part - III</div>
                  <div style={{ fontSize: '0.8rem', margin: '4px 0 16px 0' }}>
                    Please register / do not regster the candidate for the examination
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.78rem' }}>
                    <div>
                      Date: ....................................
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div>....................................................................................</div>
                      <div style={{ fontWeight: 'bold' }}>Deputy Registrar/ Examinations</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', fontSize: '0.68rem', color: '#555' }}>
                  D:\NAZAR MHM\EXAMS\Formats\App. of Exam
                </div>
              </div>
            </div>
          </div>
        );

      /* =====================================================================
         FORM C: OFFICIAL EMAIL REQUEST FORM (IMAGE 1)
         ===================================================================== */
      case 'SEU-EMAIL-REQ':
        return (
          <div className="printable-document">
            <div className="university-form-header">
              <h2>SOUTH EASTERN UNIVERSITY OF SRI LANKA</h2>
              <h3 style={{ textDecoration: 'underline', marginTop: '6px' }}>OFFICIAL EMAIL REQUEST FORM</h3>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginTop: '16px' }}>
              <tbody>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', width: '35%', fontWeight: 600 }}>Full Name</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}><strong>{formData.name.toUpperCase()}</strong></td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>First Name</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{formData.firstName}</td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>Last Name</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{formData.lastName}</td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>
                    Designation<br />
                    <span style={{ fontSize: '0.74rem', fontWeight: 'normal', fontStyle: 'italic' }}>
                      (if student, mention the Stu.Reg.No.)
                    </span>
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>
                    <strong>{formData.designation}</strong>
                  </td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>Department / Unit / Center</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{formData.department}</td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>Faculty</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}><strong>{formData.faculty}</strong></td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>Permanent/Temporary</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{formData.employmentType}</td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>
                    Preferred Email ID<br />
                    <span style={{ fontSize: '0.72rem', fontWeight: 'normal', fontStyle: 'italic' }}>
                      (if student, include the Stu.Reg.No. Ex:- xxxreg23.001@)
                    </span>
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{formData.preferredEmailPrefix}</span>@seu.ac.lk
                  </td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>Purpose of the Email</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{formData.emailPurpose}</td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>
                    WhatsApp No. <i>(For Notification Purpose)</i>
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{formData.whatsappNo}</td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>
                    Present E-Mail ID <i>(If any Eg. Gmail, Yahoo etc.)</i>
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{formData.personalEmail}</td>
                </tr>
                <tr style={{ border: '1px solid #000', height: '54px' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>Signature of applicant</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>
                    {renderDocumentSignature()}
                  </td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 600 }}>Date Applied on</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{formData.applicationDate}</td>
                </tr>
              </tbody>
            </table>

            {/* FOR OFFICE USE ONLY */}
            <div style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '22px', marginBottom: '8px', fontSize: '0.88rem', letterSpacing: '0.05em' }}>
              <u>FOR OFFICE USE ONLY</u>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <tbody>
                <tr style={{ border: '1px solid #000', height: '60px' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', width: '50%' }}>
                    Recommended /<br />
                    Not Recommended
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', verticalAlign: 'bottom' }}>
                    ..............................................<br />
                    <strong>Signature</strong><br />
                    Head of the Department
                  </td>
                </tr>
                <tr style={{ border: '1px solid #000', height: '60px' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>
                    Approved/ Not Approved
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', verticalAlign: 'bottom' }}>
                    ..............................................<br />
                    <strong>Signature</strong><br />
                    Dean of the Faculty
                  </td>
                </tr>
                <tr style={{ border: '1px solid #000', height: '60px' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>
                    Approved/Not Approved
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px', verticalAlign: 'bottom' }}>
                    ..............................................<br />
                    <strong>Signature</strong><br />
                    Vice chancellor, SEUSL
                  </td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>E-Mail ID Created</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>
                    .........................................................................@seu.ac.lk
                  </td>
                </tr>
                <tr style={{ border: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>Date of E-Mail ID Created</td>
                  <td style={{ border: '1px solid #000', padding: '8px 12px' }}>.........................................................................</td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: 'right', marginTop: '22px', fontSize: '0.8rem', lineHeight: 1.6 }}>
              <div>Approved/Not Approved</div>
              <div style={{ marginTop: '24px' }}>......................................................</div>
              <div style={{ fontWeight: 600 }}>Coordinator, ICT Center</div>
              <div>South Eastern University of Sri Lanka</div>
            </div>
          </div>
        );

      /* =====================================================================
         FORM D: RE-SCRUTINIZATION OF MARKS & GRADES (IMAGE 3)
         ===================================================================== */
      case 'SEU-EX-RESCRUTINY':
        return (
          <div className="printable-document">
            <div className="university-form-header">
              <h2>South Eastern University of Sri Lanka</h2>
              <h3>Examinations Division</h3>
              <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', fontStyle: 'normal', marginTop: '6px' }}>
                Application for re-scrutinization of Marks &amp; Grades
              </h4>
              <div style={{ fontSize: '0.78rem', fontStyle: 'italic', marginTop: '2px' }}>
                (Should be filled in CAPITAL letters and check '✓' appropriate box)
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', lineHeight: 1.9 }}>
              <div><strong><u>Details of the Candidate:</u></strong></div>
              <div>
                01. Name with Initials: <strong>{formData.title} {formData.name.toUpperCase()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>02. Registration No: <strong>{formData.registrationNumber.toUpperCase()}</strong></div>
                <div>03. Index No: <strong>{formData.indexNumber.toUpperCase()}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '30px', margin: '4px 0', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span>04. Subject/ Course Year:</span>
                  {['1st', '2nd', '3rd', '4th'].map(yr => (
                    <span key={yr} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: '6px' }}>
                      [{formData.courseYear === yr ? '✓' : ' '}] {yr}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span>05. Semester:</span>
                  <span>[{formData.semShort === 'I' ? '✓' : ' '}] I</span>
                  <span>[{formData.semShort === 'II' ? '✓' : ' '}] II</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>06. Faculty:</span>
                {['FAC', 'FMC', 'FAS', 'FIA', 'FE', 'FT'].map(fac => (
                  <span key={fac} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    [{fac === 'FT' ? '✓' : ' '}] {fac}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>07. Contact No: <strong>{formData.phone}</strong></div>
                <div>08. E-mail: <strong>{formData.personalEmail}</strong></div>
              </div>

              <div style={{ marginTop: '14px' }}>
                <strong><u>Subject/ Course Unit Details:</u></strong>
              </div>
              <div>09. Name &amp; Year of the Examination: <strong>{formData.examNameYear}</strong></div>
              <div>
                10. Subject/ Course Code &amp; Title: <strong>{formData.rescrutinyCode.toUpperCase()} - {formData.rescrutinyTitle}</strong><br />
                <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#555' }}>
                  (Use separate application for each subject)
                </span>
              </div>
              <div>
                11. Grade Received: <strong style={{ border: '1px solid #000', padding: '2px 10px', marginLeft: '6px' }}>{formData.gradeReceived.toUpperCase()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '4px' }}>
                <div>
                  12. Amount Paid: Rs. <strong>{formData.amountPaid}/=</strong><br />
                  <span style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#555' }}>(at the rate of Rs. 500/- per subject/ course)</span>
                </div>
                <div>
                  13. Receipt No: <strong>{formData.receiptNo}</strong><br />
                  <span style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#555' }}>(Original receipt should be attached)</span>
                  {formData.receiptFileName && (
                    <div style={{ fontSize: '0.75rem', color: 'green', fontWeight: 'bold' }}>
                      [Attached: {formData.receiptFileName}]
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px' }}>
                <div>Date: <strong>{formData.applicationDate}</strong></div>
                <div style={{ textAlign: 'center' }}>
                  {renderDocumentSignature()}
                  <div style={{ borderTop: '1px solid #000', paddingTop: '3px', fontSize: '0.8rem', marginTop: '4px' }}>
                    Signature of the candidate
                  </div>
                </div>
              </div>

              {/* FOR OFFICE USE ONLY */}
              <div style={{ borderTop: '2px dashed #000', marginTop: '20px', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ border: '1px solid #000', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    For Office Use Only
                  </div>
                  <div>Exam No: ....................................................</div>
                </div>

                <div style={{ marginTop: '8px', fontSize: '0.82rem', lineHeight: 1.8 }}>
                  <div>The above application is received according to the circular: Yes/ No</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>The application: accepted/ rejected</div>
                    <div>...................................................................<br />Deputy Registrar/Exams</div>
                  </div>

                  <div>Name &amp; Year of the Examination: ..........................................................................................................</div>
                  <div>Subject/ Course Code &amp; Title: .....................................................................................................................</div>

                  <div style={{ display: 'flex', gap: '30px', margin: '6px 0', flexWrap: 'wrap' }}>
                    <div>
                      Results <u>before verification</u>: Marks: [ &nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp; Grade: [ &nbsp;&nbsp;&nbsp;&nbsp; ]
                    </div>
                    <div>
                      Results <u>after verification</u>: Marks: [ &nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp; Grade: [ &nbsp;&nbsp;&nbsp;&nbsp; ]
                    </div>
                  </div>
                  <div>Status of Results: Changed/ Not Changed</div>
                  <div>Reason if change of results: ........................................................................................................................</div>
                  <div style={{ fontSize: '0.72rem', fontStyle: 'italic' }}>(Use next page when necessary)</div>

                  <div style={{ marginTop: '10px' }}>
                    <strong>Name and Signatures of Verification Board Members</strong> &nbsp;&nbsp;&nbsp;&nbsp; Date of Verification: ....................
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ background: '#f5f5f5', border: '1px solid #000' }}>
                          <th style={{ border: '1px solid #000', padding: '4px', width: '35%' }}>Name</th>
                          <th style={{ border: '1px solid #000', padding: '4px', width: '35%' }}>Designation</th>
                          <th style={{ border: '1px solid #000', padding: '4px', width: '30%' }}>Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4].map(num => (
                          <tr key={num} style={{ border: '1px solid #000', height: '24px' }}>
                            <td style={{ border: '1px solid #000' }}></td>
                            <td style={{ border: '1px solid #000' }}></td>
                            <td style={{ border: '1px solid #000' }}></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ fontSize: '0.68rem', color: '#666', marginTop: '10px' }}>
                    CC/No 078 of 09/04/2012
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      /* =====================================================================
         FORM E: PAY IN VOUCHER (PIV)
         ===================================================================== */
      case 'SEU-PIV-VOUCHER':
        return (
          <div className="printable-document">
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.03em' }}>PEOPLE'S BANK — ADDALAICHENAI BRANCH</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, margin: '3px 0' }}>PAY IN VOUCHER (PIV) — SOUTH EASTERN UNIVERSITY OF SRI LANKA</div>
              <div style={{ fontSize: '0.85rem', color: '#333', fontWeight: 600 }}>Account No: 228 1001 9000 1704 · Oluvil / Addalaichenai</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.78rem' }}>
              {['BANK COPY', 'BURSAR COPY', 'STUDENT COPY'].map((copyTitle, idx) => (
                <div key={idx} style={{ border: '1.5px solid #000', padding: '10px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '440px' }}>
                  <div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '1.5px solid #000', paddingBottom: '4px', marginBottom: '8px', fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                      {copyTitle}
                    </div>
                    <div style={{ lineHeight: 1.75 }}>
                      <div>Date: <strong>{formData.applicationDate}</strong></div>
                      <div>Depositor: <strong>{formData.name.toUpperCase()}</strong></div>
                      <div>Reg No: <strong>{formData.registrationNumber.toUpperCase()}</strong></div>
                      <div>Course: <strong>{formData.pivCourse || 'BICT (Faculty of Tech)'}</strong></div>
                      <div>Faculty: <strong>Faculty of Technology</strong></div>
                      <div>Purpose: <strong>{formData.pivPurpose || formData.pivCategory || 'Examination / Medical Fees'}</strong></div>
                      {formData.remarks && (
                        <div style={{ fontSize: '0.72rem', color: '#444' }}>Ref: {formData.remarks}</div>
                      )}
                      <div style={{ marginTop: '10px', borderTop: '1px solid #999', paddingTop: '6px' }}>
                        Amount in Figures: <strong style={{ fontSize: '0.92rem' }}>Rs. {formData.pivAmount || formData.examFeesPaid || '400'}/=</strong>
                      </div>
                      <div style={{ fontStyle: 'italic', fontSize: '0.74rem', marginTop: '2px' }}>
                        ({formData.amountWords || 'Four Hundred Rupees Only'})
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
                      {formData.signatureImage ? (
                        <img src={formData.signatureImage} alt="Depositor Signature" style={{ maxHeight: '34px', maxWidth: '120px', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ height: '34px', display: 'flex', alignItems: 'flex-end', fontStyle: 'italic', fontSize: '0.72rem' }}>
                          {formData.name}
                        </div>
                      )}
                      <div style={{ borderTop: '1px solid #000', width: '90%', textAlign: 'center', fontSize: '0.68rem', paddingTop: '2px' }}>
                        Depositor's Signature
                      </div>
                    </div>

                    <div style={{ border: '1px dashed #666', padding: '6px', textAlign: 'center', fontSize: '0.68rem', backgroundColor: '#fafafa' }}>
                      <div style={{ fontWeight: 600 }}>Bank Officer / Cashier</div>
                      <div style={{ height: '22px' }}></div>
                      <div style={{ borderTop: '1px dotted #888', paddingTop: '1px' }}>Signature &amp; Bank Rubber Stamp</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Action Bar (hidden in print mode) */}
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
          <ArrowLeft size={16} /> Back to Forms Catalog
        </button>

        {/* View Mode Tabs */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-page)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('fill')}
            className={`btn btn-sm ${activeTab === 'fill' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Edit3 size={14} /> 1. Complete Form Fields
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isSubmitted) handleSubmit();
              else setActiveTab('preview');
            }}
            className={`btn btn-sm ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileCheck size={14} /> 2. Official Document View {isSubmitted && '✓'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary btn-sm"
            title="Clear and reset form fields"
          >
            <RotateCcw size={15} /> Reset Form
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

      {/* Verification Success Toast */}
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
            <CheckCircle2 color="var(--success)" size={24} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.94rem' }}>
                {form.name} — Verified &amp; Generated Successfully!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Official Tracking Ref: <strong>{refNumber}</strong>. Front side (Page 1) and Back side (Page 2) are ready for printing or saving as PDF.
              </div>
            </div>
          </div>
          <button onClick={handlePrint} className="btn btn-primary btn-sm">
            <Download size={14} /> Download / Print PDF Now
          </button>
        </div>
      )}

      {/* Validation Alert */}
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
            <strong>Incomplete Fields:</strong> {Object.values(validationErrors).join(' ')}
          </div>
        </div>
      )}

      {/* TAB 1: Complete Form Fields */}
      {activeTab === 'fill' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ==========================================================
              FORM 1: MEDICAL SUBMISSION FORM (SEU-MED-ABSENT / SEU-ICT-MED-LEC)
              ========================================================== */}
          {(form.formId === 'SEU-MED-ABSENT' || form.formId === 'SEU-ICT-MED-LEC') && (
            <>
              {/* Section 1 & 2 Card */}
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <User size={18} color="var(--primary-600)" />
                    <span>1. Applicant Details &amp; 2. Subject Category</span>
                  </div>
                  <span className="badge badge-info">Faculty of Technology</span>
                </div>

                <div className="grid-2">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Name of Applicant (Full Name) *</label>
                    <input
                      type="text"
                      className={`form-input ${validationErrors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. MOHOMMADHU NAZEER MOHOMMADHU AFNAN"
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
                    <label className="form-label">Index Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.indexNumber}
                      onChange={(e) => handleChange('indexNumber', e.target.value)}
                      placeholder="e.g. ICT22085"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Are you a Repeat or Fresh Candidate? *</label>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="medicalCandidateType"
                          checked={formData.medicalCandidateType === 'Fresh'}
                          onChange={() => handleChange('medicalCandidateType', 'Fresh')}
                        />
                        <span style={{ fontWeight: 600 }}>Fresh Candidate</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="medicalCandidateType"
                          checked={formData.medicalCandidateType === 'Repeat'}
                          onChange={() => handleChange('medicalCandidateType', 'Repeat')}
                        />
                        <span style={{ fontWeight: 600 }}>Repeat Candidate</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      placeholder="Department of Information and Communication Technology"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Postal Address *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Permanent or current postal residence address"
                      required
                    />
                  </div>

                  {/* Section 2: Subject Category Radio */}
                  <div className="form-group" style={{ gridColumn: '1/-1', borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '6px' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>2. Subject (Please select one category) *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '6px' }}>
                      {[
                        'Attendance for the Lecture',
                        'End Semester Examination',
                        'Continuous Assessment (CA)',
                        'Any Other'
                      ].map(type => (
                        <label key={type} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: formData.medicalSubjectType === type ? 'var(--primary-50)' : 'var(--bg-surface)',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="radio"
                            name="medicalSubjectType"
                            checked={formData.medicalSubjectType === type}
                            onChange={() => handleChange('medicalSubjectType', type)}
                          />
                          <span style={{ fontSize: '0.86rem', fontWeight: formData.medicalSubjectType === type ? 700 : 500 }}>
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>

                    {formData.medicalSubjectType === 'Any Other' && (
                      <div style={{ marginTop: '10px' }}>
                        <label className="form-label">Please Specify Details for Other Category *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.medicalOtherSpecify}
                          onChange={(e) => handleChange('medicalOtherSpecify', e.target.value)}
                          placeholder="e.g. Practical examination / Mid-semester assessment"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3 & 4 Card: Dates, Reason, & Certificate Upload */}
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <Calendar size={18} color="var(--primary-600)" />
                    <span>3. Medical Leave Dates &amp; 4. Reason for Absence</span>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Medical Leave From Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.leaveFrom}
                      onChange={(e) => handleChange('leaveFrom', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medical Leave To Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.leaveTo}
                      onChange={(e) => handleChange('leaveTo', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">
                      4. State Reason for Absence * <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>(certified medical certificate must be annexed)</span>
                    </label>
                    <textarea
                      rows={3}
                      className="form-input"
                      value={formData.medicalReason}
                      onChange={(e) => handleChange('medicalReason', e.target.value)}
                      placeholder="Describe the medical illness or hospitalization details..."
                      required
                    />
                  </div>

                  {/* Certified Medical Certificate File Upload Option */}
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Annex Certified Medical Certificate (Image or PDF)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <input
                        type="file"
                        ref={medicalCertInputRef}
                        onChange={handleMedicalCertUpload}
                        style={{ display: 'none' }}
                        accept="image/*,.pdf"
                      />
                      <button
                        type="button"
                        onClick={() => medicalCertInputRef.current?.click()}
                        className="btn btn-secondary btn-sm"
                      >
                        <FileUp size={15} /> Choose Medical Certificate File
                      </button>

                      {formData.medicalCertFileName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600 }}>
                            ✓ {formData.medicalCertFileName}
                          </span>
                          <button
                            type="button"
                            onClick={removeMedicalCert}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '2px 6px', color: 'var(--danger)' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5 Card: 8 Requested Subjects */}
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <BookOpen size={18} color="var(--primary-600)" />
                    <span>5. Requested Subject/s (Schedule of Missed Subjects)</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>8 Rows Schedule</span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Please list the subjects for which you are requesting consideration due to your medical absence:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.medicalSubjectsList.slice(0, 8).map((sub, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-page)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '32px' }}>
                        Row {idx + 1}
                      </span>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '130px', textTransform: 'uppercase', fontWeight: 700 }}
                        placeholder="e.g. ICT11012"
                        value={sub.code}
                        onChange={(e) => handleMedicalSubjectChange(idx, 'code', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-input"
                        style={{ flex: 1, minWidth: '200px' }}
                        placeholder="Subject Title (e.g. Foundation of Information Technology)"
                        value={sub.title}
                        onChange={(e) => handleMedicalSubjectChange(idx, 'title', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ==========================================================
              FORM 2: APPLICATION FOR EXAMINATION (SEU-EX-ESA-REP / SEU-EX-CA-REP)
              ========================================================== */}
          {(form.formId === 'SEU-EX-ESA-REP' || form.formId === 'SEU-EX-CA-REP') && (
            <>
              {/* Part I: Candidate Particulars */}
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <User size={18} color="var(--primary-600)" />
                    <span>PART - I: Candidate Particulars &amp; Registration</span>
                  </div>
                  <span className="badge badge-info">Examinations Division</span>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Salutation</label>
                    <select
                      className="form-select"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      style={{ maxWidth: '120px' }}
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">01. Name with initials (in BLOCK CAPITALS) *</label>
                    <input
                      type="text"
                      className={`form-input ${validationErrors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. MOHOMMADHU NAZEER MOHOMMADHU AFNAN"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">02. Registration No *</label>
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
                    <label className="form-label">Examination Index No *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.indexNumber}
                      onChange={(e) => handleChange('indexNumber', e.target.value)}
                      placeholder="e.g. ICT22085"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">03. Current Batch (Intake academic year) *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.examBatch}
                      onChange={(e) => handleChange('examBatch', e.target.value)}
                      placeholder="e.g. 2022/2023"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">04. Faculty *</label>
                    <select
                      className="form-select"
                      value={formData.examFaculty}
                      onChange={(e) => handleChange('examFaculty', e.target.value)}
                    >
                      <option value="FT">Faculty of Technology (FT)</option>
                      <option value="FAS">Faculty of Applied Sciences (FAS)</option>
                      <option value="FE">Faculty of Engineering (FE)</option>
                      <option value="FMC">Faculty of Management & Commerce (FMC)</option>
                      <option value="FIA">Faculty of Islamic Studies & Arabic (FIA)</option>
                      <option value="FAC">Faculty of Arts & Culture (FAC)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">05. Medium</label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="radio"
                          name="examMedium"
                          checked={formData.examMedium === 'English'}
                          onChange={() => handleChange('examMedium', 'English')}
                        />
                        <span>English</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="radio"
                          name="examMedium"
                          checked={formData.examMedium === 'Tamil'}
                          onChange={() => handleChange('examMedium', 'Tamil')}
                        />
                        <span>Tamil</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">06. Semester &amp; 07. Applied For</label>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '6px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.84rem' }}>Sem:</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="radio"
                            name="examSemester"
                            checked={formData.examSemester === 'I'}
                            onChange={() => handleChange('examSemester', 'I')}
                          />
                          <span>I</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="radio"
                            name="examSemester"
                            checked={formData.examSemester === 'II'}
                            onChange={() => handleChange('examSemester', 'II')}
                          />
                          <span>II</span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.84rem' }}>Type:</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="radio"
                            name="examAppliedFor"
                            checked={formData.examAppliedFor === 'Fresh'}
                            onChange={() => handleChange('examAppliedFor', 'Fresh')}
                          />
                          <span>Fresh</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="radio"
                            name="examAppliedFor"
                            checked={formData.examAppliedFor === 'Repeat'}
                            onChange={() => handleChange('examAppliedFor', 'Repeat')}
                          />
                          <span>Repeat</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">08. Year of Examinations</label>
                    <select
                      className="form-select"
                      value={formData.examYear}
                      onChange={(e) => handleChange('examYear', e.target.value)}
                    >
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Fourth Year">Fourth Year</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">09. Field of Specialization</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.specialization}
                      onChange={(e) => handleChange('specialization', e.target.value)}
                      placeholder="e.g. Software Systems"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">10. Present Address *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Hostel / residence address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">11. Contact Mobile No *</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+94 77 1234567"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">13. Repeat completed attempts count</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ maxWidth: '120px' }}
                      value={formData.examAttempts}
                      onChange={(e) => handleChange('examAttempts', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 12. Applied Subjects Table (12 Rows) */}
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <BookOpen size={18} color="var(--primary-600)" />
                    <span>12. Applied Subjects Schedule (12 Rows)</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Examination Paper Registration</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {formData.examSubjects.map((sub, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      padding: '6px 10px',
                      backgroundColor: 'var(--bg-page)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: '28px' }}>
                        {sub.sno || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`)}
                      </span>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '130px', textTransform: 'uppercase', fontWeight: 700 }}
                        placeholder="Subject Code"
                        value={sub.code}
                        onChange={(e) => handleExamSubjectChange(idx, 'code', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-input"
                        style={{ flex: 1, minWidth: '200px' }}
                        placeholder="Subject Title"
                        value={sub.title}
                        onChange={(e) => handleExamSubjectChange(idx, 'title', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Page 2: 14 Fees & PIV Voucher Affix Upload */}
              <div className="seu-card" style={{ border: '1.5px solid var(--accent-gold)' }}>
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <Building size={18} color="var(--accent-gold)" />
                    <span>Page 2: 14. Repeat Exam Fees &amp; Affix Pay In Voucher (PIV)</span>
                  </div>
                  <span className="badge badge-warning">Proof of Payment</span>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Fees paid by Repeat Candidate (Rs.) * <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>(Rs. 100/subject or Rs. 400 for 4+ subjects)</span>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ maxWidth: '180px' }}
                      value={formData.examFeesPaid}
                      onChange={(e) => handleChange('examFeesPaid', e.target.value)}
                      placeholder="400"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">
                      Affix Copy of Pay In Voucher (PIV) Image * <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>(Will be embedded inside the official Page 2 affix box)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <input
                        type="file"
                        ref={pivInputRef}
                        onChange={handlePivUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => pivInputRef.current?.click()}
                        className="btn btn-secondary btn-sm"
                      >
                        <FileUp size={15} /> Upload PIV Voucher Image
                      </button>

                      {formData.pivImage && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={formData.pivImage}
                            alt="PIV Voucher Preview"
                            style={{ height: '40px', border: '1px solid #ccc', borderRadius: '4px' }}
                          />
                          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                            ✓ Affixed: {formData.pivFileName}
                          </span>
                          <button
                            type="button"
                            onClick={removePiv}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger)', padding: '2px 6px' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==========================================================
              FORM 3: OFFICIAL EMAIL REQUEST FORM (IMAGE 1)
              ========================================================== */}
          {form.formId === 'SEU-EMAIL-REQ' && (
            <>
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <Mail size={18} color="var(--primary-600)" />
                    <span>Applicant Identity &amp; University Designation</span>
                  </div>
                  <span className="badge badge-info">ICT Center</span>
                </div>

                <div className="grid-2">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-input ${validationErrors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. MOHOMMADHU NAZEER MOHOMMADHU AFNAN"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      placeholder="e.g. Mohommadhu Nazeer"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      placeholder="e.g. Afnan"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Designation <i>(if student, mention the Stu.Reg.No.)</i> *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.designation}
                      onChange={(e) => handleChange('designation', e.target.value)}
                      placeholder="e.g. Student - 22ICT085"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department / Unit / Center</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      placeholder="Department of Information and Communication Technology"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Faculty</label>
                    <select
                      className="form-select"
                      value={formData.faculty}
                      onChange={(e) => handleChange('faculty', e.target.value)}
                    >
                      <option value="Faculty of Technology">Faculty of Technology (FT)</option>
                      <option value="Faculty of Applied Sciences">Faculty of Applied Sciences (FAS)</option>
                      <option value="Faculty of Engineering">Faculty of Engineering (FE)</option>
                      <option value="Faculty of Management & Commerce">Faculty of Management & Commerce (FMC)</option>
                      <option value="Faculty of Islamic Studies & Arabic Language">Faculty of Islamic Studies & Arabic (FIA)</option>
                      <option value="Faculty of Arts & Culture">Faculty of Arts & Culture (FAC)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Permanent / Temporary</label>
                    <select
                      className="form-select"
                      value={formData.employmentType}
                      onChange={(e) => handleChange('employmentType', e.target.value)}
                    >
                      <option value="Temporary (Student)">Temporary (Student)</option>
                      <option value="Permanent Staff">Permanent Staff</option>
                      <option value="Temporary Lecturer / Instructor">Temporary Lecturer / Instructor</option>
                      <option value="Visiting Lecturer">Visiting Lecturer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <BookOpen size={18} color="var(--primary-600)" />
                    <span>Email Specifications &amp; Notifications</span>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">
                      Preferred Email ID * <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>(if student, include the Stu.Reg.No. Ex:- 22ict085)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        className={`form-input ${validationErrors.preferredEmailPrefix ? 'is-invalid' : ''}`}
                        value={formData.preferredEmailPrefix}
                        onChange={(e) => handleChange('preferredEmailPrefix', e.target.value)}
                        placeholder="e.g. 22ict085"
                        style={{ maxWidth: '280px', fontWeight: 'bold' }}
                        required
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-700)' }}>@seu.ac.lk</span>
                    </div>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Purpose of the Email</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.emailPurpose}
                      onChange={(e) => handleChange('emailPurpose', e.target.value)}
                      placeholder="e.g. Academic coursework, LMS access, official correspondence"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp No. <i>(For Notification Purpose)</i> *</label>
                    <input
                      type="tel"
                      className={`form-input ${validationErrors.whatsappNo ? 'is-invalid' : ''}`}
                      value={formData.whatsappNo}
                      onChange={(e) => handleChange('whatsappNo', e.target.value)}
                      placeholder="+94 77 1234567"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Present E-Mail ID <i>(e.g. Gmail, Yahoo etc.)</i> *</label>
                    <input
                      type="email"
                      className={`form-input ${validationErrors.personalEmail ? 'is-invalid' : ''}`}
                      value={formData.personalEmail}
                      onChange={(e) => handleChange('personalEmail', e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==========================================================
              FORM 4: RE-SCRUTINIZATION OF MARKS & GRADES (IMAGE 3)
              ========================================================== */}
          {form.formId === 'SEU-EX-RESCRUTINY' && (
            <>
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <User size={18} color="var(--primary-600)" />
                    <span>Candidate Identity Details</span>
                  </div>
                  <span className="badge badge-warning">CC/No 078</span>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Salutation</label>
                    <select
                      className="form-select"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      style={{ maxWidth: '120px' }}
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                    </select>
                  </div>

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
                    <label className="form-label">Registration No (SEU/IS/...) *</label>
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
                    <label className="form-label">Examination Index No *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.indexNumber}
                      onChange={(e) => handleChange('indexNumber', e.target.value)}
                      placeholder="e.g. ICT22085"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject / Course Year</label>
                    <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
                      {['1st', '2nd', '3rd', '4th'].map(yr => (
                        <label key={yr} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="courseYear"
                            checked={formData.courseYear === yr}
                            onChange={() => handleChange('courseYear', yr)}
                          />
                          <span>{yr} Year</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <div style={{ display: 'flex', gap: '18px', marginTop: '6px' }}>
                      {['I', 'II'].map(sem => (
                        <label key={sem} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="semShort"
                            checked={formData.semShort === sem}
                            onChange={() => handleChange('semShort', sem)}
                          />
                          <span>Semester {sem}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Mobile Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <BookOpen size={18} color="var(--primary-600)" />
                    <span>Subject / Course Unit &amp; Payment Details</span>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Name &amp; Year of the Examination</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.examNameYear}
                      onChange={(e) => handleChange('examNameYear', e.target.value)}
                      placeholder="e.g. Third Year Examination in Technology - Semester I - 2025/2026"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject / Course Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                      value={formData.rescrutinyCode}
                      onChange={(e) => handleChange('rescrutinyCode', e.target.value)}
                      placeholder="e.g. ICT22011"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.rescrutinyTitle}
                      onChange={(e) => handleChange('rescrutinyTitle', e.target.value)}
                      placeholder="e.g. Web Application Development"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Grade Received *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '120px', textTransform: 'uppercase', fontWeight: 700 }}
                      value={formData.gradeReceived}
                      onChange={(e) => handleChange('gradeReceived', e.target.value)}
                      placeholder="e.g. C-"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amount Paid (Rs. 500 per course)</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '160px' }}
                      value={formData.amountPaid}
                      onChange={(e) => handleChange('amountPaid', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bank Receipt No *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.receiptNo}
                      onChange={(e) => handleChange('receiptNo', e.target.value)}
                      placeholder="e.g. PB-SEU-849201"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Attach Paid Bank Receipt Copy</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="file"
                        ref={receiptInputRef}
                        onChange={handleReceiptUpload}
                        style={{ display: 'none' }}
                        accept="image/*,.pdf"
                      />
                      <button
                        type="button"
                        onClick={() => receiptInputRef.current?.click()}
                        className="btn btn-secondary btn-sm"
                      >
                        <FileUp size={15} /> Choose Receipt File
                      </button>
                      {formData.receiptFileName && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                          ✓ {formData.receiptFileName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==========================================================
              FORM 5: PAY IN VOUCHER (SEU-PIV-VOUCHER)
              ========================================================== */}
          {form.formId === 'SEU-PIV-VOUCHER' && (
            <>
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <User size={18} color="var(--primary-600)" />
                    <span>1. Depositor &amp; Banking Details</span>
                  </div>
                  <span className="badge badge-info">People's Bank - Addalaichenai</span>
                </div>

                <div className="grid-2">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Depositor Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Registration Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ textTransform: 'uppercase', fontWeight: 600 }}
                      value={formData.registrationNumber}
                      onChange={(e) => handleChange('registrationNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course of Study / Degree Programme</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.pivCourse}
                      onChange={(e) => handleChange('pivCourse', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Mobile Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">University Bank Account</label>
                    <input
                      type="text"
                      className="form-input"
                      value="A/C: 228 1001 9000 1704 (Addalaichenai Branch)"
                      disabled
                      style={{ backgroundColor: 'var(--bg-surface-hover)', fontWeight: 600 }}
                    />
                  </div>
                </div>
              </div>

              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <BookOpen size={18} color="var(--primary-600)" />
                    <span>2. Fee Breakdown &amp; Remittance Amount</span>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Fee Purpose Category *</label>
                    <select
                      className="form-input"
                      value={formData.pivCategory}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('pivCategory', val);
                        handleChange('pivPurpose', val);
                      }}
                    >
                      <option value="Repeat Examination Fee">Examination Fee (Repeat / Resit)</option>
                      <option value="Registration Fee">Registration Fee / Renewal</option>
                      <option value="Medical Fee">Medical Endorsement Fee</option>
                      <option value="Convocation Fee">Convocation Fee</option>
                      <option value="Re-registration Fee">Re-registration Fee</option>
                      <option value="Re-scrutinization Fee">Re-scrutinization of Marks (Rs. 500)</option>
                      <option value="Other Fee">Other Miscellaneous University Fee</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amount in Figures (Rs.) *</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ fontWeight: 700, fontSize: '1.05rem' }}
                      value={formData.pivAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange('pivAmount', val);
                        handleChange('examFeesPaid', val);
                      }}
                      placeholder="e.g. 400"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Amount in Words *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.amountWords}
                      onChange={(e) => handleChange('amountWords', e.target.value)}
                      placeholder="e.g. Four Hundred Rupees Only"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Payment Remarks / Description</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.remarks}
                      onChange={(e) => handleChange('remarks', e.target.value)}
                      placeholder="e.g. Repeat exam payment for ICT21013, ICT21023 (Semester I)"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==========================================================
              SIGNATURE UPLOAD SECTION (MANDATORY ON ALL FORMS)
              ========================================================== */}
          <div className="seu-card" style={{ border: '2px dashed var(--primary-600)', backgroundColor: 'var(--bg-surface)' }}>
            <div className="seu-card-header">
              <div className="seu-card-title">
                <FileUp size={18} color="var(--primary-600)" />
                <span>Candidate / Applicant Official Signature</span>
              </div>
              <span className="badge badge-info">Signature Upload Option</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              Upload your signature image (PNG or JPG). It will be embedded directly onto the official document in the exact candidate signature box before downloading.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <input
                type="file"
                ref={signatureInputRef}
                onChange={handleSignatureUpload}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                style={{ display: 'none' }}
              />

              {!formData.signatureImage ? (
                <button
                  type="button"
                  onClick={() => signatureInputRef.current?.click()}
                  className="btn btn-primary"
                  style={{ gap: '8px' }}
                >
                  <UploadCloud size={16} /> Upload Signature Image
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{
                    padding: '8px 14px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <img
                      src={formData.signatureImage}
                      alt="Uploaded Signature"
                      style={{ maxHeight: '44px', maxWidth: '160px', objectFit: 'contain' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>
                      ✓ Signature Ready
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => signatureInputRef.current?.click()}
                    className="btn btn-secondary btn-sm"
                  >
                    Change Signature
                  </button>

                  <button
                    type="button"
                    onClick={removeSignature}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--danger)' }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              )}

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {!formData.signatureImage && (
                  <span><i>(If not uploaded, your digital student signature will be generated from your verified identity)</i></span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={15} color="var(--text-muted)" />
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Application Date:</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '160px', height: '36px' }}
                  value={formData.applicationDate}
                  onChange={(e) => handleChange('applicationDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
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
              <RotateCcw size={16} /> Reset Form Fields
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontWeight: 600 }}
            >
              <FileCheck size={16} /> Submit &amp; Generate Official Form
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Generated Official Document View */}
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
