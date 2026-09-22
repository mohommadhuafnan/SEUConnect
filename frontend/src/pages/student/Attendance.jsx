import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card, StatCard } from '../../components/StatCard';
import { ClipboardCheck, CheckCircle2, XCircle, AlertTriangle, FileText, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentAttendance = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await studentService.getAttendance();
        if (res.success) {
          setAttendance(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Calculating institutional attendance records...</div>;
  }

  const { overallPercentage, minThreshold, isOverallEligible, totalSessions, totalAttended, subjects } = attendance || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Attendance &amp; Examination Eligibility</h1>
        <p>Real-time attendance tracking across scheduled theory and practical sessions for End Semester Examination (ESA) qualification.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid-3">
        <StatCard
          title="Overall Attendance"
          value={`${overallPercentage || 0}%`}
          subtext={`${totalAttended || 0} of ${totalSessions || 0} sessions attended`}
          icon={ClipboardCheck}
          color={isOverallEligible ? 'success' : 'danger'}
          badgeText={isOverallEligible ? 'Eligible for ESA' : 'Ineligible'}
        />
        <StatCard
          title="Mandatory ESA Threshold"
          value={`${minThreshold || 80}%`}
          subtext="Faculty Handbook Regulation"
          icon={AlertTriangle}
          color="accent"
          badgeText="Minimum Req"
        />
        <StatCard
          title="Exam Standing Status"
          value={isOverallEligible ? 'Satisfied' : 'Action Required'}
          subtext={isOverallEligible ? 'Admission card clearance granted' : 'Submit medical certificate'}
          icon={isOverallEligible ? CheckCircle2 : XCircle}
          color={isOverallEligible ? 'success' : 'danger'}
          badgeText="Official Status"
        />
      </div>

      {/* Attendance Policy Banner */}
      <div className="seu-card" style={{ backgroundColor: 'var(--bg-surface-hover)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Info size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
            <strong>Faculty of Technology Examination Regulation:</strong> Under Section 8.3 of the Technology Faculty Handbook, an undergraduate candidate must secure not less than <strong>80% attendance</strong> in both theory lectures and laboratory practical sessions. Students with attendance between 60% and 79% may apply for special consideration by submitting an endorsed medical certificate within 7 working days.
          </div>
        </div>
      </div>

      {/* Course Breakdown Table */}
      <Card
        title="Subject-wise Attendance & Eligibility"
        action={
          <button onClick={() => navigate('/student/medical')} className="btn btn-primary btn-sm">
            <FileText size={14} /> Submit Medical Excuse
          </button>
        }
      >
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Course Title</th>
                <th>Theory Attendance</th>
                <th>Practical Attendance</th>
                <th>Total Attended</th>
                <th>Attendance %</th>
                <th>ESA Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {subjects?.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No attendance sessions recorded yet.
                  </td>
                </tr>
              ) : (
                subjects?.map(sub => (
                  <tr key={sub.subjectId}>
                    <td><strong>{sub.code}</strong></td>
                    <td>{sub.title}</td>
                    <td>
                      {sub.theoryTotal > 0 ? (
                        <span>{sub.theoryAttended} / {sub.theoryTotal} ({Math.round((sub.theoryAttended / sub.theoryTotal) * 100)}%)</span>
                      ) : 'N/A'}
                    </td>
                    <td>
                      {sub.practicalTotal > 0 ? (
                        <span>{sub.practicalAttended} / {sub.practicalTotal} ({Math.round((sub.practicalAttended / sub.practicalTotal) * 100)}%)</span>
                      ) : 'N/A'}
                    </td>
                    <td>{sub.attendedSessions} / {sub.totalSessions}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '60px',
                          height: '8px',
                          backgroundColor: 'var(--border-color)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${sub.percentage}%`,
                            height: '100%',
                            backgroundColor: sub.isEligible ? '#10b981' : '#ef4444'
                          }} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{sub.percentage}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${sub.isEligible ? 'badge-success' : 'badge-danger'}`}>
                        {sub.isEligible ? 'Eligible' : 'Ineligible (< 80%)'}
                      </span>
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

export default StudentAttendance;
