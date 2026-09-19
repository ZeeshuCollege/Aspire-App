import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, UserCheck, Users, BookOpen, CheckSquare, 
  Calendar, ChevronRight, Filter, AlertCircle, CheckCircle2, 
  Clock, TrendingUp, ChevronDown, ChevronUp, X, Check, Lock, Shield
} from 'lucide-react';
import { mockBatchStudents, mockLectureAttendance } from '../../lib/mockData';
import { COURSE_OPTIONS } from './AdminStudyMaterialsModal';
import { updateAttendanceByAdmin } from '../../lib/attendanceService';

const COURSE_ATTENDANCE_DATA = [
  { course: 'Std 9th', code: 'STD-9', totalStudents: 28, presentToday: 24, absentToday: 4, rate: 86, batch: 'Class 9 Foundation', trend: '+1.5%' },
  { course: 'Std 10th', code: 'STD-10', totalStudents: 32, presentToday: 29, absentToday: 3, rate: 90, batch: 'Class 10 Board', trend: '+2.1%' },
  { course: '11th Science', code: 'SCI-11', totalStudents: 36, presentToday: 31, absentToday: 5, rate: 87, batch: 'Class 11 - A', trend: '-0.8%' },
  { course: '12th Science', code: 'SCI-12', totalStudents: 40, presentToday: 36, absentToday: 4, rate: 89, batch: 'Class 12 - Science', trend: '+3.2%' },
  { course: 'NEET', code: 'NEET', totalStudents: 38, presentToday: 35, absentToday: 3, rate: 92, batch: 'NEET 12 - B', trend: '+4.0%' },
  { course: 'JEE (Mains + Adv)', code: 'JEE', totalStudents: 42, presentToday: 40, absentToday: 2, rate: 94, batch: 'JEE 12 - A', trend: '+1.8%' },
  { course: 'MHT-CET', code: 'MHT-CET', totalStudents: 32, presentToday: 28, absentToday: 4, rate: 88, batch: 'CET Mastery', trend: '+0.5%' }
];

const SUBJECT_ATTENDANCE_DATA = [
  { subject: 'Physics', code: 'PHY', faculty: 'Ms. Priya Shah', rate: 92, lecturesDone: 36, activeBatches: 'JEE 12-A, NEET 12-B, Class 11-A', health: 'Excellent' },
  { subject: 'Mathematics', code: 'MATH', faculty: 'Ms. Neha Kapoor', rate: 89, lecturesDone: 34, activeBatches: 'JEE 12-A, Class 11-A, Class 10-A', health: 'Good' },
  { subject: 'Chemistry', code: 'CHEM', faculty: 'Mr. Rahul Verma', rate: 88, lecturesDone: 32, activeBatches: 'NEET 12-B, Class 10-A', health: 'Good' },
  { subject: 'Biology', code: 'BIO', faculty: 'Mr. Suresh Iyer', rate: 93, lecturesDone: 30, activeBatches: 'NEET 12-B', health: 'Excellent' },
  { subject: 'English', code: 'ENG', faculty: 'Ms. Priya Shah', rate: 85, lecturesDone: 24, activeBatches: 'Std 9th, 10th, 11th, 12th', health: 'Average' },
  { subject: 'Science (Foundation)', code: 'SCI', faculty: 'Mr. Rahul Verma', rate: 90, lecturesDone: 28, activeBatches: 'Class 10-A, Class 9-A', health: 'Good' }
];

