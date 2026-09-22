import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Card } from '../../components/StatCard';
import { BookOpen, Plus, Trash2, Edit, CheckCircle2, Sliders } from 'lucide-react';

export const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(5);
  const [degreeProgramme, setDegreeProgramme] = useState('BICT');

  const fetchSubjects = async () => {
    try {
      const res = await adminService.getSubjects();
      if (res.success) setSubjects(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.createSubject({
        code,
        title,
        credits: Number(credits),
        semester: Number(semester),
        degreeProgramme
      });
      if (res.success) {
        setShowModal(false);
        setCode('');
        setTitle('');
        await fetchSubjects();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course from the curriculum?')) return;
    try {
      const res = await adminService.deleteSubject(id);
      if (res.success) await fetchSubjects();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Curriculum &amp; Course Catalog</h1>
          <p>Configure Faculty of Technology degree subjects, credit weightages, and semester curriculum modules.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add New Course Module
        </button>
      </div>

      <Card title={`Active Modules (${subjects.length})`}>
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Semester</th>
                <th>Degree Programme</th>
                <th>Theory / Lab</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>Loading curriculum...</td></tr>
              ) : subjects.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.code}</strong></td>
                  <td>{s.title}</td>
                  <td><span className="badge badge-neutral">{s.credits} Credits</span></td>
                  <td>Semester {s.semester}</td>
                  <td><span className="badge badge-info">{s.degreeProgramme}</span></td>
                  <td>{s.theoryHours}h / {s.practicalHours}h</td>
                  <td>
                    <button onClick={() => handleDelete(s._id)} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add Curriculum Course</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreateSubject}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Course Code *</label>
                    <input type="text" className="form-input" placeholder="e.g. ICT32013" value={code} onChange={e => setCode(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credits *</label>
                    <input type="number" min="1" max="8" className="form-input" value={credits} onChange={e => setCredits(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input type="text" className="form-input" placeholder="e.g. Distributed Computing" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <input type="number" min="1" max="8" className="form-input" value={semester} onChange={e => setSemester(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Programme</label>
                    <select className="form-select" value={degreeProgramme} onChange={e => setDegreeProgramme(e.target.value)}>
                      <option value="BICT">BICT</option>
                      <option value="BBST">BBST</option>
                      <option value="COMMON">COMMON</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminMedicalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicals = async () => {
    try {
      const res = await adminService.getMedicalRequests();
      if (res.success) setRequests(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicals();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      const res = await adminService.updateMedicalStatus(id, {
        status,
        remarks: status === 'Approved' ? 'Validated against University Medical Officer records' : 'Rejected'
      });
      if (res.success) await fetchMedicals();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Medical Request Approvals</h1>
        <p>Faculty board review queue for undergraduate medical excuses and attendance validation.</p>
      </div>

      <Card title={`All Submitted Medical Certificates (${requests.length})`}>
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student Candidate</th>
                <th>Leave Period</th>
                <th>Reason</th>
                <th>Health Center</th>
                <th>Doctor</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '24px' }}>Loading submissions...</td></tr>
              ) : requests.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.requestId}</strong></td>
                  <td>{r.studentId?.userId?.name} ({r.studentId?.registrationNumber})</td>
                  <td>{new Date(r.leaveFrom).toLocaleDateString()} – {new Date(r.leaveTo).toLocaleDateString()}</td>
                  <td>{r.reason}</td>
                  <td>{r.medicalCenterName}</td>
                  <td>{r.doctorName || 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                      r.status === 'Approved' ? 'badge-success' :
                      r.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleUpdate(r._id, 'Approved')} className="btn btn-sm" style={{ backgroundColor: '#10b981', color: '#fff' }}>
                        Approve
                      </button>
                      <button onClick={() => handleUpdate(r._id, 'Rejected')} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
                        Reject
                      </button>
                    </div>
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

export const AdminSettings = () => {
  const [rules, setRules] = useState({
    attendanceMinimumPercent: 80,
    maximumCreditsPerSemester: 22,
    bictGraduationCredits: 130,
    bbstGraduationCredits: 120
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await adminService.getAcademicRules();
        if (res.success && res.data) {
          setRules({
            attendanceMinimumPercent: res.data.attendanceMinimumPercent || 80,
            maximumCreditsPerSemester: res.data.maximumCreditsPerSemester || 22,
            bictGraduationCredits: res.data.bictGraduationCredits || 130,
            bbstGraduationCredits: res.data.bbstGraduationCredits || 120
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.updateAcademicRules(rules);
      if (res.success) {
        setMsg('University academic rules successfully updated and synchronized across all portals!');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Configurable Academic Rules Engine</h1>
        <p>Regulate global faculty standards for examination eligibility, credit workloads, and graduation requirements.</p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      <Card title="Global Academic Thresholds">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Mandatory Attendance Minimum (% for ESA Eligibility)</label>
              <input
                type="number"
                className="form-input"
                min="50"
                max="100"
                value={rules.attendanceMinimumPercent}
                onChange={e => setRules({ ...rules, attendanceMinimumPercent: Number(e.target.value) })}
                required
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                SEUSL Faculty of Technology benchmark: 80%
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Credits per Semester</label>
              <input
                type="number"
                className="form-input"
                min="15"
                max="30"
                value={rules.maximumCreditsPerSemester}
                onChange={e => setRules({ ...rules, maximumCreditsPerSemester: Number(e.target.value) })}
                required
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Handbook Section 4.2 ceiling: 22 Credits
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">BICT Graduation Credits Target</label>
              <input
                type="number"
                className="form-input"
                value={rules.bictGraduationCredits}
                onChange={e => setRules({ ...rules, bictGraduationCredits: Number(e.target.value) })}
                required
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Standard: 130 Credits
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">BBST Graduation Credits Target</label>
              <input
                type="number"
                className="form-input"
                value={rules.bbstGraduationCredits}
                onChange={e => setRules({ ...rules, bbstGraduationCredits: Number(e.target.value) })}
                required
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Standard: 120 Credits
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary">
              <Sliders size={16} /> Save &amp; Apply Academic Rules
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
