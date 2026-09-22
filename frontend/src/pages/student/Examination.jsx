import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card, StatCard } from '../../components/StatCard';
import { Award, AlertTriangle, CheckCircle2, FileText, Download, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentExamination = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await studentService.getExaminations();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading examination standing...</div>;
  }

  const { overallAttendance, minThreshold, isOverallEligible, currentSemesterSubjects, attempts } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Examination Portal &amp; Admission Card</h1>
        <p>End Semester Examination (ESA) entry validation, repeat tracking, and admission card status.</p>
      </div>

      <div className="grid-3">
        <StatCard
          title="Overall Attendance Standing"
          value={`${overallAttendance || 0}%`}
          subtext={`Threshold: ${minThreshold || 80}%`}
          icon={isOverallEligible ? CheckCircle2 : AlertTriangle}
          color={isOverallEligible ? 'success' : 'danger'}
          badgeText={isOverallEligible ? 'Eligible' : 'Ineligible'}
        />
        <StatCard
          title="Admission Card Status"
          value={isOverallEligible ? 'Ready for Download' : 'Blocked (Attendance)'}
          subtext="Faculty Examination Division"
          icon={Award}
          color={isOverallEligible ? 'success' : 'danger'}
          badgeText="Semester 5"
        />
        <StatCard
          title="Registered Exam Modules"
          value={`${currentSemesterSubjects?.length || 0} Modules`}
          subtext="Regular First Attempts"
          icon={FileText}
          color="primary"
          badgeText="Active"
        />
      </div>

      {/* Repeat Candidates Notice & Direct Form Links */}
      <div className="seu-card" style={{ borderLeft: '4px solid #d97706', backgroundColor: '#fffbeb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#92400e' }}>
              Repeat Candidates &amp; Resit Registration Notice
            </div>
            <div style={{ fontSize: '0.84rem', color: '#b45309', marginTop: '2px' }}>
              Students resitting Continuous Assessment (CA) or End Semester Examinations (ESA) must complete the official paper application form and attach the People's Bank PIV voucher before the closing date.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('/student/forms/SEU-EX-CA-REP')} className="btn btn-sm" style={{ backgroundColor: '#d97706', color: '#fff' }}>
              CA Repeat Form
            </button>
            <button onClick={() => navigate('/student/forms/SEU-EX-ESA-REP')} className="btn btn-sm btn-secondary">
              ESA Repeat Form
            </button>
          </div>
        </div>
      </div>

      {/* Module Eligibility Table */}
      <Card title="Current Semester Examination Enrollment &amp; Eligibility">
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Attendance %</th>
                <th>Eligibility Status</th>
                <th>Attempt Category</th>
              </tr>
            </thead>
            <tbody>
              {currentSemesterSubjects?.map(item => (
                <tr key={item.subject?._id}>
                  <td><strong>{item.subject?.code}</strong></td>
                  <td>{item.subject?.title}</td>
                  <td>{item.subject?.credits} Credits</td>
                  <td>{item.attendancePercentage}%</td>
                  <td>
                    <span className={`badge ${item.eligibility === 'Eligible' ? 'badge-success' : 'badge-danger'}`}>
                      {item.eligibility}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{item.attemptType || 'Regular (1st Attempt)'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Admission Card Preview & Download */}
      {isOverallEligible && (
        <Card title="Institutional Examination Admission Card">
          <div style={{
            border: '2px solid var(--border-color)',
            borderRadius: '8px',
            padding: '24px',
            backgroundColor: 'var(--bg-surface-hover)'
          }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>SOUTH EASTERN UNIVERSITY OF SRI LANKA</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>FACULTY OF TECHNOLOGY · EXAMINATION ADMISSION CARD</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-700)', marginTop: '4px' }}>
                Academic Year 2025/2026 — Semester 1 Examination
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
              <div>Candidate Name: <strong>M.N.M. Afnan</strong></div>
              <div>Registration No: <strong>22ICT085</strong></div>
              <div>Index No: <strong>ICT22085</strong></div>
              <div>Programme: <strong>BICT (Hons)</strong></div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                <Printer size={14} /> Print Admission Card
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentExamination;
