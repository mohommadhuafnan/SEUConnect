import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lecturerService from '../../services/lecturerService';
import { Card, StatCard } from '../../components/StatCard';
import { BookOpen, Users, ClipboardList, CheckSquare, Award, ArrowRight, Clock } from 'lucide-react';

export const LecturerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await lecturerService.getDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading lecturer instructional profile...</div>;
  }

  const { lecturer, metrics, courses } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Lecturer Welcome Header */}
      <div className="seu-card" style={{
        background: 'linear-gradient(135deg, #0b1f3a 0%, #163e75 100%)',
        color: '#ffffff',
        border: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{
              backgroundColor: 'rgba(217, 119, 6, 0.25)',
              border: '1px solid rgba(217, 119, 6, 0.6)',
              color: '#fbbf24',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              South Eastern University of Sri Lanka · Faculty of Technology
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '8px', color: '#ffffff' }}>
              Good Morning, {lecturer?.name}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '6px', fontSize: '0.86rem', color: '#cbd5e1' }}>
              <div>Staff ID: <strong>{lecturer?.staffId}</strong></div>
              <div>•</div>
              <div>Designation: <strong>{lecturer?.designation}</strong></div>
              <div>•</div>
              <div>Department: <strong>{lecturer?.department}</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/lecturer/attendance')} className="btn btn-primary btn-sm" style={{ backgroundColor: '#2563eb' }}>
              <ClipboardList size={16} /> Mark Attendance
            </button>
            <button onClick={() => navigate('/lecturer/ca-marks')} className="btn btn-sm" style={{ backgroundColor: '#d97706', color: '#fff' }}>
              <CheckSquare size={16} /> Upload CA Marks
            </button>
          </div>
        </div>
      </div>

      {/* Lecturer Top Cards */}
      <div className="grid-4">
        <StatCard
          title="Assigned Courses"
          value={metrics?.assignedCoursesCount || 0}
          subtext="Undergraduate modules"
          icon={BookOpen}
          color="primary"
          badgeText="Active Term"
        />
        <StatCard
          title="Enrolled Students"
          value={metrics?.totalEnrolledStudents || 0}
          subtext="Across all course sections"
          icon={Users}
          color="accent"
          badgeText="BICT Batch"
        />
        <StatCard
          title="Pending Attendance"
          value={metrics?.attendancePendingCount || 0}
          subtext="Sessions due this week"
          icon={ClipboardList}
          color="warning"
          badgeText="Action"
        />
        <StatCard
          title="CA Marks Pending"
          value={metrics?.caPendingCount || 0}
          subtext="Before Faculty Board"
          icon={CheckSquare}
          color={metrics?.caPendingCount > 0 ? 'warning' : 'success'}
          badgeText="Grading"
        />
      </div>

      {/* Assigned Courses Roster */}
      <Card title="My Assigned Modules (Semester 5)">
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Semester</th>
                <th>Students</th>
                <th>Attendance Status</th>
                <th>CA Marks</th>
                <th>ESA Marks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.code}</strong></td>
                  <td>{c.title}</td>
                  <td><span className="badge badge-neutral">{c.credits} Credits</span></td>
                  <td>Semester {c.semester}</td>
                  <td><strong>{c.studentCount} Students</strong></td>
                  <td><span className="badge badge-success">{c.attendanceStatus}</span></td>
                  <td><span className="badge badge-info">{c.caStatus}</span></td>
                  <td><span className="badge badge-warning">{c.esaStatus}</span></td>
                  <td>
                    <button
                      onClick={() => navigate(`/lecturer/courses/${c.id}`)}
                      className="btn btn-secondary btn-sm"
                    >
                      Manage <ArrowRight size={14} />
                    </button>
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

export default LecturerDashboard;
