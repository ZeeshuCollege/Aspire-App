import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Check, X, Calendar, 
  Clock, BookOpen, User, Sparkles, Filter, Info 
} from 'lucide-react';
import { getStudentTodayAttendance } from '../../lib/attendanceService';

export const mock30Lectures = [
  { id: 1, number: 1, subject: 'Physics', topic: 'Vectors & Kinematics', date: '01 Mar 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 2, number: 2, subject: 'Chemistry', topic: 'Chemical Bonding & Structure', date: '03 Mar 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Present' },
  { id: 3, number: 3, subject: 'Mathematics', topic: 'Matrices & Determinants', date: '05 Mar 2025', time: '10:00 AM', faculty: 'Prof. S. K. Gupta', status: 'Present' },
  { id: 4, number: 4, subject: 'Physics', topic: "Newton's Laws of Motion I", date: '07 Mar 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 5, number: 5, subject: 'Chemistry', topic: 'Thermodynamics & Enthalpy', date: '08 Mar 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Present' },
  { id: 6, number: 6, subject: 'Mathematics', topic: 'Calculus: Limits & Continuity', date: '10 Mar 2025', time: '10:00 AM', faculty: 'Prof. S. K. Gupta', status: 'Present' },
  { id: 7, number: 7, subject: 'Physics', topic: 'Friction & Circular Motion', date: '12 Mar 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 8, number: 8, subject: 'Chemistry', topic: 'Equilibrium & Le Chatelier', date: '14 Mar 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Present' },
  { id: 9, number: 9, subject: 'Physics', topic: 'Work, Energy & Power', date: '15 Mar 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Absent' },
  { id: 10, number: 10, subject: 'Mathematics', topic: 'Differentiability & Derivatives', date: '17 Mar 2025', time: '10:00 AM', faculty: 'Prof. S. K. Gupta', status: 'Present' },
  { id: 11, number: 11, subject: 'Physics', topic: 'Centre of Mass & Momentum', date: '19 Mar 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 12, number: 12, subject: 'Chemistry', topic: 'Electrochemistry & Redox', date: '21 Mar 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Present' },
  { id: 13, number: 13, subject: 'Mathematics', topic: 'Applications of Derivatives', date: '22 Mar 2025', time: '10:00 AM', faculty: 'Prof. S. K. Gupta', status: 'Present' },
  { id: 14, number: 14, subject: 'Physics', topic: 'Rotational Dynamics I', date: '24 Mar 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 15, number: 15, subject: 'Chemistry', topic: 'Solutions & Colligative Properties', date: '26 Mar 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Present' },
  { id: 16, number: 16, subject: 'Mathematics', topic: 'Indefinite Integration Basics', date: '28 Mar 2025', time: '10:00 AM', faculty: 'Prof. S. K. Gupta', status: 'Present' },
  { id: 17, number: 17, subject: 'Physics', topic: 'Moment of Inertia Theorems', date: '29 Mar 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 18, number: 18, subject: 'Chemistry', topic: 'Chemical Kinetics & Rate Laws', date: '31 Mar 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Absent' },
  { id: 19, number: 19, subject: 'Mathematics', topic: 'Integration by Parts & Substitution', date: '02 Apr 2025', time: '10:00 AM', faculty: 'Prof. S. K. Gupta', status: 'Present' },
  { id: 20, number: 20, subject: 'Physics', topic: 'Gravitation & Planetary Motion', date: '04 Apr 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 21, number: 21, subject: 'Chemistry', topic: 'Organic Chemistry: Hydrocarbons', date: '05 Apr 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Present' },
  { id: 22, number: 22, subject: 'Mathematics', topic: 'Definite Integrals & Properties', date: '07 Apr 2025', time: '10:00 AM', faculty: 'Prof. S. K. Gupta', status: 'Present' },
  { id: 23, number: 23, subject: 'Physics', topic: 'Mechanical Properties of Solids', date: '09 Apr 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 24, number: 24, subject: 'Chemistry', topic: 'Alkyl Halides & Nucleophiles', date: '11 Apr 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Present' },
  { id: 25, number: 25, subject: 'Mathematics', topic: 'Differential Equations', date: '12 Apr 2025', time: '10:00 AM', faculty: 'Prof. S. K. Gupta', status: 'Absent' },
  { id: 26, number: 26, subject: 'Physics', topic: 'Fluid Mechanics & Bernoulli', date: '14 Apr 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 27, number: 27, subject: 'Chemistry', topic: 'Alcohols, Phenols & Ethers', date: '15 Apr 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Present' },
  { id: 28, number: 28, subject: 'Mathematics', topic: 'Vectors & 3D Geometry', date: '16 Apr 2025', time: '10:00 AM', faculty: 'Prof. S. K. Gupta', status: 'Present' },
  { id: 29, number: 29, subject: 'Physics', topic: 'Simple Harmonic Motion (SHM)', date: '17 Apr 2025', time: '10:00 AM', faculty: 'Ms. Priya Shah', status: 'Present' },
  { id: 30, number: 30, subject: 'Chemistry', topic: 'Aldehydes, Ketones & Acids', date: '18 Apr 2025', time: '11:30 AM', faculty: 'Dr. Alok Verma', status: 'Present' }
];

export default function AttendanceCalendar() {
  const [filter, setFilter] = useState('all'); // 'all' | 'present' | 'absent'
  const [allLectures, setAllLectures] = useState(mock30Lectures);
  const [selectedLecture, setSelectedLecture] = useState(mock30Lectures[29]);

  // Sync today's attendance if marked by teacher
  useEffect(() => {
    const checkTodayRecord = () => {
      const todayRecord = getStudentTodayAttendance('1');
      if (todayRecord) {
        const todayItem = {
          id: 999,
          number: 31,
          subject: todayRecord.subject || 'Physics',
          topic: "Today's Lecture (Live)",
          date: 'Today',
          time: todayRecord.time || '10:00 AM',
          faculty: todayRecord.teacher_name || 'Ms. Priya Shah',
          status: todayRecord.status
        };
        setAllLectures(prev => {
          const withoutToday = prev.filter(l => l.id !== 999);
          return [...withoutToday, todayItem];
        });
        setSelectedLecture(todayItem);
      }
    };

    checkTodayRecord();
    const handleUpdate = () => checkTodayRecord();
    window.addEventListener('aspire:attendance-updated', handleUpdate);
    return () => window.removeEventListener('aspire:attendance-updated', handleUpdate);
  }, []);

  const presentCount = allLectures.filter(l => l.status === 'Present').length;
  const absentCount = allLectures.length - presentCount;
  const attendanceRate = Math.round((presentCount / allLectures.length) * 100);

  const displayedLectures = allLectures.filter(l => {
    if (filter === 'present') return l.status === 'Present';
    if (filter === 'absent') return l.status === 'Absent';
    return true;
  });

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      {/* Screen Header */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)', margin: '0 0 4px 0' }}>
          Attendance History
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          Lecture-wise attendance breakdown for the past 30 lectures
        </p>
      </div>

      {/* KPI Overview Card */}
      <div className="card" style={{ padding: '16px', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Past 30 Lectures</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--brand-900)' }}>
                {attendanceRate}%
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                ({presentCount} / {mock30Lectures.length} Attended)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              background: '#ecfdf5',
              color: '#15803d',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              border: '1px solid #bbf7d0'
            }}>
              <Check size={12} strokeWidth={2.5} />
              {presentCount} Present
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              background: '#fef2f2',
              color: '#b91c1c',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              border: '1px solid #fecaca'
            }}>
              <X size={12} strokeWidth={2.5} />
              {absentCount} Absent
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'var(--surface-alt)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${attendanceRate}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #10b981, #059669)',
            borderRadius: '4px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { id: 'all', label: `All (${mock30Lectures.length})` },
          { id: 'present', label: `Present (${presentCount})` },
          { id: 'absent', label: `Absent (${absentCount})` }
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              border: filter === t.id ? '1px solid var(--brand-800)' : '1px solid var(--border)',
              background: filter === t.id ? 'var(--brand-800)' : 'var(--surface)',
              color: filter === t.id ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 30 Lecture Blocks Card */}
      <div className="card" style={{ padding: '16px', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
            Lecture Matrix (30 Lectures)
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Tap any block to inspect
          </span>
        </div>

        {/* 6-Column Responsive Blocks Grid (5 rows of 6 blocks = 30 blocks) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px'
        }}>
          {displayedLectures.map(lec => {
            const isPresent = lec.status === 'Present';
            const isSelected = selectedLecture?.id === lec.id;

            return (
              <button
                key={lec.id}
                type="button"
                onClick={() => setSelectedLecture(lec)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 2px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: isSelected 
                    ? '2px solid var(--brand-800)' 
                    : isPresent 
                    ? '1.5px solid #a7f3d0' 
                    : '1.5px solid #fecaca',
                  background: isPresent ? '#ecfdf5' : '#fef2f2',
                  boxShadow: isSelected ? '0 0 0 2px rgba(30, 58, 138, 0.2), 0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                title={`Lecture #${lec.number} (${lec.subject}) - ${lec.status}`}
              >
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  lineHeight: 1
                }}>
                  L{lec.number < 10 ? `0${lec.number}` : lec.number}
                </span>

                <div style={{
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isPresent ? '#10b981' : '#ef4444',
                  color: '#ffffff'
                }}>
                  {isPresent ? (
                    <Check size={12} strokeWidth={3} />
                  ) : (
                    <X size={12} strokeWidth={3} />
                  )}
                </div>

                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  marginTop: '3px',
                  color: isPresent ? '#15803d' : '#b91c1c'
                }}>
                  {isPresent ? 'P' : 'A'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border)',
          fontSize: '11px',
          fontWeight: 700
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              background: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#15803d',
              fontSize: '10px',
              fontWeight: 800
            }}>
              P
            </span>
            <span style={{ color: '#15803d' }}>Present ({presentCount} Lectures)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b91c1c',
              fontSize: '10px',
              fontWeight: 800
            }}>
              A
            </span>
            <span style={{ color: '#b91c1c' }}>Absent ({absentCount} Lectures)</span>
          </div>
        </div>
      </div>

      {/* Selected Lecture Details Card */}
      {selectedLecture && (
        <div className="card" style={{
          padding: '16px',
          background: 'var(--surface)',
          borderLeft: `4px solid ${selectedLecture.status === 'Present' ? '#10b981' : '#ef4444'}`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-500)', fontWeight: 800 }}>
                Lecture #{selectedLecture.number} • {selectedLecture.subject}
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: '2px 0 0 0' }}>
                {selectedLecture.topic}
              </h4>
            </div>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800,
              background: selectedLecture.status === 'Present' ? '#ecfdf5' : '#fef2f2',
              color: selectedLecture.status === 'Present' ? '#15803d' : '#b91c1c',
              border: `1px solid ${selectedLecture.status === 'Present' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {selectedLecture.status === 'Present' ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Verified Present</span>
                </>
              ) : (
                <>
                  <XCircle size={13} />
                  <span>Unexcused Absent</span>
                </>
              )}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border)',
            fontSize: '11px',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} color="var(--brand-800)" />
              <span>{selectedLecture.date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} color="var(--accent-500)" />
              <span>{selectedLecture.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} color="var(--text-secondary)" />
              <span>{selectedLecture.faculty}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={13} color="#8b5cf6" />
              <span>JEE (Mains + Adv) Batch</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
