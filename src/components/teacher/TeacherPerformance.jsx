import React, { useState } from 'react';
import { Award, AlertTriangle } from 'lucide-react';
import { getStoredStudents } from '../../lib/userAuthStore';
import MobileDropdown from '../common/MobileDropdown';

export default function TeacherPerformance() {
  const [tab, setTab] = useState('overview');

  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (78 / 100) * circumference;

  return (
    <div className="view-transition-enter" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--brand-900)', margin: 0, letterSpacing: '-0.02em' }}>
            Batch Performance
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ANALYTICS // JEE-12-A
          </span>
        </div>
        <span className="badge badge-accent">
          ACTIVE COHORT
        </span>
      </div>

      <div>
        <MobileDropdown
          title="Select Performance Section"
          options={[
            { value: 'overview', label: 'Batch Overview' },
            { value: 'subject-wise', label: 'Subject-wise Analytics' },
            { value: 'tests', label: 'Test Evaluations' }
          ]}
          value={tab}
          onChange={val => setTab(val)}
          placeholder="Select Section"
        />
      </div>

      {/* Average Score Donut Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
          Batch Mean Score // JEE 12-A
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
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: 900, color: 'var(--brand-900)', fontFamily: 'var(--font-mono)' }}>78%</span>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          JEE 12 - A is performing <strong>+4% above</strong> institute baseline.
        </p>
      </div>

      {/* Top & Lowest Performer Highlights - Smooth Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="card" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--success)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--success-tint)', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <Award size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Top Performer</span>
              <h5 style={{ fontSize: '14px', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--brand-900)' }}>
                {getStoredStudents()[0]?.name || 'Top Scoring Student'}
              </h5>
            </div>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>92%</span>
        </div>

        <div className="card" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--danger)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--danger-tint)', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Needs Attention</span>
              <h5 style={{ fontSize: '14px', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--brand-900)' }}>
                {getStoredStudents().length > 1 ? getStoredStudents()[getStoredStudents().length - 1]?.name : 'Student Needing Guidance'}
              </h5>
            </div>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>45%</span>
        </div>
      </div>
    </div>
  );
}
