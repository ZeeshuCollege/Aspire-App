import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AttendanceCalendar() {
  const [viewMode, setViewMode] = useState('monthly');

  // April 2025 Calendar Matrix (matching theme mockup)
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Days with statuses (1 to 30)
  const monthDays = [
    { day: null }, { day: null }, { day: 1, status: 'present' }, { day: 2, status: 'present' }, { day: 3, status: 'present' }, { day: 4, status: 'present' }, { day: 5, status: 'leave' },
    { day: 6, status: 'holiday' }, { day: 7, status: 'present' }, { day: 8, status: 'present' }, { day: 9, status: 'absent' }, { day: 10, status: 'present' }, { day: 11, status: 'present' }, { day: 12, status: 'leave' },
    { day: 13, status: 'holiday' }, { day: 14, status: 'present' }, { day: 15, status: 'present' }, { day: 16, status: 'present' }, { day: 17, status: 'present' }, { day: 18, status: 'present' }, { day: 19, status: 'present' },
    { day: 20, status: 'holiday' }, { day: 21, status: 'present' }, { day: 22, status: 'present' }, { day: 23, status: 'present' }, { day: 24, status: 'present' }, { day: 25, status: 'present' }, { day: 26, status: 'leave' },
    { day: 27, status: 'holiday' }, { day: 28, status: 'present' }, { day: 29, status: 'present' }, { day: 30, status: 'present' }
  ];

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Attendance History</h3>

      {/* Monthly / Weekly Segmented Control */}
      <div className="tab-container">
        <button
          onClick={() => setViewMode('monthly')}
          className={`tab-btn ${viewMode === 'monthly' ? 'active' : ''}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setViewMode('weekly')}
          className={`tab-btn ${viewMode === 'weekly' ? 'active' : ''}`}
        >
          Weekly
        </button>
      </div>

      {/* Calendar Card */}
      <div className="card" style={{ padding: '20px' }}>
        {/* Month Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)' }}>April 2025</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '10px' }}>
          {daysOfWeek.map((d, i) => (
            <span key={i} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{d}</span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
          {monthDays.map((item, idx) => {
            if (!item.day) return <div key={idx} />;

            let dotColor = '#10b981'; // Present
            if (item.status === 'absent') dotColor = '#ef4444';
            if (item.status === 'leave') dotColor = '#f59e0b';
            if (item.status === 'holiday') dotColor = '#94a3b8';

            return (
              <div
                key={idx}
                style={{
                  height: '38px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  background: 'var(--surface-alt)',
                  position: 'relative'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.day}</span>
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: dotColor,
                  marginTop: '2px'
                }} />
              </div>
            );
          })}
        </div>

        {/* Color Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '11px', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            Present
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            Absent
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            Leave
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }} />
            Holiday
          </span>
        </div>
      </div>
    </div>
  );
}
