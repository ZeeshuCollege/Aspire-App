import React, { useState } from 'react';
import { mockTests } from '../../lib/mockData';
import { FileText, Calendar, Clock, Award, CheckCircle, XCircle } from 'lucide-react';

export default function TestsView({ onOpenTestPaper }) {
  const [tab, setTab] = useState('upcoming');

  const tests = mockTests.filter(t => t.status.toLowerCase() === tab);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Tests & Results</h3>

      {/* Segmented Tabs: Upcoming vs Completed */}
      <div className="tab-container">
        <button
          onClick={() => setTab('upcoming')}
          className={`tab-btn ${tab === 'upcoming' ? 'active' : ''}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`tab-btn ${tab === 'completed' ? 'active' : ''}`}
        >
          Completed
        </button>
      </div>

      {/* Test List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tests.map(test => (
          <div key={test.id} className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-warning" style={{ marginBottom: '4px' }}>
                  {test.subject}
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-900)' }}>{test.code}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{test.chapter}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-800)' }}>{test.duration}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Max: {test.maxMarks}m</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>
              <Calendar size={14} />
              <span>{test.date}</span>
            </div>

            {/* If completed, show score summary */}
            {test.status === 'Completed' && (
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ background: '#ecfdf5', padding: '8px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#166534', display: 'block' }}>Marks</span>
                  <strong style={{ fontSize: '15px', color: '#15803d' }}>{test.marksObtained}/100</strong>
                </div>
                <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#1e40af', display: 'block' }}>Rank</span>
                  <strong style={{ fontSize: '15px', color: '#1e3a8a' }}>#{test.rank}</strong>
                </div>
                <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#92400e', display: 'block' }}>Score</span>
                  <strong style={{ fontSize: '15px', color: '#b45309' }}>{test.percentage}%</strong>
                </div>
              </div>
            )}

            {/* In-App Test Paper View Action */}
            <button
              onClick={() => onOpenTestPaper({ title: test.code, subtitle: `${test.subject} • ${test.chapter} (${test.date})` })}
              className="btn-secondary"
              style={{ width: '100%', marginTop: '14px', fontSize: '12px', padding: '8px' }}
            >
              View Test Paper (In-App)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
