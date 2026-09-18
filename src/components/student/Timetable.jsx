import React, { useState } from 'react';
import { mockSchedule } from '../../lib/mockData';
import { Clock, MapPin, UserCheck } from 'lucide-react';

export default function Timetable() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [selectedDay, setSelectedDay] = useState('Mon');

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Timetable</h3>

      {/* Horizontal Day Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: selectedDay === day ? 'var(--brand-800)' : 'var(--surface)',
              color: selectedDay === day ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: selectedDay === day ? '0 2px 8px rgba(30,58,138,0.25)' : 'var(--shadow-sm)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {day}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
          {selectedDay}, 14 Apr
        </span>
        <span className="badge badge-accent">4 Classes Scheduled</span>
      </div>

      {/* Schedule Timeline Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockSchedule.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              padding: '16px',
              borderLeft: item.status === 'Ongoing' ? '4px solid var(--accent-500)' : '4px solid var(--brand-800)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.subject}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <Clock size={13} />
                  <span>{item.time}</span>
                </div>
              </div>
              <span className={`badge ${item.status === 'Ongoing' ? 'badge-accent' : 'badge-info'}`}>
                {item.status}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} color="var(--brand-800)" />
                {item.room}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserCheck size={12} color="var(--success)" />
                {item.faculty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
