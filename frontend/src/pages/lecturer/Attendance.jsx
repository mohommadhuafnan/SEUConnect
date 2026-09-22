import React, { useState, useEffect } from 'react';
import lecturerService from '../../services/lecturerService';
import { Card } from '../../components/StatCard';
import { ClipboardCheck, CheckCircle2, AlertCircle, Users, Check, X } from 'lucide-react';

export const LecturerAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Attendance Form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState('Theory');
  const [hours, setHours] = useState(2);
  const [topic, setTopic] = useState('');
  const [records, setRecords] = useState({}); // { [studentId]: 'Present' | 'Absent' }

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
    const fetchRoster = async () => {
      try {
        const res = await lecturerService.getCourseStudents(selectedCourseId);
        if (res.success) {
          setStudents(res.data.students);
          // Default all present
          const initial = {};
          res.data.students.forEach(s => { initial[s.id] = 'Present'; });
          setRecords(initial);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoster();
  }, [selectedCourseId]);

  const handleToggleStatus = (studentId) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    students.forEach(s => { updated[s.id] = 'Present'; });
    setRecords(updated);
  };

  const handleMarkAllAbsent = () => {
    const updated = {};
    students.forEach(s => { updated[s.id] = 'Absent'; });
    setRecords(updated);
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const recordsArray = Object.entries(records).map(([studentId, status]) => ({
        studentId,
        status
      }));

      const res = await lecturerService.saveAttendance({
        subjectId: selectedCourseId,
        date,
        session,
        hours,
        topic,
        records: recordsArray
      });

      if (res.success) {
        setMsg(`Attendance recorded successfully for ${date}!`);
        setTopic('');
      }
    } catch (err) {
      alert('Error recording attendance: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading instructor course roster...</div>;
  }

  const presentCount = Object.values(records).filter(s => s === 'Present').length;
  const absentCount = Object.values(records).filter(s => s === 'Absent').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Record Course Attendance Session</h1>
        <p>Log daily lecture or laboratory session attendance with bulk verification and automatic ESA eligibility synchronization.</p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      {/* Session Details Form */}
      <Card title="Attendance Session Parameters">
        <form onSubmit={handleSaveAttendance}>
          <div className="grid-3" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Select Course</label>
              <select
                className="form-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.code} — {c.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Session Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Session Type &amp; Hours</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select className="form-select" value={session} onChange={(e) => setSession(e.target.value)}>
                  <option value="Theory">Theory Lecture</option>
                  <option value="Practical">Practical Lab</option>
                </select>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: '80px' }}
                  min="1"
                  max="6"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Lecture Topic / Learning Module</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Advanced Component Architecture & Backend REST Integration"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          {/* Bulk Controls & Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface-hover)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.86rem' }}>
              <div>Enrolled: <strong>{students.length}</strong></div>
              <div>Present: <strong style={{ color: '#10b981' }}>{presentCount}</strong></div>
              <div>Absent: <strong style={{ color: '#ef4444' }}>{absentCount}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={handleMarkAllPresent} className="btn btn-secondary btn-sm">
                <Check size={14} /> Mark All Present
              </button>
              <button type="button" onClick={handleMarkAllAbsent} className="btn btn-secondary btn-sm">
                <X size={14} /> Mark All Absent
              </button>
            </div>
          </div>

          {/* Student Checklist Table */}
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
            <table className="seu-table">
              <thead>
                <tr>
                  <th>Reg Number</th>
                  <th>Index Number</th>
                  <th>Student Name</th>
                  <th>Attendance Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const isPresent = records[s.id] === 'Present';
                  return (
                    <tr key={s.id} style={{ backgroundColor: isPresent ? 'transparent' : 'rgba(239, 68, 68, 0.05)' }}>
                      <td><strong>{s.registrationNumber}</strong></td>
                      <td>{s.indexNumber}</td>
                      <td>{s.name}</td>
                      <td>
                        <span className={`badge ${isPresent ? 'badge-success' : 'badge-danger'}`}>
                          {records[s.id] || 'Present'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(s.id)}
                          className={`btn btn-sm ${isPresent ? 'btn-secondary' : 'btn-primary'}`}
                        >
                          {isPresent ? 'Mark Absent' : 'Mark Present'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <ClipboardCheck size={16} /> {saving ? 'Recording...' : 'Submit Session Attendance'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LecturerAttendance;
