import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Plus, Search, Calendar, Clock, 
  User, Trash2, CheckCircle2, AlertCircle, Filter, BookOpen, ChevronRight, X
} from 'lucide-react';
import { COURSE_OPTIONS, SUBJECT_OPTIONS } from './AdminStudyMaterialsModal';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const FACULTY_OPTIONS = [
  'Ms. Priya Shah (Physics)',
  'Mr. Rahul Verma (Chemistry)',
  'Ms. Neha Kapoor (Mathematics)',
  'Mr. Suresh Iyer (Biology)',
  'Mrs. Anita Desai (English)',
  'Mr. Amit Kulkarni (Science)'
];

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

const INITIAL_TIMETABLE = [
  {
    id: 'lec-1',
    course: 'JEE (Mains + Adv)',
    subject: 'Physics (JEE)',
    day: 'Mon',
    time: '10:00 AM - 11:30 AM',
    faculty: 'Ms. Priya Shah (Physics)',
    status: 'Ongoing'
  },
  {
    id: 'lec-2',
    course: 'JEE (Mains + Adv)',
    subject: 'Maths (JEE)',
    day: 'Mon',
    time: '11:45 AM - 01:15 PM',
    faculty: 'Ms. Neha Kapoor (Mathematics)',
    status: 'Upcoming'
  },
  {
    id: 'lec-3',
    course: 'NEET',
    subject: 'Chemistry (NEET)',
    day: 'Mon',
    time: '02:00 PM - 03:30 PM',
    faculty: 'Mr. Rahul Verma (Chemistry)',
    status: 'Upcoming'
  },
  {
    id: 'lec-4',
    course: 'NEET',
    subject: 'Biology (NEET)',
    day: 'Mon',
    time: '03:45 PM - 05:15 PM',
    faculty: 'Mr. Suresh Iyer (Biology)',
    status: 'Upcoming'
  },
  {
    id: 'lec-5',
    course: '12th Science',
    subject: 'English (12th)',
    day: 'Tue',
    time: '09:00 AM - 10:30 AM',
    faculty: 'Mrs. Anita Desai (English)',
    status: 'Upcoming'
  },
  {
    id: 'lec-6',
    course: '11th Science',
    subject: 'Physics (JEE)',
    day: 'Tue',
    time: '11:00 AM - 12:30 PM',
    faculty: 'Ms. Priya Shah (Physics)',
    status: 'Upcoming'
  },
  {
    id: 'lec-7',
    course: 'MHT-CET',
    subject: 'Chemistry (JEE)',
    day: 'Wed',
    time: '10:00 AM - 11:30 AM',
    faculty: 'Mr. Rahul Verma (Chemistry)',
    status: 'Upcoming'
  },
  {
    id: 'lec-8',
    course: 'Std 10th',
    subject: 'Science (10th)',
    day: 'Wed',
    time: '02:00 PM - 03:30 PM',
    faculty: 'Mr. Amit Kulkarni (Science)',
    status: 'Upcoming'
  },
  {
    id: 'lec-9',
    course: 'Std 10th',
    subject: 'Maths (10th)',
    day: 'Thu',
    time: '03:45 PM - 05:15 PM',
    faculty: 'Ms. Neha Kapoor (Mathematics)',
    status: 'Upcoming'
  },
  {
    id: 'lec-10',
    course: 'Std 9th',
    subject: 'Science (9th)',
    day: 'Fri',
    time: '09:00 AM - 10:30 AM',
    faculty: 'Mr. Amit Kulkarni (Science)',
    status: 'Upcoming'
  },
  {
    id: 'lec-11',
    course: 'Std 9th',
    subject: 'Maths (9th)',
    day: 'Fri',
    time: '10:45 AM - 12:15 PM',
    faculty: 'Ms. Neha Kapoor (Mathematics)',
    status: 'Upcoming'
  },
  {
    id: 'lec-12',
    course: 'JEE (Mains + Adv)',
    subject: 'Physics (JEE)',
    day: 'Sat',
    time: '09:00 AM - 12:00 PM',
    faculty: 'Ms. Priya Shah (Physics)',
    status: 'Upcoming'
  }
];

