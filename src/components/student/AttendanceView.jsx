import React, { useState } from 'react';
import FullAttendanceReportModal from './FullAttendanceReportModal';

export default function AttendanceView() {
  const [isReportOpen, setIsReportOpen] = useState(false);
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
    <div className="view-transition-enter" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--brand-900)', margin: 0, letterSpacing: '-0.02em' }}>
            Attendance Telemetry
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            METRIC_ID // ATT-TERM-02
          </span>
        </div>
        <span className="badge badge-success" style={{ borderRadius: '9999px' }}>
          VERIFIED RECORD
        </span>
      </div>

      {/* Sharp Metric Display Gauge Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="var(--surface-alt)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Arc */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="var(--success)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25, 1, 0.5, 1)' }}
            />
          </svg>

          {/* Center Metric */}
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--brand-900)', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
              89%
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Cumulative
            </span>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '14px', maxWidth: '300px' }}>
          You have attended <strong>74 of 83</strong> offline lectures this term. Minimum required: 75%.
        </p>
      </div>

      {/* Subject-Wise Breakdown List */}
      <div>
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)', marginBottom: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Course Breakdown // 4 Subjects
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {subjects.map(sub => (
            <div key={sub.name} className="card" style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>{sub.name}</span>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: sub.color, fontFamily: 'var(--font-mono)' }}>{sub.percent}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--surface-alt)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <div style={{ width: `${sub.percent}%`, height: '100%', background: sub.color, borderRadius: '9999px', transition: 'width 0.8s cubic-bezier(0.25, 1, 0.5, 1)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsReportOpen(true)}
        className="btn-primary"
        style={{ width: '100%', marginTop: '4px' }}
      >
        View Full Attendance Ledger
      </button>

      {/* Full 30-Lecture Attendance Report Modal */}
      <FullAttendanceReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
