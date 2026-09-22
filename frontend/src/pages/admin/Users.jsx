import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Card } from '../../components/StatCard';
import { Users, UserPlus, Trash2, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // New User Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('student');
  const [regNo, setRegNo] = useState('');
  const [degree, setDegree] = useState('BICT');

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers({
        role: roleFilter === 'all' ? null : roleFilter,
        search: search || null
      });
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search]);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await adminService.updateUser(user._id, { status: newStatus });
      if (res.success) await fetchUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user account?')) return;
    try {
      const res = await adminService.deleteUser(id);
      if (res.success) await fetchUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        email,
        password,
        role,
        studentData: role === 'student' ? { registrationNumber: regNo || `24ICT${Date.now().toString().slice(-3)}`, degreeProgramme: degree } : undefined
      };
      const res = await adminService.createUser(payload);
      if (res.success) {
        setShowModal(false);
        setName('');
        setEmail('');
        setRegNo('');
        await fetchUsers();
      }
    } catch (err) {
      alert('Error creating user: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>User &amp; Identity Management</h1>
          <p>Provision and govern institutional student, lecturer, and administrative access privileges.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <UserPlus size={16} /> Create New University Account
        </button>
      </div>

      <div className="seu-card" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or university email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="lecturer">Lecturers</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      <Card title={`Active University Accounts (${users.length})`}>
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>University Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>Loading directory...</td></tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className="btn btn-secondary btn-sm"
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create User Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Provision University User</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">University Email *</label>
                  <input type="email" className="form-input" placeholder="e.g. 23ict099@seu.ac.lk" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Initial Password</label>
                    <input type="text" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Assignment</label>
                    <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                      <option value="student">Student</option>
                      <option value="lecturer">Lecturer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                {role === 'student' && (
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Registration Number</label>
                      <input type="text" className="form-input" placeholder="23ICT099" value={regNo} onChange={e => setRegNo(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Programme</label>
                      <select className="form-select" value={degree} onChange={e => setDegree(e.target.value)}>
                        <option value="BICT">BICT</option>
                        <option value="BBST">BBST</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
