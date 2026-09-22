import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { Card, StatCard } from '../../components/StatCard';
import { Users, BookOpen, FileText, CheckCircle2, XCircle, Bell, Settings, FolderOpen, ArrowRight } from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmin = async () => {
    try {
      const res = await adminService.getDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const handleUpdateMedical = async (id, status) => {
    try {
      const res = await adminService.updateMedicalStatus(id, {
        status,
        remarks: status === 'Approved' ? 'Approved by Faculty Board' : 'Rejected due to incomplete documentation'
      });
      if (res.success) {
        await fetchAdmin();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading administrative console...</div>;
  }

  const { metrics, recentMedicals, recentUsers } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="seu-card" style={{ background: 'linear-gradient(135deg, #0b1f3a 0%, #111a28 100%)', color: '#fff', border: 'none' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>SEUConnect System Administration</h1>
        <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginTop: '4px' }}>
          Centralized governance for Faculty of Technology: User provisioning, academic rules, curriculum, and medical review.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid-4">
        <StatCard title="Total Students" value={metrics?.totalStudents || 0} subtext="Enrolled undergraduates" icon={Users} color="primary" />
        <StatCard title="Academic Staff" value={metrics?.totalLecturers || 0} subtext="Instructors & Professors" icon={Users} color="accent" />
        <StatCard title="Pending Medicals" value={metrics?.pendingMedicals || 0} subtext="Awaiting Board Review" icon={FileText} color="warning" />
        <StatCard title="Active Courses" value={metrics?.totalSubjects || 0} subtext="Curriculum catalog" icon={BookOpen} color="success" />
      </div>

      {/* Pending Medical Requests Review */}
      <Card
        title="Pending Medical Excuse Submissions"
        action={
          <button onClick={() => navigate('/admin/medical')} className="btn btn-secondary btn-sm">
            View All <ArrowRight size={14} />
          </button>
        }
      >
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student</th>
                <th>Leave Period</th>
                <th>Reason</th>
                <th>Medical Facility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentMedicals?.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No pending medical submissions at this time.
                  </td>
                </tr>
              ) : recentMedicals?.map(req => (
                <tr key={req._id}>
                  <td><strong>{req.requestId}</strong></td>
                  <td>{req.studentId?.userId?.name || 'Student'} ({req.studentId?.registrationNumber || '—'})</td>
                  <td>{new Date(req.leaveFrom).toLocaleDateString()} to {new Date(req.leaveTo).toLocaleDateString()}</td>
                  <td>{req.reason}</td>
                  <td>{req.medicalCenterName}</td>
                  <td>
                    {req.status === 'Submitted' || req.status === 'Under Review' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleUpdateMedical(req._id, 'Approved')} className="btn btn-sm" style={{ backgroundColor: '#10b981', color: '#fff' }}>
                          Approve
                        </button>
                        <button onClick={() => handleUpdateMedical(req._id, 'Rejected')} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`badge ${req.status === 'Approved' ? 'badge-success' : 'badge-danger'}`}>
                        {req.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Governance Links */}
      <div className="grid-3">
        <div className="seu-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/users')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Users size={24} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>User Management</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Provision, activate/deactivate students and academic staff accounts.
          </p>
        </div>

        <div className="seu-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/subjects')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <BookOpen size={24} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Curriculum Catalog</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Configure degree courses, credit weights, and syllabus allocations.
          </p>
        </div>

        <div className="seu-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/settings')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Settings size={24} color="#10b981" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Academic Rules Engine</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Adjust 80% attendance threshold, 22-credit ceiling, and degree requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
