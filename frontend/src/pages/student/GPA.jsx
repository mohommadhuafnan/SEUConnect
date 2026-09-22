import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card, StatCard } from '../../components/StatCard';
import { GraduationCap, Award, Printer, CheckCircle, TrendingUp } from 'lucide-react';

export const StudentGPA = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSemIndex, setActiveSemIndex] = useState(0);

  useEffect(() => {
    const fetchGPA = async () => {
      try {
        const res = await studentService.getGPAData();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGPA();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Calculating academic GPA records...</div>;
  }

  const { studentInfo, cgpa, estimatedClass, progress, semesterReports } = data || {};
  const currentReport = semesterReports && semesterReports[activeSemIndex] ? semesterReports[activeSemIndex] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Academic Performance &amp; GPA Report</h1>
          <p>Credit-weighted SGPA and CGPA computation following South Eastern University of Sri Lanka Technology Faculty regulations.</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-primary btn-sm">
          <Printer size={15} /> Print Official GPA Report
        </button>
      </div>

      {/* Official Academic Performance Report Card */}
      <div className="seu-card printable-document" style={{
        backgroundColor: 'var(--bg-surface)',
        border: '2px solid var(--border-color)',
        borderRadius: '12px',
        padding: '28px'
      }}>
        <div style={{ borderBottom: '2px solid var(--primary-800)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-700)' }}>
                SOUTH EASTERN UNIVERSITY OF SRI LANKA · FACULTY OF TECHNOLOGY
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                ACADEMIC PERFORMANCE REPORT
              </h2>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div>Academic Session: <strong>{studentInfo?.academicYear || '2025/2026'}</strong></div>
              <div>Issue Date: <strong>{new Date().toLocaleDateString()}</strong></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px', fontSize: '0.88rem' }}>
            <div>Student Name: <strong>{studentInfo?.name}</strong></div>
            <div>Registration No: <strong>{studentInfo?.registrationNumber}</strong></div>
            <div>Index No: <strong>{studentInfo?.indexNumber}</strong></div>
            <div>Degree Programme: <strong>{studentInfo?.degreeProgramme} (Hons)</strong></div>
            <div>Specialization: <strong>{studentInfo?.specialization}</strong></div>
          </div>
        </div>

        {/* Highlight Score Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          backgroundColor: 'var(--bg-surface-hover)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Semester SGPA</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              {currentReport?.sgpa?.toFixed(2) || '3.42'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sem 0{currentReport?.semester || 5} Performance</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cumulative CGPA</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>
              {cgpa?.toFixed(2) || '3.38'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across all semesters</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Degree Class</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', marginTop: '6px' }}>
              {estimatedClass}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on university cutoffs</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Degree Completion</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-600)', marginTop: '6px' }}>
              {progress?.percentage || 60}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{progress?.completed || 78} / {progress?.required || 130} Credits</div>
          </div>
        </div>

        {/* Semester Selector Tabs */}
        <div className="no-print" style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {semesterReports?.map((sem, idx) => (
            <button
              key={sem.semester}
              onClick={() => setActiveSemIndex(idx)}
              className={`btn btn-sm ${activeSemIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flexShrink: 0 }}
            >
              Semester 0{sem.semester} (SGPA: {sem.sgpa.toFixed(2)})
            </button>
          ))}
        </div>

        {/* Course Rows Table */}
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>CA Mark</th>
                <th>ESA Mark</th>
                <th>Final Mark</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Quality Points (Cr × GP)</th>
              </tr>
            </thead>
            <tbody>
              {currentReport?.courses?.map((c, i) => (
                <tr key={i}>
                  <td><strong>{c.code}</strong></td>
                  <td>{c.title}</td>
                  <td>{c.credits}</td>
                  <td>{c.caMark}</td>
                  <td>{c.esaMark > 0 ? c.esaMark : '—'}</td>
                  <td>{c.finalMark > 0 ? c.finalMark : '—'}</td>
                  <td>
                    <span className="badge badge-info">{c.grade}</span>
                  </td>
                  <td>{c.gradePoint?.toFixed(2)}</td>
                  <td><strong>{c.qualityPoints?.toFixed(2)}</strong></td>
                </tr>
              ))}
              <tr style={{ backgroundColor: 'var(--bg-surface-hover)', fontWeight: 'bold' }}>
                <td colSpan="2" style={{ textAlign: 'right' }}>Semester Total:</td>
                <td>{currentReport?.totalCredits} Credits</td>
                <td colSpan="5" style={{ textAlign: 'right' }}>Semester GPA (SGPA):</td>
                <td style={{ color: 'var(--primary-700)' }}>{currentReport?.sgpa?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Regulation Footer Note */}
        <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <strong>GPA Calculation Regulation:</strong> SGPA = Σ(Credit × Grade Point) / Σ(Credit). Degree class determination criteria: First Class (CGPA ≥ 3.70, no repeats), Second Class Upper (CGPA ≥ 3.30), Second Class Lower (CGPA ≥ 3.00), Pass (CGPA ≥ 2.00). This transcript is generated internally by SEUConnect.
        </div>
      </div>
    </div>
  );
};

export default StudentGPA;
