import React, { useState, useEffect } from 'react';
import { mockSchedule } from '../../lib/mockData';
import { Clock, UserCheck, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import AttendanceView from './AttendanceView';

export default function Timetable({ initialSubTab = 'schedule' }) {
  const [subTab, setSubTab] = useState(initialSubTab);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [selectedDay, setSelectedDay] = useState('Mon');

  const [adminTimetable, setAdminTimetable] = useState(() => {
    try {
      const raw = localStorage.getItem('aspire_admin_timetable');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const dayLectures = (adminTimetable && adminTimetable.length > 0)
    ? adminTimetable.filter(l => l.day === selectedDay)
    : (mockSchedule || []).filter(l => l.day === selectedDay);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      {/* Top Segmented View Switcher */}
      <div className="tab-container">
        <button
          className={`tab-btn ${subTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setSubTab('schedule')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <CalendarIcon size={14} /> Class Schedule
        </button>
        <button
          className={`tab-btn ${subTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setSubTab('attendance')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <CheckCircle2 size={14} /> Attendance Record
        </button>
      </div>

      {subTab === 'attendance' ? (
        <AttendanceView />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Weekly Timetable</h3>
            <span className="badge badge-accent">
              {dayLectures.length} {dayLectures.length === 1 ? 'Class' : 'Classes'} Scheduled
            </span>
          </div>

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
              {selectedDay} Schedule
            </span>
            <span className="badge badge-accent">
              {dayLectures.length} {dayLectures.length === 1 ? 'Class' : 'Classes'}
            </span>
          </div>

          {/* Schedule Timeline Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dayLectures.length === 0 ? (
              <div className="card" style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CalendarIcon size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                <p style={{ fontSize: '13px', margin: 0, fontWeight: 600 }}>No lectures scheduled for {selectedDay}</p>
              </div>
            ) : (
              dayLectures.map((item, idx) => (
                <div
                  key={item.id || idx}
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
                    {item.course && (
                      <span className="badge badge-primary" style={{ fontSize: '10.5px' }}>
                        {item.course}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserCheck size={13} color="var(--success)" />
                      {item.faculty || 'Faculty'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
