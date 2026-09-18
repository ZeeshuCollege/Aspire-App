import React from 'react';

export default function AttendanceView() {
  const subjects = [
    { name: 'Physics', percent: 92, color: '#0ea5e9' },
    { name: 'Mathematics', percent: 86, color: '#10b981' },
    { name: 'Chemistry', percent: 78, color: '#f59e0b' },
    { name: 'Biology', percent: 88, color: '#8b5cf6' }
  ];

  // Radial SVG calculation for 89%
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (89 / 100) * circumference;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Attendance</h3>

      {/* Circular Progress Gauge Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Track */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="var(--surface-alt)"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Progress Arc */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="var(--success)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>

          {/* Center Metric */}
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-900)', lineHeight: 1 }}>89%</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px', fontWeight: 600 }}>Overall Attendance</span>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px', maxWidth: '280px' }}>
          You have attended <strong>74 out of 83</strong> offline lectures this term.
        </p>
      </div>

      {/* Subject-Wise Breakdown List */}
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-900)', marginBottom: '12px' }}>
          Subject Breakdown
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {subjects.map(sub => (
            <div key={sub.name} className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{sub.name}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: sub.color }}>{sub.percent}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--surface-alt)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${sub.percent}%`, height: '100%', background: sub.color, borderRadius: '9999px', transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" style={{ width: '100%', marginTop: '4px' }}>
        View Full Report
      </button>
    </div>
  );
}
