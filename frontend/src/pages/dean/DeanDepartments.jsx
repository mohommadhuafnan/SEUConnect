import React, { useState, useEffect } from 'react';
import deanService from '../../services/deanService';
import {
  Building2,
  Users,
  Award,
  BarChart3,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const DeanDepartments = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await deanService.getDashboard();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const departments = [
    { name: 'Department of Information & Communication Technology', code: 'CS & IT', hod: 'Dr. Amara Silva', students: 340, lecturers: 16, attendance: 92, repeats: 12, avgCGPA: 3.32 },
    { name: 'Department of Electrical Engineering', code: 'Electrical Eng.', hod: 'Dr. N. Fernando', students: 280, lecturers: 14, attendance: 88, repeats: 18, avgCGPA: 3.25 },
    { name: 'Department of Mechanical Engineering', code: 'Mechanical Eng.', hod: 'Prof. K. Perera', students: 260, lecturers: 13, attendance: 85, repeats: 27, avgCGPA: 3.18 },
    { name: 'Department of Business & Management', code: 'Business & Mgt', hod: 'Dr. S. Wickrama', students: 310, lecturers: 12, attendance: 78, repeats: 34, avgCGPA: 3.05 },
    { name: 'Department of Civil Engineering', code: 'Civil Eng.', hod: 'Dr. M. Bandara', students: 290, lecturers: 15, attendance: 80, repeats: 22, avgCGPA: 3.14 },
    { name: 'Department of Mathematics & Physical Sciences', code: 'Math & Physics', hod: 'Dr. T. Jayasinghe', students: 190, lecturers: 10, attendance: 90, repeats: 11, avgCGPA: 3.40 }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Faculty Department Performance &amp; Analytics</h1>
        <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
          Comparative attendance compliance, repeat frequency, and GPA metrics across Faculty of Technology departments
        </div>
      </div>

      {/* Chart */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={20} color="#2563eb" />
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
            Attendance Compliance vs. Repeat Candidate Frequency
          </h2>
        </div>

        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departments} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
              <Bar dataKey="attendance" name="Attendance Compliance (%)" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="repeats" name="Repeat Candidates (count)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '16px'
      }}>
        {departments.map((d, i) => (
          <div key={i} style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {d.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                HOD: <strong>{d.hod}</strong>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              backgroundColor: 'var(--bg-page)',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Students</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{d.students}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Attendance</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: d.attendance >= 85 ? '#059669' : '#d97706' }}>
                  {d.attendance}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Repeats</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#dc2626' }}>{d.repeats}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Avg CGPA</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>{d.avgCGPA}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeanDepartments;