export default function AdminAttendanceModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'course' | 'subject'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All'); // 'All' | 'High' | 'Low'
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [studentsList, setStudentsList] = useState(mockBatchStudents);

  const [isClosing, setIsClosing] = useState(false);

  const handleAdminToggleStatus = async (studentId) => {
    const student = studentsList.find(s => s.id === studentId);
    if (!student) return;

    const newStatus = student.todayAttendance === 'Present' ? 'Absent' : 'Present';

    setStudentsList(prev => prev.map(s => {
      if (s.id === studentId) {
        const delta = newStatus === 'Present' ? 1 : -1;
        const newAttended = Math.max(0, s.attendedCount + delta);
        return {
          ...s,
          todayAttendance: newStatus,
          adminOverridden: true,
          attendedCount: newAttended,
          attendanceRate: Math.round((newAttended / s.totalCount) * 100)
        };
      }
      return s;
    }));

    try {
      await updateAttendanceByAdmin({
        studentId,
        newStatus,
        adminName: 'Institute Admin'
      });
    } catch (err) {
      console.error('Failed to update attendance by admin:', err);
    }
  };

  const handleBack = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 320);
  };

  // Android back button integration
  useEffect(() => {
    if (!isOpen) return;
    const handleAppBack = (e) => {
      if (expandedStudentId) {
        setExpandedStudentId(null);
        e.detail?.markHandled();
      } else {
        handleBack();
        e.detail?.markHandled();
      }
    };
    window.addEventListener('app:back', handleAppBack);
    return () => window.removeEventListener('app:back', handleAppBack);
  }, [isOpen, expandedStudentId, isClosing]);

  if (!isOpen) return null;

  // Filter students
  const filteredStudents = studentsList.filter(std => {
    const matchesSearch = !searchTerm ||
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (std.roll && std.roll.includes(searchTerm));
    const matchesCourse = selectedCourse === 'All' || std.course === selectedCourse;
    const matchesFilter = selectedFilter === 'All' ||
      (selectedFilter === 'High' && std.attendanceRate >= 90) ||
      (selectedFilter === 'Low' && std.attendanceRate < 80);
    return matchesSearch && matchesCourse && matchesFilter;
  });

  return (
    <div className={`fullscreen-page-modal ${isClosing ? 'closing' : ''}`}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to Admin Dashboard"
            style={{
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-900)'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
              Attendance Center
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Student, course & subject analytics
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', padding: '4px 8px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
          <CheckCircle2 size={13} color="#10b981" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>89% Avg</span>
        </div>
      </div>

      {/* 3 Main View Tabs */}
      <div style={{
        display: 'flex',
        padding: '8px 16px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        gap: '8px',
        flexShrink: 0
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          style={{
            flex: 1,
            padding: '9px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'student' ? '1.5px solid #0ea5e9' : '1px solid var(--border)',
            background: activeTab === 'student' ? '#f0f9ff' : 'var(--surface-alt)',
            color: activeTab === 'student' ? '#0369a1' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <Users size={14} />
          <span>Student-wise</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('course')}
          style={{
            flex: 1,
            padding: '9px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'course' ? '1.5px solid #8b5cf6' : '1px solid var(--border)',
            background: activeTab === 'course' ? '#f5f3ff' : 'var(--surface-alt)',
            color: activeTab === 'course' ? '#6d28d9' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <BookOpen size={14} />
          <span>Course-wise</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subject')}
          style={{
            flex: 1,
            padding: '9px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'subject' ? '1.5px solid #10b981' : '1px solid var(--border)',
            background: activeTab === 'subject' ? '#ecfdf5' : 'var(--surface-alt)',
            color: activeTab === 'subject' ? '#047857' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <CheckSquare size={14} />
          <span>Subject-wise</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* ====================================================================
            TAB 1: STUDENT-WISE ATTENDANCE
           ==================================================================== */}
        {activeTab === 'student' && (
          <>
            {/* Search & Course Filters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search student by name or roll #..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    fontSize: '13px'
                  }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Course pills */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                {['All', ...COURSE_OPTIONS].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCourse(c)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      border: selectedCourse === c ? '1px solid #0ea5e9' : '1px solid var(--border)',
                      background: selectedCourse === c ? '#e0f2fe' : 'var(--surface)',
                      color: selectedCourse === c ? '#0284c7' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendance Compliance Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div className="card" style={{ padding: '10px', textAlign: 'center', background: '#f0fdf4' }}>
                <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700 }}>Present Today</span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#15803d', margin: '2px 0 0 0' }}>
                  {studentsList.filter(s => s.todayAttendance === 'Present').length}
                </h4>
              </div>
              <div className="card" style={{ padding: '10px', textAlign: 'center', background: '#fef2f2' }}>
                <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 700 }}>Absent Today</span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#b91c1c', margin: '2px 0 0 0' }}>
                  {studentsList.filter(s => s.todayAttendance === 'Absent').length}
                </h4>
              </div>
              <div className="card" style={{ padding: '10px', textAlign: 'center', background: '#eff6ff' }}>
                <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 700 }}>Institute Rate</span>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1d4ed8', margin: '2px 0 0 0' }}>
                  {Math.round((studentsList.filter(s => s.todayAttendance === 'Present').length / (studentsList.length || 1)) * 100)}%
                </h4>
              </div>
            </div>

            {/* Students List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredStudents.map(std => {
                const isExpanded = expandedStudentId === std.id;
                const isHigh = std.attendanceRate >= 85;
                const isLow = std.attendanceRate < 75;

                return (
                  <div
                    key={std.id}
                    className="card"
                    style={{
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => setExpandedStudentId(isExpanded ? null : std.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={std.avatar}
                          alt={std.name}
                          style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover', border: '1.5px solid var(--border)' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                            {std.name}
                          </h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Roll #{std.roll} • {std.course}
                          </span>
                        </div>
                      </div>

                      {/* Attendance % badge */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          background: isHigh ? '#dcfce7' : isLow ? '#fee2e2' : '#fef3c7',
                          color: isHigh ? '#15803d' : isLow ? '#b91c1c' : '#b45309'
                        }}>
                          {std.attendanceRate}%
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                          {std.attendedCount}/{std.totalCount} Attended
                        </span>
                      </div>
                    </div>

                    {/* Today's Status & Expand Arrow (Admin can toggle status) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Today:</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdminToggleStatus(std.id);
                          }}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: std.todayAttendance === 'Present' ? '1px solid #bbf7d0' : '1px solid #fecaca',
                            background: std.todayAttendance === 'Present' ? '#ecfdf5' : '#fef2f2',
                            color: std.todayAttendance === 'Present' ? '#15803d' : '#b91c1c',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                          }}
                          title="Click to override / change attendance as Admin"
                        >
                          {std.todayAttendance === 'Present' ? <Check size={12} strokeWidth={2.5} /> : <X size={12} strokeWidth={2.5} />}
                          <span>{std.todayAttendance}</span>
                          <span style={{
                            fontSize: '9px',
                            background: 'rgba(0,0,0,0.06)',
                            padding: '1px 4px',
                            borderRadius: '4px',
                            marginLeft: '2px',
                            color: 'var(--text-secondary)'
                          }}>
                            Change
                          </span>
                        </button>
                        {std.adminOverridden && (
                          <span style={{ fontSize: '9px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                            Admin Edited
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {isExpanded ? (
                          <><span>Hide Log</span> <ChevronUp size={14} /></>
                        ) : (
                          <><span>Past Lectures</span> <ChevronDown size={14} /></>
                        )}
                      </span>
                    </div>

                    {/* Expanded 5-lecture log */}
                    {isExpanded && (
                      <div style={{
                        marginTop: '4px',
                        padding: '10px 12px',
                        background: 'var(--surface-alt)',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Recent Lecture History
                        </span>
                        {mockLectureAttendance.slice(0, 5).map((lec, idx) => (
                          <div key={lec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', padding: '4px 0', borderBottom: idx < 4 ? '1px solid var(--border)' : 'none' }}>
                            <div>
                              <strong style={{ color: 'var(--brand-900)' }}>{lec.subject}</strong>: {lec.topic}
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{lec.date} • {lec.time}</div>
                            </div>
                            <span className={`badge ${lec.status === 'Present' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '10px' }}>
                              {lec.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ====================================================================
            TAB 2: COURSE-WISE ATTENDANCE
           ==================================================================== */}
        {activeTab === 'course' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
              Course & Stream Overview ({COURSE_ATTENDANCE_DATA.length} Programs)
            </div>

            {COURSE_ATTENDANCE_DATA.map(c => {
              const isHigh = c.rate >= 90;
              return (
                <div key={c.course} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                        {c.course}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Batch: {c.batch} • Code: {c.code}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: isHigh ? '#16a34a' : '#2563eb'
                      }}>
                        {c.rate}%
                      </span>
                      <span style={{ fontSize: '10px', color: '#16a34a', display: 'block', fontWeight: 700 }}>
                        {c.trend} vs last wk
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${c.rate}%`,
                      height: '100%',
                      background: isHigh ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)',
                      borderRadius: '999px'
                    }} />
                  </div>

                  {/* Metrics grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', paddingTop: '4px' }}>
                    <div style={{ padding: '8px', background: 'var(--surface-alt)', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Total Enrolled</span>
                      <strong style={{ fontSize: '13px', color: 'var(--brand-900)' }}>{c.totalStudents}</strong>
                    </div>
                    <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#15803d', display: 'block' }}>Present Today</span>
                      <strong style={{ fontSize: '13px', color: '#16a34a' }}>{c.presentToday}</strong>
                    </div>
                    <div style={{ padding: '8px', background: '#fef2f2', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#b91c1c', display: 'block' }}>Absent Today</span>
                      <strong style={{ fontSize: '13px', color: '#ef4444' }}>{c.absentToday}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ====================================================================
            TAB 3: SUBJECT-WISE ATTENDANCE
           ==================================================================== */}
        {activeTab === 'subject' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
              Subject & Department Analytics
            </div>

            {SUBJECT_ATTENDANCE_DATA.map(s => (
              <div key={s.subject} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                      {s.subject}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Faculty: <strong style={{ color: 'var(--brand-800)' }}>{s.faculty}</strong>
                    </span>
                  </div>

                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    background: s.rate >= 90 ? '#dcfce7' : '#eff6ff',
                    color: s.rate >= 90 ? '#15803d' : '#1d4ed8'
                  }}>
                    {s.rate}% Avg
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${s.rate}%`,
                    height: '100%',
                    background: s.rate >= 90 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)',
                    borderRadius: '999px'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                  <span>Lectures Conducted: <strong>{s.lecturesDone}</strong></span>
                  <span>Health: <strong style={{ color: s.health === 'Excellent' ? '#16a34a' : '#2563eb' }}>{s.health}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
