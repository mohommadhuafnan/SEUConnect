import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { processService } from '../../services/extraServices';
import { Card } from '../../components/StatCard';
import { BookOpen, Search, ArrowRight, CheckCircle2, FileText, Building, Clock } from 'lucide-react';

export const StudentProcesses = () => {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const res = await processService.getProcesses({ search: search || null });
        if (res.success) {
          setProcesses(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProcesses();
  }, [search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>University Process Guidance</h1>
        <p>Step-by-step regulatory guidance: Tells you what to do, which form you need, where to submit, and what happens next.</p>
      </div>

      {/* Search */}
      <div className="seu-card">
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search processes (e.g. repeat exam, medical excuse, fee deposit, add/drop)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Process Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading university process guides...
          </div>
        ) : processes.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No process guidance found for this search.
          </div>
        ) : (
          processes.map(proc => (
            <div
              key={proc._id}
              className="seu-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-info">{proc.category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{proc.steps?.length} Steps</span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {proc.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {proc.purpose}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} /> Submission Office: <strong>{proc.submissionLocation}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> Deadline: <strong>{proc.deadlineInfo}</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => navigate(`/student/processes/${proc.processId}`)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  View Step-by-Step Guide <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentProcesses;