// Reusable Drum / Alarm Wheel Scroll Component
function AlarmScrollWheel({ items, value, onChange }) {
  const containerRef = useRef(null);
  const isInternalScroll = useRef(false);

  // Position initial value in center
  useEffect(() => {
    const idx = items.indexOf(value);
    if (idx !== -1 && containerRef.current) {
      isInternalScroll.current = true;
      containerRef.current.scrollTop = idx * 36;
      const timer = setTimeout(() => {
        isInternalScroll.current = false;
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [value, items]);

  const handleScroll = (e) => {
    if (isInternalScroll.current) return;
    const top = e.target.scrollTop;
    const idx = Math.round(top / 36);
    if (idx >= 0 && idx < items.length) {
      if (items[idx] !== value) {
        onChange(items[idx]);
      }
    }
  };

  const handleSelect = (item, idx) => {
    onChange(item);
    if (containerRef.current) {
      isInternalScroll.current = true;
      containerRef.current.scrollTo({ top: idx * 36, behavior: 'smooth' });
      setTimeout(() => {
        isInternalScroll.current = false;
      }, 200);
    }
  };

  return (
    <div style={{ position: 'relative', width: '42px', height: '108px', overflow: 'hidden' }}>
      {/* Top & Bottom Depth Shadows */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '36px',
        background: 'linear-gradient(to bottom, var(--surface) 20%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 2
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '36px',
        background: 'linear-gradient(to top, var(--surface) 20%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Center Alarm Wheel Lens / Selection Frame */}
      <div style={{
        position: 'absolute',
        top: '36px',
        left: '2px',
        right: '2px',
        height: '36px',
        background: 'rgba(14, 165, 233, 0.12)',
        borderRadius: '7px',
        border: '1.5px solid #0ea5e9',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Scrollable List */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: '108px',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          paddingTop: '36px',
          paddingBottom: '36px',
          boxSizing: 'border-box',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {items.map((item, idx) => {
          const isSelected = item === value;
          return (
            <div
              key={item}
              onClick={() => handleSelect(item, idx)}
              style={{
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'center',
                fontSize: isSelected ? '15px' : '13px',
                fontWeight: isSelected ? 800 : 500,
                color: isSelected ? '#0284c7' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.12s ease',
                userSelect: 'none'
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// AM / PM Toggle Component
function PeriodSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'center' }}>
      <button
        type="button"
        onClick={() => onChange('AM')}
        style={{
          padding: '4px 6px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: 800,
          border: value === 'AM' ? '1.5px solid #0ea5e9' : '1px solid var(--border)',
          background: value === 'AM' ? '#0ea5e9' : 'var(--surface-alt)',
          color: value === 'AM' ? '#ffffff' : 'var(--text-secondary)',
          cursor: 'pointer',
          lineHeight: 1,
          transition: 'all 0.15s ease'
        }}
      >
        AM
      </button>
      <button
        type="button"
        onClick={() => onChange('PM')}
        style={{
          padding: '4px 6px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: 800,
          border: value === 'PM' ? '1.5px solid #0ea5e9' : '1px solid var(--border)',
          background: value === 'PM' ? '#0ea5e9' : 'var(--surface-alt)',
          color: value === 'PM' ? '#ffffff' : 'var(--text-secondary)',
          cursor: 'pointer',
          lineHeight: 1,
          transition: 'all 0.15s ease'
        }}
      >
        PM
      </button>
    </div>
  );
}

export default function AdminTimetableModal({ isOpen, onClose }) {
  // Load from localStorage or default, and clean up any old specialist/room text
  const [timetable, setTimetable] = useState(() => {
    try {
      const saved = localStorage.getItem('aspire_admin_timetable');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(lec => ({
          ...lec,
          faculty: (lec.faculty || 'Ms. Priya Shah (Physics)')
            .replace(' (Physics Specialist)', ' (Physics)')
            .replace(' (Chemistry Specialist)', ' (Chemistry)')
            .replace(' (Mathematics Specialist)', ' (Mathematics)')
            .replace(' (Biology Specialist)', ' (Biology)')
        }));
      }
    } catch (e) {}
    return INITIAL_TIMETABLE;
  });

  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Form states for Add Lecture
  const [newCourse, setNewCourse] = useState(COURSE_OPTIONS[0]);
  const [newSubject, setNewSubject] = useState(SUBJECT_OPTIONS[0]);
  const [newDay, setNewDay] = useState('Mon');
  
  // From time wheel states
  const [fromHour, setFromHour] = useState('10');
  const [fromMinute, setFromMinute] = useState('00');
  const [fromPeriod, setFromPeriod] = useState('AM');

  // Till time wheel states
  const [tillHour, setTillHour] = useState('11');
  const [tillMinute, setTillMinute] = useState('30');
  const [tillPeriod, setTillPeriod] = useState('AM');

  const [newFaculty, setNewFaculty] = useState(FACULTY_OPTIONS[0]);

  // Animation states for smooth reverse exit
  const [isClosing, setIsClosing] = useState(false);
  const [isAddClosing, setIsAddClosing] = useState(false);

  // Save to localStorage whenever timetable updates
  useEffect(() => {
    try {
      localStorage.setItem('aspire_admin_timetable', JSON.stringify(timetable));
    } catch (e) {}
  }, [timetable]);

  const handleBack = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 320);
  };

  const handleCloseAddModal = () => {
    if (isAddClosing) return;
    setIsAddClosing(true);
    setTimeout(() => {
      setIsAddClosing(false);
      setShowAddModal(false);
    }, 320);
  };

  // Android back button integration
  useEffect(() => {
    if (!isOpen) return;
    const handleAppBack = (e) => {
      if (showAddModal) {
        handleCloseAddModal();
        e.detail?.markHandled();
      } else {
        handleBack();
        e.detail?.markHandled();
      }
    };
    window.addEventListener('app:back', handleAppBack);
    return () => window.removeEventListener('app:back', handleAppBack);
  }, [isOpen, showAddModal, isClosing, isAddClosing]);

  if (!isOpen) return null;

  const handleAddLecture = (e) => {
    e.preventDefault();
    if (!newSubject) return;

    const formattedTime = `${fromHour}:${fromMinute} ${fromPeriod} - ${tillHour}:${tillMinute} ${tillPeriod}`;

    const newLec = {
      id: `lec-${Date.now()}`,
      course: newCourse,
      subject: newSubject,
      day: newDay,
      time: formattedTime,
      faculty: newFaculty,
      status: 'Upcoming'
    };

    setTimetable(prev => [newLec, ...prev]);
    setToastMessage(`✓ Added ${newLec.subject} (${newLec.day}) to Timetable`);
    setTimeout(() => setToastMessage(''), 3000);
    handleCloseAddModal();
  };

  const handleDeleteLecture = (id, subject, day) => {
    setDeletingId(id);
    setTimeout(() => {
      setTimetable(prev => prev.filter(l => l.id !== id));
      setDeletingId(null);
      setToastMessage(`✓ Removed ${subject} (${day}) from Timetable`);
      setTimeout(() => setToastMessage(''), 3000);
    }, 250);
  };

  const filteredLectures = timetable.filter(l => {
    const matchesCourse = selectedCourse === 'All' || l.course === selectedCourse;
    const matchesDay = selectedDay === 'All' || l.day === selectedDay;
    const matchesSearch = !searchTerm || 
      l.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesDay && matchesSearch;
  });

  return (
    <div className={`fullscreen-page-modal ${isClosing ? 'closing' : ''}`}>
      {/* Top Header */}
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
              Timetable Management
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Add, delete &amp; schedule class lectures
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
          }}
        >
          <Plus size={15} />
          <span>Add Lecture</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          background: '#10b981',
          color: '#ffffff',
          padding: '10px 16px',
          fontSize: '12px',
          fontWeight: 700,
          textAlign: 'center',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Sticky Filters & Search Header */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--canvas)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flexShrink: 0
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by subject or faculty..."
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

        {/* Course Filter Pills */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Class / Course
          </div>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {['All', ...COURSE_OPTIONS].map(course => (
              <button
                key={course}
                type="button"
                onClick={() => setSelectedCourse(course)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: selectedCourse === course ? '1px solid #0ea5e9' : '1px solid var(--border)',
                  background: selectedCourse === course ? '#e0f2fe' : 'var(--surface)',
                  color: selectedCourse === course ? '#0284c7' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Day Filter Pills */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Day of Week
          </div>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {['All', ...DAYS_OF_WEEK].map(day => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: selectedDay === day ? '1px solid #8b5cf6' : '1px solid var(--border)',
                  background: selectedDay === day ? '#f5f3ff' : 'var(--surface)',
                  color: selectedDay === day ? '#7c3aed' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lectures List Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
            Showing {filteredLectures.length} scheduled lectures
          </span>
          {(selectedCourse !== 'All' || selectedDay !== 'All' || searchTerm) && (
            <button
              onClick={() => { setSelectedCourse('All'); setSelectedDay('All'); setSearchTerm(''); }}
              style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredLectures.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'var(--surface)',
            borderRadius: '16px',
            border: '1px dashed var(--border)'
          }}>
            <Calendar size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px auto' }} />
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-900)' }}>No Lectures Found</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              No lectures match the selected filters. Tap "+ Add Lecture" to create one.
            </p>
          </div>
        ) : (
          filteredLectures.map(lec => (
            <div
              key={lec.id}
              className="card"
              style={{
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                opacity: deletingId === lec.id ? 0.3 : 1,
                transform: deletingId === lec.id ? 'scale(0.97)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Header row: Course badge & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: '#e0f2fe',
                    color: '#0369a1'
                  }}>
                    {lec.course}
                  </span>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#f1f5f9',
                    color: '#475569'
                  }}>
                    {lec.day}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {lec.status === 'Ongoing' ? (
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>• Ongoing</span>
                  ) : (
                    <span className="badge badge-info" style={{ fontSize: '10px' }}>Upcoming</span>
                  )}

                  {/* Delete Action Button */}
                  <button
                    type="button"
                    title="Delete lecture from timetable"
                    onClick={() => {
                      if (window.confirm(`Delete ${lec.subject} on ${lec.day} (${lec.time})?`)) {
                        handleDeleteLecture(lec.id, lec.subject, lec.day);
                      }
                    }}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fee2e2',
                      color: '#ef4444',
                      borderRadius: '8px',
                      padding: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Subject Title */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                  {lec.subject}
                </h4>
              </div>

              {/* Details: Time & Faculty */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <Clock size={13} color="var(--accent-500)" />
                  <span style={{ fontWeight: 700, color: 'var(--brand-900)' }}>{lec.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <User size={13} color="#8b5cf6" />
                  <span>Faculty: <strong style={{ color: 'var(--brand-900)' }}>{lec.faculty}</strong></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Lecture Modal Sheet */}
      {showAddModal && (
        <div
          className={`modal-backdrop-05s ${isAddClosing ? 'closing' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseAddModal(); }}
        >
          <div className={`modal-sheet-05s ${isAddClosing ? 'closing' : ''}`} style={{ padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                  Add New Lecture
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Schedule class into timetable</span>
              </div>
              <button
                type="button"
                onClick={handleCloseAddModal}
                style={{ background: 'var(--surface-alt)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddLecture} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Course */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Target Course / Class *</label>
                <select
                  value={newCourse}
                  onChange={e => setNewCourse(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px', background: 'var(--surface)' }}
                >
                  {COURSE_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Subject *</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px', background: 'var(--surface)' }}
                >
                  {SUBJECT_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Day of Week */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Day of Week *</label>
                <select
                  value={newDay}
                  onChange={e => setNewDay(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px', background: 'var(--surface)' }}
                >
                  {DAYS_OF_WEEK.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Alarm-style Time Picker: From and Till with Hour & Minute scroll */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Timing (From &amp; Till) *
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* FROM COLUMN */}
                  <div style={{
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        From
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '6px' }}>
                        {fromHour}:{fromMinute} {fromPeriod}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '3px',
                      background: 'var(--surface)',
                      borderRadius: '9px',
                      border: '1px solid var(--border)',
                      padding: '2px 4px'
                    }}>
                      <AlarmScrollWheel items={HOURS} value={fromHour} onChange={setFromHour} />
                      <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', userSelect: 'none' }}>:</span>
                      <AlarmScrollWheel items={MINUTES} value={fromMinute} onChange={setFromMinute} />
                      <PeriodSelector value={fromPeriod} onChange={setFromPeriod} />
                    </div>
                  </div>

                  {/* TILL COLUMN */}
                  <div style={{
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Till
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '6px' }}>
                        {tillHour}:{tillMinute} {tillPeriod}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '3px',
                      background: 'var(--surface)',
                      borderRadius: '9px',
                      border: '1px solid var(--border)',
                      padding: '2px 4px'
                    }}>
                      <AlarmScrollWheel items={HOURS} value={tillHour} onChange={setTillHour} />
                      <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', userSelect: 'none' }}>:</span>
                      <AlarmScrollWheel items={MINUTES} value={tillMinute} onChange={setTillMinute} />
                      <PeriodSelector value={tillPeriod} onChange={setTillPeriod} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Faculty */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Assigned Faculty *</label>
                <select
                  value={newFaculty}
                  onChange={e => setNewFaculty(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px', background: 'var(--surface)' }}
                >
                  {FACULTY_OPTIONS.map(fac => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', fontSize: '13px' }}
                >
                  Save Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
