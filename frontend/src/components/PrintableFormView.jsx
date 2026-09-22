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
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';

export const PrintableFormView = ({ form, student, onBack }) => {
  const signatureInputRef = useRef(null);
  const receiptInputRef = useRef(null);

  const defaultFormData = {
    // Basic Details
    title: 'Mr.',
    name: student?.name || '',
    firstName: student?.name?.split(' ').slice(0, -1).join(' ') || student?.name || '',
    lastName: student?.name?.split(' ').slice(-1)[0] || '',
    registrationNumber: student?.registrationNumber || '22ICT085',
    indexNumber: student?.indexNumber || 'ICT22085',
    designation: 'Student - ' + (student?.registrationNumber || '22ICT085'),
    department: student?.department || 'Department of Information and Communication Technology (DICT)',
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

    // Form: Repeat Exam CA (SEU-EX-CA-REP)
    appliedSubjects: [
      { code: 'ICT22011', title: 'Web Application Development' }
    ],

    // Form: Re-scrutinization (SEU-EX-RESCRUTINY)
    examNameYear: 'Third Year Examination in Technology - Semester I - 2025/2026',
    rescrutinyCode: 'ICT22011',
    rescrutinyTitle: 'Web Application Development',
    gradeReceived: 'C-',
    amountPaid: '500',
    receiptNo: 'PB-SEU-849201',

    // Form: Medical (SEU-MED-ABSENT / SEU-ICT-MED-LEC)
    leaveFrom: '',
    leaveTo: '',
    medicalOfficer: 'University Medical Officer, Health Centre, SEUSL',
    medicalReason: 'Viral Illness / Hospitalized Care',
    medicalRows: [
      { date: new Date().toISOString().split('T')[0], code: 'ICT22011' }
    ],

    // Form: PIV (SEU-PIV-VOUCHER)
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
  const [activeTab, setActiveTab] = useState('fill');
  const [refNumber, setRefNumber] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Signature Upload
  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, JPEG).');
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

  // Receipt Upload
  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receiptFileName: file.name
      }));
    }
  };

  // Applied Subjects table helpers
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

  // Medical Row helpers
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
    if (signatureInputRef.current) signatureInputRef.current.value = '';
    if (receiptInputRef.current) receiptInputRef.current.value = '';
  };

  // Validation & Submit
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const errors = {};

    if (!formData.name?.trim()) errors.name = 'Full name is required.';
    if (!formData.registrationNumber?.trim()) errors.registrationNumber = 'Registration number is required.';

    if (form.formId === 'SEU-EMAIL-REQ') {
      if (!formData.preferredEmailPrefix?.trim()) errors.preferredEmailPrefix = 'Preferred Email ID prefix is required.';
      if (!formData.whatsappNo?.trim()) errors.whatsappNo = 'WhatsApp number is required for notification.';
      if (!formData.personalEmail?.trim()) errors.personalEmail = 'Present personal email ID is required.';
    }

    if (form.formId === 'SEU-EX-RESCRUTINY') {
      if (!formData.rescrutinyCode?.trim()) errors.rescrutinyCode = 'Subject / Course code is required.';
      if (!formData.gradeReceived?.trim()) errors.gradeReceived = 'Grade received is required.';
      if (!formData.receiptNo?.trim()) errors.receiptNo = 'Payment receipt number is required.';
    }

    if (form.formId === 'SEU-EX-CA-REP') {
      const emptySubs = formData.appliedSubjects.some(s => !s.code.trim() || !s.title.trim());
      if (emptySubs) errors.subjects = 'Please provide both Code and Title for all applied subjects.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const generatedRef = `SEU/FT/${new Date().getFullYear()}/${form.formId.replace('SEU-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRefNumber(generatedRef);
    setValidationErrors({});
    setIsSubmitted(true);
    setActiveTab('preview');
  };

  const handlePrint = () => {
    window.print();
  };

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

  // Render Exact Form Document
  const renderOfficialDocument = () => {
    switch (form.formId) {
      /* =========================================================================
         FORM 1: OFFICIAL EMAIL REQUEST FORM (IMAGE 1)
         ========================================================================= */
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

      /* =========================================================================
         FORM 2: RE-SCRUTINIZATION OF MARKS & GRADES (IMAGE 3)
         ========================================================================= */
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

      /* =========================================================================
         FORM 3: REPEAT EXAM CA (IMAGE 2)
         ========================================================================= */
      case 'SEU-EX-CA-REP':
      default:
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
              <div>
                01. Name with initials: <strong>{formData.title} {formData.name.toUpperCase()}</strong>
              </div>
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '36px' }}>
                <div>Date: <strong>{formData.applicationDate}</strong></div>
                <div style={{ textAlign: 'center' }}>
                  {renderDocumentSignature()}
                  <div style={{ borderTop: '1px solid #000', paddingTop: '3px', fontSize: '0.8rem', marginTop: '4px' }}>
                    Signature of Candidate
                  </div>
                </div>
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
          <ArrowLeft size={16} /> Back to Form Catalog
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
            title="Clear and reset form"
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
                {form.name} — Verified &amp; Signed Successfully!
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
              FORM 1: OFFICIAL EMAIL REQUEST FORM (IMAGE 1)
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
              FORM 2: RE-SCRUTINIZATION OF MARKS & GRADES (IMAGE 3)
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
                    <label className="form-label">Faculty</label>
                    <input
                      type="text"
                      className="form-input"
                      value="Faculty of Technology (FT)"
                      disabled
                      style={{ backgroundColor: 'var(--bg-surface-hover)' }}
                    />
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

                  {/* Bank Receipt File Upload Option */}
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
              FORM 3: REPEAT EXAM CA (IMAGE 2)
              ========================================================== */}
          {form.formId === 'SEU-EX-CA-REP' && (
            <>
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <User size={18} color="var(--primary-600)" />
                    <span>Part I: Candidate Information</span>
                  </div>
                  <span className="badge badge-info">Repeat Candidate</span>
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
                    <label className="form-label">01. Name with initials *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. M.N.M. Afnan"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">02. Registration No (SEU/IS/...) *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.registrationNumber}
                      onChange={(e) => handleChange('registrationNumber', e.target.value)}
                      placeholder="e.g. 22ICT085"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">03. Current Academic Year</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.academicYear}
                      onChange={(e) => handleChange('academicYear', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">04. Faculty</label>
                    <input
                      type="text"
                      className="form-input"
                      value="Faculty of Technology (FT)"
                      disabled
                      style={{ backgroundColor: 'var(--bg-surface-hover)' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">05. Semester</label>
                    <select
                      className="form-select"
                      value={formData.semester}
                      onChange={(e) => handleChange('semester', e.target.value)}
                    >
                      <option value="Semester I">Semester I</option>
                      <option value="Semester II">Semester II</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">06. Year of Examination</label>
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
                    <label className="form-label">07. Field of Specialization</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.specialization}
                      onChange={(e) => handleChange('specialization', e.target.value)}
                      placeholder="e.g. Software Systems"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">08. Present Address</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Hostel / Residence address"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">09. Contact Mobile No *</label>
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

              {/* Section 10: Applied Subjects */}
              <div className="seu-card">
                <div className="seu-card-header">
                  <div className="seu-card-title">
                    <BookOpen size={18} color="var(--primary-600)" />
                    <span>10. Applied Repeat Continuous Assessment Subjects</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="btn btn-secondary btn-sm"
                  >
                    <Plus size={14} /> Add Subject Row
                  </button>
                </div>

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
                        0{idx + 1}
                      </span>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '150px', textTransform: 'uppercase', fontWeight: 700 }}
                        placeholder="Subject Code"
                        value={sub.code}
                        onChange={(e) => handleSubjectChange(idx, 'code', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-input"
                        style={{ flex: 1, minWidth: '200px' }}
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
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
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
              Upload your official signature image (PNG or JPG). It will be embedded directly onto the official document in the exact candidate signature box before downloading.
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
                  <UploadCloud size={16} /> Upload Signature File
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
                  <span><i>(If you do not upload an image, your digital student signature will be generated from your verified identity)</i></span>
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
