import React, { useState, useEffect } from 'react';
import { mockBatches, mockBatchStudents } from '../../lib/mockData';
import { 
  Users, Clock, ChevronRight, ArrowLeft, Check, X, 
  Calendar, CheckCheck, Send, CheckCircle2, Search, 
  BookOpen, Award, FileText, Info, GraduationCap, 
  Layers, MapPin, UserCheck 
} from 'lucide-react';
import StudentDetailCardModal from './StudentDetailCardModal';

export default function MyBatches({ onAttendanceSubmit }) {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [subTab, setSubTab] = useState('attendance'); // 'attendance' | 'details'
  
  // Attendance Sub-category state
  const [studentsAttendance, setStudentsAttendance] = useState(mockBatchStudents);
  const [attendanceFilter, setAttendanceFilter] = useState('All'); // 'All' | 'Present' | 'Absent'
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTime, setSubmittedTime] = useState('');

  // Details Sub-category state
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  // Toggle student present / absent
  const handleToggleAttendance = (id) => {
    setStudentsAttendance(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          todayAttendance: s.todayAttendance === 'Present' ? 'Absent' : 'Present'
        };
      }
      return s;
    }));
    // If modified, allow re-submitting
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  // Mark all students present at once
  const handleMarkAllPresent = () => {
    setStudentsAttendance(prev => prev.map(s => ({
      ...s,
      todayAttendance: 'Present'
    })));
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  // Submit attendance for the batch
  const handleSubmitAttendance = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSubmittedTime(timeStr);
    setIsSubmitted(true);
    // Notify parent component so it can generate per-student notifications
    if (onAttendanceSubmit) {
      onAttendanceSubmit({
        batchName: selectedBatch?.name || 'Physics Batch',
        subject: selectedBatch?.subject || 'Physics',
        time: timeStr,
        students: studentsAttendance.map(s => ({
          id: s.id,
          name: s.name,
          status: s.todayAttendance
        }))
      });
    }
  };

  const presentCount = studentsAttendance.filter(s => s.todayAttendance === 'Present').length;
  const absentCount = studentsAttendance.length - presentCount;
  const attendanceRate = Math.round((presentCount / studentsAttendance.length) * 100);

  // Handle back navigation: first close student modal, then return to batches list
  useEffect(() => {
    const handleTeacherBack = (e) => {
      if (selectedStudentForModal) {
        setSelectedStudentForModal(null);
        e.detail?.markHandled();
        return;
      }
      if (selectedBatch) {
        setSelectedBatch(null);
        e.detail?.markHandled();
        return;
      }
    };
    window.addEventListener('app:back', handleTeacherBack);
    return () => window.removeEventListener('app:back', handleTeacherBack);
  }, [selectedStudentForModal, selectedBatch]);

  // Filtered attendance list
  const filteredAttendanceList = studentsAttendance.filter(s => {
    if (attendanceFilter === 'Present') return s.todayAttendance === 'Present';
    if (attendanceFilter === 'Absent') return s.todayAttendance === 'Absent';
    return true;
  });

  // Filtered students for Details directory
  const filteredDetailsStudents = studentsAttendance.filter(s => {
    if (!searchStudent) return true;
    const q = searchStudent.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q);
  });

  // ========================================================
  // VIEW 1: BATCHES LIST (WHEN NO BATCH IS SELECTED)
  // ========================================================
  if (!selectedBatch) {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)', margin: '0 0 4px 0' }}>
            My Batches
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Select a batch to mark attendance or view course & student details
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockBatches.map(batch => (
            <div
              key={batch.id}
              onClick={() => {
                setSelectedBatch(batch);
                setSubTab('attendance');
                setIsSubmitted(false);
              }}
              className="card card-hover"
              style={{ padding: '16px', cursor: 'pointer', transition: 'all 0.15s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>
                    {batch.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <Users size={14} />
                    <span>{batch.studentsCount} Students Enrolled</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-success">{batch.status}</span>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border)'
              }}>
                <Clock size={12} color="var(--accent-500)" />
                <span>Daily Class: {batch.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ========================================================
  // VIEW 2: SELECTED BATCH DETAIL WITH ATTENDANCE & DETAILS SUB-CATEGORIES
  // ========================================================
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      {/* Top Navigation Bar: Back Button & Batch Header */}
      <div>
        <button
          type="button"
          onClick={() => setSelectedBatch(null)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--brand-800)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '0 0 10px 0'
          }}
        >
          <ArrowLeft size={16} />
          <span>All Batches</span>
        </button>

        <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--brand-800)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-500)', fontWeight: 800 }}>
                {selectedBatch.subject} • {selectedBatch.room || 'Room 204'}
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--brand-900)', margin: '2px 0 0 0' }}>
                {selectedBatch.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <Clock size={12} />
                <span>{selectedBatch.time}</span>
              </div>
            </div>
            <span className="badge badge-success">
              {selectedBatch.status}
            </span>
          </div>
        </div>
      </div>

      {/* Two Sub-categories (Tabs): Attendance & Details */}
      <div className="tab-container" style={{ margin: 0 }}>
        <button
          type="button"
          onClick={() => setSubTab('attendance')}
          className={`tab-btn ${subTab === 'attendance' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <UserCheck size={16} />
          <span>Attendance</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('details')}
          className={`tab-btn ${subTab === 'details' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <Info size={16} />
          <span>Details</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB-CATEGORY 1: ATTENDANCE SECTION */}
      {/* ======================================================== */}
      {subTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Submission Success Banner */}
          {isSubmitted && (
            <div style={{
              padding: '12px 16px',
              background: '#ecfdf5',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: '#166534', display: 'block' }}>
                  Attendance Submitted Successfully!
                </strong>
                <span style={{ fontSize: '11px', color: '#15803d' }}>
                  {presentCount} Present, {absentCount} Absent • Recorded at {submittedTime}
                </span>
              </div>
            </div>
          )}

          {/* Date & Quick Action Controls */}
          <div className="card" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <Calendar size={13} color="var(--brand-800)" />
                <span>Today's Roll Call</span>
              </div>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>
                {presentCount} / {studentsAttendance.length} Present ({attendanceRate}%)
              </strong>
            </div>

            <button
              type="button"
              onClick={handleMarkAllPresent}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--brand-50)',
                color: 'var(--brand-800)',
                border: '1px solid var(--border)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <CheckCheck size={14} />
              <span>Mark All Present</span>
            </button>
          </div>

          {/* Filter Pills (All, Present, Absent) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'All', label: `All (${studentsAttendance.length})` },
              { id: 'Present', label: `Present (${presentCount})` },
              { id: 'Absent', label: `Absent (${absentCount})` }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setAttendanceFilter(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: attendanceFilter === f.id ? '1px solid var(--brand-800)' : '1px solid var(--border)',
                  background: attendanceFilter === f.id ? 'var(--brand-800)' : 'var(--surface)',
                  color: attendanceFilter === f.id ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Student Roll Call List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredAttendanceList.map(std => {
              const isPresent = std.todayAttendance === 'Present';
              return (
                <div
                  key={std.id}
                  className="card"
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderLeft: `3px solid ${isPresent ? '#10b981' : '#ef4444'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={std.avatar}
                      alt={std.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        border: '1.5px solid var(--border)'
                      }}
                    />
                    <div>
                      <h5 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {std.name}
                      </h5>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Roll #{std.roll}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Present / Absent Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleAttendance(std.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: isPresent ? '1px solid #bbf7d0' : '1px solid #fecaca',
                      background: isPresent ? '#ecfdf5' : '#fef2f2',
                      color: isPresent ? '#15803d' : '#b91c1c',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease'
                    }}
                    title="Click to toggle Present/Absent"
                  >
                    {isPresent ? <Check size={14} strokeWidth={2.5} /> : <X size={14} strokeWidth={2.5} />}
                    <span>{std.todayAttendance}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Submit Attendance Bar */}
          <div className="card" style={{ padding: '16px', marginTop: '6px', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Total Summary
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span style={{ color: '#16a34a' }}>{presentCount} Present</span> • <span style={{ color: '#dc2626' }}>{absentCount} Absent</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleSubmitAttendance}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '13px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Send size={16} />
              <span>{isSubmitted ? 'Update Submitted Attendance' : 'Submit Attendance'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-CATEGORY 2: DETAILS SECTION */}
      {/* ======================================================== */}
      {subTab === 'details' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* 1. Course Details Card */}
          <div className="card" style={{ padding: '18px', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--brand-50)', color: 'var(--brand-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                  Course & Batch Details
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Academic Overview & Syllabus
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '14px' }}>
              <div style={{ padding: '10px 12px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Course</span>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>
                  {selectedBatch.courseName || 'Std. 12 Science • JEE Advanced Physics'}
                </strong>
              </div>

              <div style={{ padding: '10px 12px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Course Code</span>
                <strong style={{ fontSize: '12px', color: 'var(--accent-500)', display: 'block', marginTop: '2px' }}>
                  {selectedBatch.courseCode || 'PHY-JEE-12A'}
                </strong>
              </div>

              <div style={{ padding: '10px 12px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Classroom</span>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>
                  {selectedBatch.room || 'Room 204'}
                </strong>
              </div>

              <div style={{ padding: '10px 12px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Faculty</span>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>
                  {selectedBatch.faculty || 'Ms. Priya Shah'}
                </strong>
              </div>
            </div>

            {/* Syllabus Progress Tracker */}
            <div style={{ padding: '12px', background: 'var(--surface-alt)', borderRadius: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Syllabus Progress
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-800)' }}>
                  {selectedBatch.syllabusProgress || 72}% Completed
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${selectedBatch.syllabusProgress || 72}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #1e3a8a, #0284c7)',
                  borderRadius: '4px'
                }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Current Unit: {selectedBatch.currentChapter || 'Mechanics & Newton\'s Laws of Motion'}
              </span>
            </div>
          </div>

          {/* 2. Students Directory & Cards */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: '0 0 2px 0' }}>
                  Enrolled Students ({studentsAttendance.length})
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                  Tap any student card to view performance & personal info
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Search student by name or roll..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Student Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredDetailsStudents.map(std => (
                <div
                  key={std.id}
                  onClick={() => setSelectedStudentForModal(std)}
                  className="card card-hover"
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={std.avatar}
                      alt={std.name}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '2px solid var(--border)'
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h5 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                          {std.name}
                        </h5>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                          #{std.roll}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#15803d',
                          background: '#ecfdf5',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {std.attendanceRate}% Attd
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#1e40af',
                          background: '#eff6ff',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {std.latestTest?.score || 88}/100 • Rank #{std.latestTest?.rank || 4}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Student Detailed Card Modal (Attendance, Latest Test & Personal Info) */}
      <StudentDetailCardModal
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        student={selectedStudentForModal}
        batch={selectedBatch}
      />
    </div>
  );
}
