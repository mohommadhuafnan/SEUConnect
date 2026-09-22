import React from 'react';
import { Printer, ArrowLeft, Download } from 'lucide-react';

export const PrintableFormView = ({ form, student, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const renderFormContent = () => {
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
                <span style={{ fontSize: '0.7rem', color: '#666' }}>Ref: SEU/EX/CA-REP</span>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
              <div><strong>PART - I</strong></div>
              <div>01. Name with initials: <strong>{student?.name || 'Mr./Ms. ................................................................'}</strong></div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div>02. Registration No: <strong>{student?.registrationNumber || 'SEU/IS/........................'}</strong></div>
                <div>03. Current Academic Year: <strong>{student?.academicYear || '2025/2026'}</strong></div>
              </div>
              <div style={{ display: 'flex', gap: '30px', margin: '6px 0' }}>
                <div>04. Faculty: [✓] FT (Faculty of Technology)</div>
                <div>05. Semester: [✓] Semester {student?.currentSemester % 2 === 0 ? 'II' : 'I'}</div>
                <div>06. Year of Examination: Third Year</div>
              </div>
              <div>07. Field of Specialization (if any): <strong>{student?.specialization || 'Software Systems'}</strong></div>
              <div>08. Present Address: <strong>{student?.address || 'Faculty of Technology Hostel, SEUSL, Oluvil'}</strong></div>
              <div>09. Contact Mobile No: <strong>{student?.phone || '077xxxxxxx'}</strong></div>

              <div style={{ marginTop: '14px' }}>
                <strong>10. Applied subjects:</strong>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ border: '1px solid #000', background: '#f0f0f0' }}>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>SNo.</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>Subject Code (Specify Clearly)</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>Subject Title</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>Signature of Head of Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <tr key={num} style={{ border: '1px solid #000', height: '28px' }}>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>0{num}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px' }}>{num === 1 ? 'ICT22011' : ''}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 8px' }}>{num === 1 ? 'Web Application Development' : ''}</td>
                        <td style={{ border: '1px solid #000' }}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <div>Date: ........................</div>
                <div>Signature of Candidate: ........................................</div>
              </div>

              <div style={{ marginTop: '24px', borderTop: '1px dashed #000', paddingTop: '10px' }}>
                <strong>Part - II</strong>
                <p>Particulars from 01 - 10 are checked with me and found correct.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                  <div>Signature of Subject in charge: ..................................</div>
                  <div>Assistant Registrar: ........................................</div>
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
              <h4>ABSENT BY MEDICAL</h4>
            </div>

            <div style={{ fontSize: '0.9rem', lineHeight: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Name of the Student: <strong>{student?.name || '...................................................'}</strong></div>
                <div>ACADEMIC YEAR: <strong>{student?.academicYear || '2025/2026'}</strong></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Registration Number: <strong>{student?.registrationNumber || '.....................................'}</strong></div>
                <div>Contact Number: <strong>{student?.phone || '.....................................'}</strong></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Medical Submission Date: <strong>{new Date().toLocaleDateString()}</strong></div>
                <div>Medical Leave From: <strong>.......................</strong> To: <strong>.......................</strong></div>
              </div>
              <div>Specialization: <strong>{student?.specialization || 'Software Systems'}</strong></div>

              <div style={{ marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ border: '1px solid #000', background: '#f5f5f5' }}>
                      <th style={{ border: '1px solid #000', padding: '8px', width: '140px' }}>Absent Date</th>
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <th key={i} style={{ border: '1px solid #000', padding: '8px' }}>Subject Code</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7].map(r => (
                      <tr key={r} style={{ border: '1px solid #000', height: '26px' }}>
                        <td style={{ border: '1px solid #000' }}></td>
                        {[1, 2, 3, 4, 5, 6].map(c => (
                          <td key={c} style={{ border: '1px solid #000' }}></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <div>Head of the Dept: ............................................</div>
                <div>Student's Signature: ............................................</div>
              </div>
            </div>
          </div>
        );

      case 'SEU-PIV-VOUCHER':
        return (
          <div className="printable-document" style={{ border: '2px dashed #000', maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ border: '2px solid #000', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>SOUTH EASTERN UNIVERSITY OF SRI LANKA</h2>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>PAY IN VOUCHER (PIV)</h3>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginTop: '4px' }}>BURSAR'S DEPT / CUSTOMER COPY</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.78rem' }}>
                  <div><strong>Manager, People's Bank</strong></div>
                  <div>The fee should be paid in any branch of People's Bank by cash to the credit of:</div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>South Eastern University of Sri Lanka (SEUSL)</div>
                  <div style={{ backgroundColor: '#000', color: '#fff', padding: '2px 6px', display: 'inline-block', marginTop: '2px' }}>
                    A/C No. 228 1001 9000 1704 People's Bank, Addalaichenai
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', marginTop: '12px', fontSize: '0.85rem' }}>
                <div style={{ lineHeight: 1.9 }}>
                  <div>Name: <strong>{student?.name || '.........................................................................'}</strong></div>
                  <div>Address: <strong>{student?.address || '......................................................................'}</strong></div>
                  <div>Registration No: <strong>{student?.registrationNumber || '...................................................'}</strong></div>
                  <div>Course of Study: <strong>{student?.degreeProgramme || 'BICT (Faculty of Technology)'}</strong></div>
                  <div>Amount in words: .....................................................................</div>
                  <div style={{ marginTop: '12px' }}>Signature: ......................................................................</div>
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
                      {['1 Registration Fee', '2 Examination Fee', '3 Convocation Fee', '4 Re-registration Fee', '5 Medical Fee'].map((item, idx) => (
                        <tr key={idx} style={{ border: '1px solid #000', height: '22px' }}>
                          <td style={{ border: '1px solid #000', padding: '3px 6px' }}>{item}</td>
                          <td style={{ border: '1px solid #000', textAlign: 'right', paddingRight: '4px' }}>{idx === 1 ? '500' : ''}</td>
                          <td style={{ border: '1px solid #000', textAlign: 'center' }}>{idx === 1 ? '00' : ''}</td>
                        </tr>
                      ))}
                      <tr style={{ border: '2px solid #000', fontWeight: 'bold' }}>
                        <td style={{ border: '1px solid #000', padding: '4px 6px' }}>Total</td>
                        <td style={{ border: '1px solid #000', textAlign: 'right', paddingRight: '4px' }}>500</td>
                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>00</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ marginTop: '10px', fontSize: '0.75rem', border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                    Received by cash Rs. 500/= to credit of SEUSL A/C 228100190001704<br /><br />
                    Signature &amp; Seal of Manager / Teller
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
                <div>Name of the Student: <strong>{student?.name || '...................................................'}</strong></div>
                <div>Admission Year: <strong>2022/2023</strong></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Year: <strong>3rd Year</strong> · Semester: <strong>Semester {student?.currentSemester || 5}</strong></div>
                <div>Contact Number: <strong>{student?.phone || '077xxxxxxx'}</strong></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Medical Submission Date: <strong>{new Date().toLocaleDateString()}</strong></div>
                <div>Specialization: <strong>{student?.specialization || 'Software Systems'}</strong></div>
              </div>
              <div>Medical Leave: From <strong>................................</strong> To <strong>................................</strong></div>

              <div style={{ marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ border: '1px solid #000', background: '#f5f5f5' }}>
                      <th style={{ border: '1px solid #000', padding: '6px', width: '130px' }}>Date \ Sub.Code</th>
                      {['ICT22011', 'ICT22043', 'ICT31013', 'ICT31023', 'ICT31032', 'ICT31043'].map(c => (
                        <th key={c} style={{ border: '1px solid #000', padding: '6px' }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7].map(r => (
                      <tr key={r} style={{ border: '1px solid #000', height: '26px' }}>
                        <td style={{ border: '1px solid #000' }}></td>
                        {[1, 2, 3, 4, 5, 6].map(c => (
                          <td key={c} style={{ border: '1px solid #000' }}></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <div>Signature of the Department Head: ......................................</div>
                <div>Student Signature: ......................................</div>
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
            <div style={{ padding: '20px', lineHeight: 1.8 }}>
              <p><strong>Form ID:</strong> {form.formId}</p>
              <p><strong>Description:</strong> {form.description}</p>
              <p><strong>Submission Office:</strong> {form.submissionLocation}</p>
              <p><strong>Required Documents:</strong> {form.requiredDocuments?.join(', ')}</p>
              <p><strong>Instructions:</strong></p>
              <ul>
                {form.instructions?.map((inst, i) => <li key={i}>{inst}</li>)}
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Forms
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} /> Print / Save as Official PDF
          </button>
        </div>
      </div>

      {renderFormContent()}
    </div>
  );
};

export default PrintableFormView;
