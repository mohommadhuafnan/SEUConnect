import React, { useState, useEffect } from 'react';
import lecturerService from '../../services/lecturerService';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/StatCard';
import { Award, Save, CheckCircle2, User, Upload, Trash2 } from 'lucide-react';

export const LecturerESAMarks = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await lecturerService.getCourses();
        if (res.success && res.data.length > 0) {
          setCourses(res.data);
          setSelectedCourseId(res.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchStudentsList = async () => {
      try {
        const res = await lecturerService.getCourseStudents(selectedCourseId);
        if (res.success) {
          setStudents(res.data.students);
          const initialMarks = {};
          res.data.students.forEach(s => {
            initialMarks[s.id] = s.esaMark || 0;
          });
          setMarks(initialMarks);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentsList();
  }, [selectedCourseId]);

  const handleMarkChange = (studentId, val) => {
    const num = Math.min(100, Math.max(0, Number(val) || 0));
    setMarks(prev => ({ ...prev, [studentId]: num }));
  };

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const marksList = Object.entries(marks).map(([studentId, esaMark]) => ({
        studentId,
        esaMark
      }));

      const res = await lecturerService.saveESAMarks({
        courseId: selectedCourseId,
        marksList
      });

      if (res.success) {
        setMsg('End Semester Examination (ESA) marks recorded successfully!');
      }
    } catch (err) {
      alert('Error saving ESA marks: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading exam grading portal...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>End Semester Examination (ESA) Marks Entry</h1>
        <p>Input final examination paper and practical scores for official grading and faculty board submission.</p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      <Card title="Select Examination Course Section">
        <div className="form-group" style={{ maxWidth: '400px' }}>
          <label className="form-label">Course</label>
          <select className="form-select" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.code} — {c.title}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card title="ESA Marks Register (Weightage: 60%)">
        <form onSubmit={handleSaveMarks}>
          <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto', marginBottom: '20px' }}>
            <table className="seu-table">
              <thead>
                <tr>
                  <th>Index Number</th>
                  <th>Student Name</th>
                  <th>ESA Raw Mark (0–100)</th>
                  <th>Weighted ESA (60%)</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const rawMark = marks[s.id] ?? 0;
                  const weighted = ((rawMark * 0.6)).toFixed(1);
                  return (
                    <tr key={s.id}>
                      <td><strong>{s.indexNumber}</strong></td>
                      <td>{s.name}</td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '110px', fontWeight: 'bold' }}
                          min="0"
                          max="100"
                          value={rawMark}
                          onChange={(e) => handleMarkChange(s.id, e.target.value)}
                        />
                      </td>
                      <td><strong>{weighted} / 60</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Submit ESA Marks'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export const LecturerProfile = () => {
  const { user, profile, updateUserProfile } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [specialization, setSpecialization] = useState(profile?.specialization || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateProfile({ phone, address, specialization });
      if (res.success) {
        updateUserProfile(res.data.user, res.data.profile);
        setMsg('Profile updated successfully!');
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Lecturer Academic Profile</h1>
        <p>Faculty designation, department details, and contact information.</p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      <div className="seu-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-100)',
          color: 'var(--primary-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '2rem'
        }}>
          {user?.name?.charAt(0) || 'L'}
        </div>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{user?.name}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email}</div>
          <div style={{ marginTop: '6px' }}>
            <span className="badge badge-info">{profile?.designation || 'Lecturer'}</span>
            <span className="badge badge-neutral" style={{ marginLeft: '6px' }}>Staff ID: {profile?.staffId}</span>
          </div>
        </div>
      </div>

      <Card title="Edit Contact Details">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Academic Specialization</label>
              <input type="text" className="form-input" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Office / Postal Address</label>
            <textarea className="form-textarea" rows="2" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
