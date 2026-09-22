import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lecturerService from '../../services/lecturerService';
import { Card } from '../../components/StatCard';
import { BookOpen, Users, ArrowLeft, CheckCircle2, Award, ClipboardCheck } from 'lucide-react';

export const LecturerCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await lecturerService.getCourses();
        if (res.success) setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Assigned Department Courses</h1>
        <p>Modules assigned by the Head of Department for teaching, continuous assessments, and grading.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading assigned courses...
          </div>
        ) : courses.map(course => (
          <div key={course._id} className="seu-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-info">{course.code}</span>
                <span className="badge badge-neutral">{course.credits} Credits</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                {course.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Semester {course.semester} · {course.degreeProgramme} · {course.theoryHours}h Lecture / {course.practicalHours}h Practical
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <button
                onClick={() => navigate(`/lecturer/courses/${course._id}`)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                Course Details &amp; Students
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LecturerCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await lecturerService.getCourseStudents(id);
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading course students roster...</div>;
  }

  const { course, students } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button onClick={() => navigate('/lecturer/courses')} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
        <ArrowLeft size={14} /> Back to Courses
      </button>

      <div className="seu-card" style={{ borderLeft: '4px solid var(--primary-700)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <span className="badge badge-info">{course?.code}</span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '6px' }}>{course?.title}</h1>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Semester {course?.semester} · {course?.credits} Credits · {students?.length || 0} Registered Undergraduates
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button onClick={() => navigate('/lecturer/attendance')} className="btn btn-secondary btn-sm">
              <ClipboardCheck size={14} /> Mark Attendance
            </button>
            <button onClick={() => navigate('/lecturer/ca-marks')} className="btn btn-primary btn-sm">
              <Award size={14} /> Enter CA Marks
            </button>
          </div>
        </div>
      </div>

      <Card title={`Enrolled Student Roster (${students?.length || 0} Students)`}>
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Registration No</th>
                <th>Index No</th>
                <th>Student Name</th>
                <th>CA Mark (40%)</th>
                <th>ESA Mark (60%)</th>
                <th>Total Mark</th>
                <th>Current Grade</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students?.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.registrationNumber}</strong></td>
                  <td>{s.indexNumber}</td>
                  <td>{s.name}</td>
                  <td><strong>{s.caMark}</strong></td>
                  <td>{s.esaMark > 0 ? s.esaMark : '—'}</td>
                  <td><strong>{s.finalMark > 0 ? s.finalMark : '—'}</strong></td>
                  <td>
                    <span className={`badge ${s.grade.startsWith('A') ? 'badge-success' : s.grade.startsWith('B') ? 'badge-info' : 'badge-neutral'}`}>
                      {s.grade}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${s.attendancePercentage >= 80 ? 'badge-success' : 'badge-danger'}`}>
                      {s.attendancePercentage}% (Eligible)
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
