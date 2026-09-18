import React, { useState } from 'react';
import { Award, AlertTriangle, TrendingUp } from 'lucide-react';

export default function TeacherPerformance() {
  const [tab, setTab] = useState('overview');

  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (78 / 100) * circumference;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Batch Performance</h3>

      <div className="tab-container">
        {['overview', 'subject-wise', 'tests'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            style={{ textTransform: 'capitalize' }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Average Score Donut Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Batch Average Score
        </span>

        <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '14px 0' }}>
          <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="65" cy="65" r={radius} stroke="var(--surface-alt)" strokeWidth="10" fill="transparent" />
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="var(--accent-500)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-900)' }}>78%</span>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          JEE 12 - A is performing <strong>+4% above</strong> institute baseline.
        </p>
      </div>

      {/* Top & Lowest Performer Highlights (From ASPIRE THEME.png Row 2 Screen 14) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="card" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--success-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <Award size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Top Performer</span>
              <h5 style={{ fontSize: '14px', fontWeight: 700 }}>Aarav Mehta</h5>
            </div>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>92%</span>
        </div>

        <div className="card" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--danger-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Needs Attention</span>
              <h5 style={{ fontSize: '14px', fontWeight: 700 }}>Riya Sharma</h5>
            </div>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--danger)' }}>45%</span>
        </div>
      </div>
    </div>
  );
}
