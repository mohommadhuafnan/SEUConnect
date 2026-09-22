import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import { Card } from '../../components/StatCard';
import { HeartHandshake, Award, Building, Mail, Phone } from 'lucide-react';

export const StudentWelfare = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchWelfare = async () => {
      setLoading(true);
      try {
        const res = await studentService.getWelfare(category === 'All' ? null : category);
        if (res.success) setServices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWelfare();
  }, [category]);

  const categories = ['All', 'Scholarships', 'Financial Support', 'Accommodation', 'Counselling', 'Student Support'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Student Welfare, Bursaries &amp; Scholarships</h1>
        <p>Institutional assistance schemes, Mahapola bursaries, on-campus accommodation, and student counselling services.</p>
      </div>

      <div className="seu-card" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-secondary'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading student welfare services...
          </div>
        ) : services.map(w => (
          <div key={w._id} className="seu-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: '8px' }}>{w.category}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{w.title}</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                {w.description}
              </p>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', backgroundColor: 'var(--bg-surface-hover)', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
                <div><strong>Eligibility:</strong> {w.eligibility}</div>
                {w.benefits && <div style={{ marginTop: '4px' }}><strong>Benefits:</strong> {w.benefits}</div>}
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <div>Office: <strong>{w.contactOffice}</strong></div>
              {w.contactEmail && <div>Email: {w.contactEmail}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentWelfare;
