import React, { useState } from 'react';
import { mockStudentsList } from '../../lib/mockData';
import { Check, X, Calendar, CheckCheck } from 'lucide-react';

export default function AttendanceMarker() {
  const [students, setStudents] = useState(mockStudentsList);
  const [view, setView] = useState('students');
  const [selectedBatch, setSelectedBatch] = useState('JEE 12 - A');

  // Toggle single student attendance
  const toggleAttendance = (id) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, attendance: s.attendance === 'Present' ? 'Absent' : 'Present' };
      }
      return s;
    }));
  };

  // Mark all students present at once
  const markAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, attendance: 'Present' })));
  };

  const presentCount = students.filter(s => s.attendance === 'Present').length;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Roll Call & Attendance</h3>

      {/* Batch & Date Bar */}
      <div className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-800)' }}>{selectedBatch}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Physics • Today, 15 Apr</span>
        </div>
        <span className="badge badge-accent">
          {presentCount}/{students.length} Present
        </span>
      </div>

      {/* View Toggle */}
      <div className="tab-container">
        <button
          onClick={() => setView('students')}
          className={`tab-btn ${view === 'students' ? 'active' : ''}`}
        >
          Students ({students.length})
        </button>
        <button
          onClick={() => setView('summary')}
          className={`tab-btn ${view === 'summary' ? 'active' : ''}`}
        >
          Summary
        </button>
      </div>

      {/* Student Attendance List */}
      {view === 'students' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {students.map(std => {
            const isPresent = std.attendance === 'Present';
            return (
              <div
                key={std.id}
                className="card"
                style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--surface-alt)',
                    color: 'var(--brand-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}>
                    {std.roll}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{std.name}</h5>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Roll #{std.roll}</span>
                  </div>
                </div>

                {/* Status Toggle Button */}
                <button
                  onClick={() => toggleAttendance(std.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: isPresent ? 'var(--success-tint)' : 'var(--danger-tint)',
                    color: isPresent ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isPresent ? <Check size={14} /> : <X size={14} />}
                  {std.attendance}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Attendance Summary</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {Math.round((presentCount / students.length) * 100)}% class attendance recorded.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px' }}>
            <div style={{ padding: '12px 20px', background: 'var(--success-tint)', borderRadius: '10px', color: 'var(--success)' }}>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{presentCount}</div>
              <div style={{ fontSize: '11px', fontWeight: 600 }}>Present</div>
            </div>
            <div style={{ padding: '12px 20px', background: 'var(--danger-tint)', borderRadius: '10px', color: 'var(--danger)' }}>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{students.length - presentCount}</div>
              <div style={{ fontSize: '11px', fontWeight: 600 }}>Absent</div>
            </div>
          </div>
        </div>
      )}

      {/* Mark All Present CTA */}
      <button
        onClick={markAllPresent}
        className="btn-primary"
        style={{ width: '100%', marginTop: '6px', gap: '8px' }}
      >
        <CheckCheck size={18} />
        Mark All Present
      </button>
    </div>
  );
}
