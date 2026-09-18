import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, CheckCircle2, XCircle, Clock, Filter, Search, BookOpen, UserCheck, ChevronRight, Award } from 'lucide-react';
import { mockLectureAttendance } from '../../lib/mockData';

export default function FullAttendanceReportModal({ isOpen, onClose }) {
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Present' | 'Absent'
  const [subjectFilter, setSubjectFilter] = useState('All'); // 'All' | 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology'
  const [searchQuery, setSearchQuery] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setSelectedLecture(null);
    }, 380);
  };

  const lectures = mockLectureAttendance;
  const totalLectures = lectures.length;
  const presentCount = lectures.filter(l => l.status === 'Present').length;
  const absentCount = lectures.filter(l => l.status === 'Absent').length;
  const attendancePercentage = Math.round((presentCount / totalLectures) * 100);

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  const filteredLectures = lectures.filter(item => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || item.subject.toLowerCase() === subjectFilter.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      item.topic.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query) ||
      item.faculty.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query);

    return matchesStatus && matchesSubject && matchesSearch;
  });

  const getSubjectColor = (subject) => {
    switch (subject.toLowerCase()) {
      case 'physics': return { color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' };
      case 'chemistry': return { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' };
      case 'mathematics': return { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' };
      case 'biology': return { color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' };
      default: return { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' };
    }
  };

  const modalContent = (
    <div
      className={`modal-backdrop-05s ${isClosing ? 'closing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className={`modal-sheet-05s ${isClosing ? 'closing' : ''}`}
        style={{
          maxHeight: '92vh',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--canvas)'
        }}
      >
        {/* Native Mobile Drag Handle */}
        <div className="sheet-drag-handle" />

        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px 14px 20px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--brand-800) 0%, var(--accent-500) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
            }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)', margin: 0, lineHeight: 1.2 }}>
                Full Attendance Report
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Last 30 Latest Lectures (Newest to Oldest)
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'var(--surface-alt)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
            title="Close Report"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px'
          }}>
            <div className="card" style={{ padding: '12px 10px', textAlign: 'center', background: 'var(--surface)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Total Recorded
              </span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-900)', marginTop: '2px' }}>
                {totalLectures}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--brand-600)', fontWeight: 600 }}>
                Lectures
              </span>
            </div>

            <div className="card" style={{ padding: '12px 10px', textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <span style={{ fontSize: '10px', color: '#047857', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Present
              </span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#065f46', marginTop: '2px' }}>
                {presentCount}
              </div>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                {attendancePercentage}% Rate
              </span>
            </div>

            <div className="card" style={{ padding: '12px 10px', textAlign: 'center', background: '#fef2f2', border: '1px solid #fecaca' }}>
              <span style={{ fontSize: '10px', color: '#b91c1c', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Absent
              </span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#991b1b', marginTop: '2px' }}>
                {absentCount}
              </div>
              <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>
                {100 - attendancePercentage}% Missed
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search topic, subject or faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Present', 'Absent'].map(tab => {
              const active = statusFilter === tab;
              const count = tab === 'All' ? totalLectures : tab === 'Present' ? presentCount : absentCount;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: active ? 'none' : '1px solid var(--border)',
                    background: active ? 'var(--brand-800)' : 'var(--surface)',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: active ? '0 2px 8px rgba(30, 58, 138, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab === 'Present' && <CheckCircle2 size={14} color={active ? '#ffffff' : '#10b981'} />}
                  {tab === 'Absent' && <XCircle size={14} color={active ? '#ffffff' : '#ef4444'} />}
                  <span>{tab}</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: active ? 'rgba(255,255,255,0.2)' : 'var(--surface-alt)',
                    color: active ? '#ffffff' : 'var(--text-muted)'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subject Pills Slider */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {subjects.map(sub => {
              const active = subjectFilter === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSubjectFilter(sub)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: active ? '1px solid var(--accent-500)' : '1px solid var(--border)',
                    background: active ? 'var(--accent-50)' : 'var(--surface)',
                    color: active ? 'var(--accent-500)' : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Lecture List Header Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredLectures.length} of 30 lectures
            </span>
            <span style={{ fontSize: '11px', color: 'var(--brand-800)', fontWeight: 700 }}>
              Latest First ↓
            </span>
          </div>

          {/* Lectures Cards List (Strictly Newest to Oldest) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredLectures.length === 0 ? (
              <div className="card" style={{ padding: '32px 20px', textAlign: 'center' }}>
                <Calendar size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.5 }} />
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>No lectures found</h5>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  No attendance records matched your current filters.
                </p>
                <button
                  onClick={() => { setStatusFilter('All'); setSubjectFilter('All'); setSearchQuery(''); }}
                  style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--brand-800)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredLectures.map((lec) => {
                const subColor = getSubjectColor(lec.subject);
                const isPresent = lec.status === 'Present';
                const isSelected = selectedLecture?.id === lec.id;

                return (
                  <div
                    key={lec.id}
                    onClick={() => setSelectedLecture(isSelected ? null : lec)}
                    className="card card-hover"
                    style={{
                      padding: '14px',
                      background: 'var(--surface)',
                      borderLeft: isPresent ? '4px solid #10b981' : '4px solid #ef4444',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        {/* Subject Chip & Lecture Number */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: subColor.bg,
                            color: subColor.color,
                            border: `1px solid ${subColor.border}`
                          }}>
                            {lec.subject}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Lecture #{lec.lectureNumber}
                          </span>
                        </div>

                        {/* Topic Title */}
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-900)', margin: '4px 0 6px 0', lineHeight: 1.3 }}>
                          {lec.topic}
                        </h4>

                        {/* Meta: Date, Time, Faculty */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} color="var(--text-muted)" />
                            <strong>{lec.date}</strong>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} color="var(--text-muted)" />
                            {lec.time}
                          </span>
                        </div>
                      </div>

                      {/* Status Pill on Right */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: isPresent ? '#ecfdf5' : '#fef2f2',
                          color: isPresent ? '#047857' : '#b91c1c',
                          border: isPresent ? '1px solid #a7f3d0' : '1px solid #fecaca'
                        }}>
                          {isPresent ? <CheckCircle2 size={13} color="#059669" /> : <XCircle size={13} color="#dc2626" />}
                          {lec.status}
                        </span>

                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
                          {isPresent ? `At ${lec.recordedAt}` : 'Missed'}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Lecture Details on Tap */}
                    {isSelected && (
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border)',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <UserCheck size={13} color="var(--brand-800)" />
                          Faculty: <strong>{lec.faculty}</strong>
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: isPresent ? '#059669' : '#dc2626'
                        }}>
                          {isPresent ? 'Verified In-Person Roll Call' : 'Unexcused Absence Recorded'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sheet Footer */}
        <div style={{
          padding: '12px 20px',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="var(--success)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-900)' }}>
              Overall: {attendancePercentage}% Attendance
            </span>
          </div>
          <button
            onClick={handleClose}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '12px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
