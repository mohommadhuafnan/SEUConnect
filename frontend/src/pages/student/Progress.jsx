import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card, StatCard } from '../../components/StatCard';
import { TrendingUp, Award, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

export const StudentProgress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await studentService.getProgress();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Calculating degree milestones...</div>;
  }

  const { student, cgpa, estimatedClass, progress, graduationRequirements } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Academic Progression &amp; Degree Audit</h1>
        <p>Progress tracking towards degree completion requirements for Bachelor of Information and Communication Technology (BICT Hons).</p>
      </div>

      <div className="grid-3">
        <StatCard
          title="Degree Completion Rate"
          value={`${progress?.percentage || 0}%`}
          subtext={`${progress?.completed || 0} / ${progress?.required || 130} Credits Earned`}
          icon={TrendingUp}
          color="success"
          badgeText="Degree Audit"
        />
        <StatCard
          title="Cumulative CGPA"
          value={cgpa?.toFixed(2) || '0.00'}
          subtext={`Graduation Class: ${estimatedClass}`}
          icon={Award}
          color="accent"
          badgeText="Standing"
        />
        <StatCard
          title="Remaining Credit Load"
          value={`${progress?.remaining || 0} Credits`}
          subtext="Semesters 6, 7 & 8"
          icon={BookOpen}
          color="primary"
          badgeText="To Graduate"
        />
      </div>

      {/* Progress Bar Display */}
      <div className="seu-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
          <span>Overall Degree Progress ({student?.degreeProgramme} - {progress?.required} Total Credits)</span>
          <span style={{ color: '#10b981' }}>{progress?.percentage}% Completed</span>
        </div>
        <div style={{ width: '100%', height: '14px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ width: `${progress?.percentage}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Year 1 (Completed)</span>
          <span>Year 2 (Completed)</span>
          <span>Year 3 (In Progress)</span>
          <span>Year 4 (Upcoming)</span>
        </div>
      </div>

      {/* Graduation Requirements Checklist */}
      <Card title="Institutional Graduation Checklist">
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Requirement Metric</th>
                <th>Prescribed Target</th>
                <th>Candidate Status</th>
                <th>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              {graduationRequirements?.map((req, i) => (
                <tr key={i}>
                  <td><strong>{req.title}</strong></td>
                  <td>{req.target}</td>
                  <td>{req.current}</td>
                  <td>
                    <span className={`badge ${
                      req.status === 'Completed' || req.status === 'Satisfied' ? 'badge-success' :
                      req.status === 'In Progress' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentProgress;
