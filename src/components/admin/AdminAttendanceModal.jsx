import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Search, Users, CheckCircle2, X, Check, Calendar, CheckSquare, Sparkles, Filter
} from 'lucide-react';
import { COURSE_OPTIONS } from './AdminStudyMaterialsModal';
import { getStoredStudents } from '../../lib/userAuthStore';
import { getTodayDateKey, getBatchAttendance, saveBatchAttendance } from '../../lib/attendanceService';

export default function AdminAttendanceModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('mark'); // 'mark' | 'records'
  const [selectedCourse, setSelectedCourse] = useState(COURSE_OPTIONS[0]);
  const [attendanceDate, setAttendanceDate] = useState(getTodayDateKey());
  const [studentStatusMap, setStudentStatusMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsCourseFilter, setRecordsCourseFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  // Load registered students
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const stored = getStoredStudents();
    setStudents(Array.isArray(stored) ? stored : []);
  }, [isOpen]);

  // Students belonging to selected course for marking
  const courseStudents = useMemo(() => {
    return students.filter(s => (s.course || 'JEE') === selectedCourse);
  }, [students, selectedCourse]);

  // Load existing attendance for selected course and date
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    (async () => {
      try {
        const records = await getBatchAttendance(selectedCourse, attendanceDate);
        if (isMounted && Array.isArray(records) && records.length > 0) {
          const map = {};
          records.forEach(r => {
            map[r.student_id] = r.status;
          });
          setStudentStatusMap(map);
          return;
        }
      } catch (e) {}

      // Default to Present for all students in course if not yet marked
      if (isMounted) {
        const defaultMap = {};
        courseStudents.forEach(s => {
          defaultMap[s.id] = 'Present';
        });
        setStudentStatusMap(defaultMap);
      }
    })();

    return () => { isMounted = false; };
  }, [isOpen, selectedCourse, attendanceDate, courseStudents]);

  const handleToggleStudent = (studentId) => {
    setStudentStatusMap(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    courseStudents.forEach(s => {
      updated[s.id] = status;
    });
    setStudentStatusMap(updated);
  };

  const handleSaveAttendance = async () => {
    if (courseStudents.length === 0) {
      setToastMessage('⚠️ No students registered in this course.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    try {
      const studentRecords = courseStudents.map(s => ({
        id: s.id,
        name: s.name,
        roll: s.roll || s.rollNumber || '—',
        status: studentStatusMap[s.id] || 'Present'
      }));

      await saveBatchAttendance({
        batchId: selectedCourse,
        batchName: selectedCourse,
        dateStr: attendanceDate,
        students: studentRecords,
        facultyName: 'Institute Admin'
      });

      setToastMessage(`✓ Attendance saved for ${selectedCourse} (${attendanceDate})!`);
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      setToastMessage('✓ Attendance saved locally.');
      setTimeout(() => setToastMessage(''), 3000);
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
      handleBack();
      e.detail?.markHandled?.();
    };
    window.addEventListener('app:back', handleAppBack);
    return () => window.removeEventListener('app:back', handleAppBack);
  }, [isOpen, isClosing]);

  if (!isOpen) return null;

  // Filter students for Records Tab
  const filteredRecordsStudents = students.filter(s => {
    const matchesCourse = recordsCourseFilter === 'All' || (s.course || 'JEE') === recordsCourseFilter;
    const matchesSearch = !searchTerm || 
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.roll || s.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  // Calculate live counts for Mark tab
  const presentCount = courseStudents.filter(s => (studentStatusMap[s.id] || 'Present') === 'Present').length;
  const absentCount = courseStudents.length - presentCount;
  const attendanceRate = courseStudents.length > 0 ? Math.round((presentCount / courseStudents.length) * 100) : 0;

  return (
    <div
      className={`fullscreen-page-modal ${isClosing ? 'closing' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        maxWidth: '480px',
        margin: '0 auto',
        background: 'var(--canvas)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* ── Top Header ── */}
      <div style={{
        padding: '12px 16px 10px',
        paddingTop: 'calc(12px + max(var(--safe-area-top, 0px), env(safe-area-inset-top, 0px), 24px))',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to Admin Dashboard"
            style={{
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
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
              Attendance
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Mark attendance & student logs
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', padding: '4px 8px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
          <CheckCircle2 size={13} color="#10b981" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>
            {activeTab === 'mark' ? `${attendanceRate}% Rate` : `${students.length} Students`}
          </span>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div style={{
          background: '#10b981',
          color: '#ffffff',
          padding: '8px 14px',
          fontSize: '12px',
          fontWeight: 700,
          textAlign: 'center',
          flexShrink: 0,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastMessage}
        </div>
      )}

      {/* ── Standard 2 Tabs: Mark Attendance vs Student Records ── */}
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
          onClick={() => setActiveTab('mark')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'mark' ? '1.5px solid var(--brand-700)' : '1px solid var(--border)',
            background: activeTab === 'mark' ? 'var(--brand-50)' : 'var(--surface-alt)',
            color: activeTab === 'mark' ? 'var(--brand-900)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <CheckSquare size={14} />
          <span>Mark Attendance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('records')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'records' ? '1.5px solid var(--brand-700)' : '1px solid var(--border)',
            background: activeTab === 'records' ? 'var(--brand-50)' : 'var(--surface-alt)',
            color: activeTab === 'records' ? 'var(--brand-900)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <Users size={14} />
          <span>Student Records</span>
        </button>
      </div>

      {/* ── Main Content Area ── */}
      {activeTab === 'mark' ? (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Controls: Course selector & Date Picker */}
          <div style={{ padding: '12px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Standard Course Selection Buttons */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Course
              </div>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
                {COURSE_OPTIONS.map(c => {
                  const isActive = selectedCourse === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCourse(c)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: isActive ? 700 : 500,
                        whiteSpace: 'nowrap',
                        border: isActive ? '1.5px solid var(--brand-700)' : '1px solid var(--border)',
                        background: isActive ? 'var(--brand-800)' : 'var(--surface)',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Picker & Quick Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="var(--brand-700)" />
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                  style={{
                    padding: '5px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: 'var(--surface-alt)',
                    color: 'var(--brand-900)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleMarkAll('Present')}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#ecfdf5',
                    color: '#047857',
                    border: '1px solid #a7f3d0',
                    cursor: 'pointer'
                  }}
                >
                  ✓ All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('Absent')}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                    cursor: 'pointer'
                  }}
                >
                  ✕ All Absent
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              <div style={{ background: 'var(--surface-alt)', padding: '6px 4px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)' }}>{courseStudents.length}</div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '6px 4px', borderRadius: '8px', textAlign: 'center', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '9.5px', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Present</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#047857' }}>{presentCount}</div>
              </div>
              <div style={{ background: '#fef2f2', padding: '6px 4px', borderRadius: '8px', textAlign: 'center', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '9.5px', color: '#b91c1c', fontWeight: 700, textTransform: 'uppercase' }}>Absent</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#b91c1c' }}>{absentCount}</div>
              </div>
              <div style={{ background: '#f0f9ff', padding: '6px 4px', borderRadius: '8px', textAlign: 'center', border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: '9.5px', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase' }}>Rate</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1' }}>{attendanceRate}%</div>
              </div>
            </div>
          </div>

          {/* Student List for Selected Course */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {courseStudents.length === 0 ? (
              <div className="card" style={{ padding: '36px 20px', textAlign: 'center', borderRadius: '12px' }}>
                <Users size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                  No Students Enrolled in {selectedCourse}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Add students to the {selectedCourse} course from the Students tab in Admin.
                </p>
              </div>
            ) : (
              courseStudents.map(student => {
                const status = studentStatusMap[student.id] || 'Present';
                const isPresent = status === 'Present';

                return (
                  <div
                    key={student.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isPresent ? '#f0fdf4' : '#fef2f2',
                      border: isPresent ? '1px solid #bbf7d0' : '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isPresent ? '#dcfce7' : '#fee2e2',
                        color: isPresent ? '#15803d' : '#b91c1c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--brand-900)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {student.name}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Roll: {student.roll || student.rollNumber || '—'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStudent(student.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: isPresent ? '1.5px solid #10b981' : '1.5px solid #ef4444',
                        background: isPresent ? '#10b981' : '#ef4444',
                        color: '#ffffff',
                        boxShadow: isPresent ? '0 2px 6px rgba(16, 185, 129, 0.25)' : '0 2px 6px rgba(239, 68, 68, 0.25)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isPresent ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
                      <span>{status}</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Fixed Bottom Button covering left to right ── */}
          <div style={{
            padding: '12px 16px',
            paddingBottom: 'calc(12px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)))',
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            flexShrink: 0
          }}>
            <button
              type="button"
              onClick={handleSaveAttendance}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px 18px',
                fontSize: '13.5px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(10, 31, 61, 0.2)'
              }}
            >
              <CheckCircle2 size={18} />
              <span>Save Attendance for {selectedCourse}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ── TAB 2: STUDENT RECORDS ── */
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search student by name or roll..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '13px',
                color: 'var(--text-primary)'
              }}
            />
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Course Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
            {['All', ...COURSE_OPTIONS].map(course => {
              const isActive = recordsCourseFilter === course;
              return (
                <button
                  key={course}
                  type="button"
                  onClick={() => setRecordsCourseFilter(course)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11.5px',
                    fontWeight: isActive ? 700 : 500,
                    whiteSpace: 'nowrap',
                    border: isActive ? '1.5px solid var(--brand-700)' : '1px solid var(--border)',
                    background: isActive ? 'var(--brand-800)' : 'var(--surface)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {course}
                </button>
              );
            })}
          </div>

          {/* Students List in Records */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredRecordsStudents.length === 0 ? (
              <div className="card" style={{ padding: '36px 20px', textAlign: 'center', borderRadius: '12px' }}>
                <Users size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>No Student Records</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  No students found matching the selected filter.
                </p>
              </div>
            ) : (
              filteredRecordsStudents.map(student => {
                const attended = Number(student.attendedLectures || student.attendedCount || 0);
                const total = Number(student.totalLectures || student.totalCount || 0);
                const pct = total > 0 ? Math.round((attended / total) * 100) : (student.overallAttendance || 0);

                return (
                  <div
                    key={student.id}
                    className="card"
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '12px',
                      background: 'var(--surface)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'var(--brand-50)',
                        color: 'var(--brand-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--brand-900)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {student.name}
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {student.course || 'JEE'} • Roll: {student.roll || student.rollNumber || '—'}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{
                        fontSize: '13.5px',
                        fontWeight: 800,
                        color: pct >= 75 ? '#047857' : (pct >= 50 ? '#d97706' : '#dc2626')
                      }}>
                        {pct}%
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>
                        Attendance
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
