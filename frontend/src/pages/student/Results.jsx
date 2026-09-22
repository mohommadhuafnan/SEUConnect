import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card, StatCard } from '../../components/StatCard';
import { Award, GraduationCap, Printer, Download, Filter } from 'lucide-react';

export const StudentResults = () => {
  const [selectedSem, setSelectedSem] = useState('All');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = async (sem) => {
    setLoading(true);
    try {
      const res = await studentService.getResults(sem === 'All' ? null : sem);
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
    fetchResults(selectedSem);
  }, [selectedSem]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Examination Results &amp; Transcripts</h1>
          <p>Verified semester-wise course grades, continuous assessment breakdown, and grade points.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
            <Printer size={15} /> Print Results Sheet
          </button>
        </div>
      </div>

      {/* Filter and Stats */}
      <div className="seu-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} color="var(--text-muted)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Filter by Semester:</span>
          <select
            className="form-select"
            style={{ width: '160px', padding: '6px 10px' }}
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
          >
            <option value="All">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5 (Current)</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Semester GPA: </span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary-700)' }}>{data?.sgpa?.toFixed(2) || '0.00'}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cumulative CGPA: </span>
            <strong style={{ fontSize: '1.2rem', color: '#d97706' }}>{data?.cgpa?.toFixed(2) || '0.00'}</strong>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <Card title={`Published Examination Results (${data?.results?.length || 0} Modules)`}>
        <div className="table-responsive">
          <table className="seu-table">
            <thead>
              <tr>
                <th>Sem</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>CA Mark</th>
                <th>ESA Mark</th>
                <th>Final Mark</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Quality Points</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Loading results records...
                  </td>
                </tr>
              ) : data?.results?.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No results found for this semester filter.
                  </td>
                </tr>
              ) : (
                data?.results?.map(r => (
                  <tr key={r._id}>
                    <td>Sem {r.semester}</td>
                    <td><strong>{r.subjectId?.code}</strong></td>
                    <td>{r.subjectId?.title}</td>
                    <td>{r.subjectId?.credits}</td>
                    <td>{r.caMark}</td>
                    <td>{r.esaMark > 0 ? r.esaMark : '—'}</td>
                    <td><strong>{r.finalMark > 0 ? r.finalMark : '—'}</strong></td>
                    <td>
                      <span className={`badge ${
                        r.grade.startsWith('A') ? 'badge-success' :
                        r.grade.startsWith('B') ? 'badge-info' :
                        r.grade.startsWith('C') ? 'badge-warning' :
                        r.grade === 'Pending' ? 'badge-neutral' : 'badge-danger'
                      }`}>
                        {r.grade}
                      </span>
                    </td>
                    <td>{r.gradePoint?.toFixed(2)}</td>
                    <td>{r.qualityPoints?.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentResults;
