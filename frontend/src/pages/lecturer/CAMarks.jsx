import React, { useState, useEffect } from 'react';
import lecturerService from '../../services/lecturerService';
import { Card } from '../../components/StatCard';
import { CheckSquare, CheckCircle2, Award, Save, AlertCircle } from 'lucide-react';

export const LecturerCAMarks = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // { [studentId]: caMark }
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
            initialMarks[s.id] = s.caMark || 0;
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
      const marksList = Object.entries(marks).map(([studentId, caMark]) => ({
        studentId,
        caMark
      }));

      const res = await lecturerService.saveCAMarks({
        courseId: selectedCourseId,
        marksList
      });

      if (res.success) {
        setMsg('Continuous Assessment (CA) marks updated successfully!');
      }
    } catch (err) {
      alert('Error updating marks: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading course grading sheets...</div>;
  }

  const selectedCourse = courses.find(c => c._id === selectedCourseId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Continuous Assessment (CA) Marks Management</h1>
        <p>Record, validate, and submit Continuous Assessment components (Quizzes, Midterms, Practicals, and Coursework).</p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      <Card title="Select Course &amp; Weightage Configuration">
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Active Course</label>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-surface-hover)', padding: '12px 16px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CA Weightage</div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-700)' }}>40%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESA Weightage</div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)' }}>60%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class Size</div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{students.length}</div>
            </div>
          </div>
        </div>
      </Card>

      <Card title={`Student Grade Sheet: ${selectedCourse?.code || ''}`}>
        <form onSubmit={handleSaveMarks}>
          <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto', marginBottom: '20px' }}>
            <table className="seu-table">
              <thead>
                <tr>
                  <th>Reg Number</th>
                  <th>Index Number</th>
                  <th>Student Name</th>
                  <th>CA Raw Mark (0–100)</th>
                  <th>Weighted CA (40%)</th>
                  <th>Current Overall Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const rawMark = marks[s.id] ?? 0;
                  const weighted = ((rawMark * 0.4)).toFixed(1);
                  return (
                    <tr key={s.id}>
                      <td><strong>{s.registrationNumber}</strong></td>
                      <td>{s.indexNumber}</td>
                      <td>{s.name}</td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '100px', fontWeight: 'bold' }}
                          min="0"
                          max="100"
                          value={rawMark}
                          onChange={(e) => handleMarkChange(s.id, e.target.value)}
                        />
                      </td>
                      <td><strong>{weighted} / 40</strong></td>
                      <td>
                        <span className={`badge ${rawMark >= 50 ? 'badge-success' : 'badge-warning'}`}>
                          {rawMark >= 50 ? 'In Good Standing' : 'Below Average'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save CA Marks to Official Record'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LecturerCAMarks;
