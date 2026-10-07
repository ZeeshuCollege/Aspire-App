import React, { useState, useEffect } from 'react';
import {
  X, ArrowLeft, Edit3, Save, Plus, Trash2, BookOpen,
  Users, Check, CheckCircle2, ChevronRight, GraduationCap,
  Award, AlertCircle
} from 'lucide-react';
import { SUBJECT_OPTIONS } from './AdminStudyMaterialsModal';

export default function AdminCourseDetailsModal({
  isOpen,
  onClose,
  course,
  onSaveCourse,
  onDeleteCourse,
  availableFaculty = [],
  enrolledStudentsCount = 0
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Editable Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);

  // New subject input state in edit mode
  const [newSubjectInput, setNewSubjectInput] = useState('');
  // New faculty input state in edit mode
  const [newFacultyInput, setNewFacultyInput] = useState('');

  // Populate form state when course changes or modal opens
  useEffect(() => {
    if (course) {
      setName(course.name || '');
      setCode(course.code || '');
      setSubjects(Array.isArray(course.subjects) ? [...course.subjects] : []);
      setFaculty(Array.isArray(course.faculty) ? [...course.faculty] : []);
      setIsEditing(false);
      setSuccessToast('');
    }
  }, [course, isOpen]);

  // Smooth closing handler
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsEditing(false);
      setSuccessToast('');
    }, 280);
  };

  // Hardware/gesture back button support
  useEffect(() => {
    if (!isOpen) return;
    const handleAppBack = (e) => {
      if (isEditing) {
        setIsEditing(false);
        e.detail?.markHandled();
        return;
      }
      handleClose();
      e.detail?.markHandled();
    };
    window.addEventListener('app:back', handleAppBack);
    return () => window.removeEventListener('app:back', handleAppBack);
  }, [isOpen, isEditing]);

  if (!isOpen || !course) return null;

  // ── Subject Management Helpers ──
  const handleEditSubjectName = (index, newName) => {
    setSubjects(prev => {
      const copy = [...prev];
      copy[index] = newName;
      return copy;
    });
  };

  const handleRemoveSubject = (index) => {
    setSubjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSubject = (subjectToAdd) => {
    const trimmed = (subjectToAdd || newSubjectInput).trim();
    if (!trimmed) return;
    if (subjects.includes(trimmed)) return;
    setSubjects(prev => [...prev, trimmed]);
    setNewSubjectInput('');
  };

  // ── Faculty Management Helpers ──
  const handleToggleFaculty = (fName) => {
    setFaculty(prev =>
      prev.includes(fName) ? prev.filter(f => f !== fName) : [...prev, fName]
    );
  };

  const handleAddCustomFaculty = () => {
    const trimmed = newFacultyInput.trim();
    if (!trimmed) return;
    if (faculty.includes(trimmed)) return;
    setFaculty(prev => [...prev, trimmed]);
    setNewFacultyInput('');
  };

  const handleRemoveFaculty = (fName) => {
    setFaculty(prev => prev.filter(f => f !== fName));
  };

  // ── Save Changes Handler ──
  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert('Course name cannot be empty.');
      return;
    }
    if (subjects.length === 0) {
      alert('Please add at least one subject to this course.');
      return;
    }

    const updated = {
      ...course,
      name: name.trim(),
      code: code.trim() || course.code,
      subjects: subjects.filter(s => typeof s === 'string' && s.trim().length > 0),
      faculty: faculty.filter(f => typeof f === 'string' && f.trim().length > 0)
    };

    if (onSaveCourse) {
      onSaveCourse(updated);
    }

    setIsEditing(false);
    setSuccessToast('✓ Course details updated successfully!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Combined faculty pool (passed availableFaculty + any standard options + current ones)
  const allFacultyOptions = Array.from(new Set([
    ...availableFaculty,
    'Physics Faculty', 'Chemistry Faculty', 'Mathematics Faculty', 'Biology Faculty', 'Science Faculty',
    ...faculty
  ])).filter(Boolean);

  return (
    <div
      className={`modal-backdrop-05s ${isClosing ? 'closing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        zIndex: 1100,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div
        className={`modal-sheet-05s ${isClosing ? 'closing' : ''}`}
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface, #ffffff)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Drag handle */}
        <div className="sheet-drag-handle" onClick={handleClose} style={{ cursor: 'pointer' }} />

        {/* Modal Top Nav Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border, #e2e8f0)',
          background: 'var(--surface, #ffffff)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-secondary)'
                }}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              background: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe'
            }}>
              <BookOpen size={12} />
              {isEditing ? 'EDIT MODE' : 'COURSE DETAILS'}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {course.code}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary"
                style={{
                  padding: '6px 12px',
                  fontSize: '11.5px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 700
                }}
              >
                <Edit3 size={13} /> Edit
              </button>
            )}

            <button
              onClick={handleClose}
              aria-label="Close"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {successToast && (
          <div style={{
            background: '#ecfdf5',
            borderBottom: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '9px 18px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle2 size={15} />
            {successToast}
          </div>
        )}

        {/* Scrollable Content Container */}
        <div style={{
          padding: '18px 20px 32px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>

          {/* ══════════════════════════════════════════════
              VIEW MODE: Rich course details presentation
             ══════════════════════════════════════════════ */}
          {!isEditing ? (
            <>
              {/* Hero Banner Card */}
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '18px 16px',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    letterSpacing: '0.04em'
                  }}>
                    CODE: {course.code}
                  </span>

                  <span style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <GraduationCap size={14} color="#38bdf8" />
                    {enrolledStudentsCount} Enrolled
                  </span>
                </div>

                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    {course.name}
                  </h2>
                  <span style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px', display: 'block' }}>
                    Active Academic Curriculum
                  </span>
                </div>

                {/* Quick stats grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600 }}>Total Subjects</span>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#38bdf8' }}>
                      {course.subjects?.length || 0}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600 }}>Faculty Members</span>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#4ade80' }}>
                      {course.faculty?.length || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects List Card */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Course Subjects ({course.subjects?.length || 0})
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-600)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Plus size={13} /> Add / Edit
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {course.subjects?.map((sub, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          background: '#e0f2fe',
                          color: '#0284c7',
                          fontSize: '11px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-900)' }}>
                          {sub}
                        </span>
                      </div>
                      <span className="badge badge-info" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        Active
                      </span>
                    </div>
                  ))}
                  {(!course.subjects || course.subjects.length === 0) && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                      No subjects configured for this course yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Faculty Assigned Card */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Assigned Teachers / Faculty ({course.faculty?.length || 0})
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-600)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Plus size={13} /> Modify
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {course.faculty?.map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        background: '#f5f3ff',
                        border: '1px solid #ddd6fe',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#6d28d9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Users size={13} />
                      <span>{f}</span>
                    </div>
                  ))}
                  {(!course.faculty || course.faculty.length === 0) && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                      No faculty assigned to this course yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '8px',
                borderTop: '1px solid #f1f5f9'
              }}>
                {onDeleteCourse && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete course "${course.name}"?`)) {
                        handleClose();
                        onDeleteCourse(course.id);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} /> Delete Course
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                  style={{
                    padding: '9px 18px',
                    fontSize: '12.5px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit3 size={14} /> Edit Course
                </button>
              </div>
            </>
          ) : (
            /* ══════════════════════════════════════════════
               EDIT MODE: Comprehensive form to change name,
               add subjects, edit subject names, teachers
               ══════════════════════════════════════════════ */
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Course Name Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-900)' }}>
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. JEE (Mains + Advanced)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    background: 'var(--surface)'
                  }}
                />
              </div>

              {/* Course Code Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-900)' }}>
                  Course Code / Tag
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. JEE or STD-11"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border)',
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: 'var(--surface)'
                  }}
                />
              </div>

              {/* ── Subject Management: Edit names, add new, remove ── */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-900)', textTransform: 'uppercase' }}>
                      Subjects ({subjects.length})
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Edit inline or add new
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Type directly into any subject name to edit it.
                  </span>
                </div>

                {/* List of editable subjects */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '6px 10px'
                      }}
                    >
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#64748b',
                        width: '20px',
                        textAlign: 'center'
                      }}>
                        {idx + 1}.
                      </span>

                      {/* Inline Editable Subject Name Input */}
                      <input
                        type="text"
                        value={sub}
                        onChange={e => handleEditSubjectName(idx, e.target.value)}
                        placeholder="Subject Name"
                        style={{
                          flex: 1,
                          border: 'none',
                          outline: 'none',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--brand-900)',
                          background: 'transparent',
                          padding: '2px 0'
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          color: '#dc2626',
                          borderRadius: '6px',
                          width: '26px',
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Remove Subject"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                  {subjects.length === 0 && (
                    <div style={{ fontSize: '12px', color: '#dc2626', padding: '6px 0' }}>
                      No subjects added. Add at least one subject below.
                    </div>
                  )}
                </div>

                {/* Add New Subject Input Row */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                  <input
                    type="text"
                    value={newSubjectInput}
                    onChange={e => setNewSubjectInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubject();
                      }
                    }}
                    placeholder="Type new subject name (e.g. Zoology)..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12.5px',
                      background: '#ffffff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSubject()}
                    className="btn-primary"
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {/* Quick Add Pills from standard SUBJECT_OPTIONS */}
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Quick Add from Standard Subjects:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxHeight: '110px', overflowY: 'auto' }}>
                    {SUBJECT_OPTIONS.filter(s => !subjects.includes(s)).slice(0, 10).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddSubject(s)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px dashed #cbd5e1',
                          background: '#ffffff',
                          fontSize: '11px',
                          color: 'var(--brand-800)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Plus size={11} /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Faculty / Teachers Management ── */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-900)', textTransform: 'uppercase' }}>
                      Faculty / Teachers ({faculty.length})
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Select or add
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Toggle teachers assigned to teach this course:
                  </span>
                </div>

                {/* Available Faculty Toggle Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {allFacultyOptions.map(fName => {
                    const isSelected = faculty.includes(fName);
                    return (
                      <button
                        key={fName}
                        type="button"
                        onClick={() => handleToggleFaculty(fName)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.15s ease',
                          border: isSelected ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                          background: isSelected ? '#ede9fe' : '#ffffff',
                          color: isSelected ? '#6d28d9' : 'var(--text-secondary)'
                        }}
                      >
                        {isSelected ? <Check size={13} color="#6d28d9" /> : <Plus size={13} />}
                        <span>{fName}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Teacher Name */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                  <input
                    type="text"
                    value={newFacultyInput}
                    onChange={e => setNewFacultyInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomFaculty();
                      }
                    }}
                    placeholder="Add other teacher name..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12.5px',
                      background: '#ffffff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFaculty}
                    className="btn-secondary"
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      borderRadius: '8px',
                      fontWeight: 700
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px', fontSize: '13px', borderRadius: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    flex: 1.5,
                    padding: '12px',
                    fontSize: '13px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Save size={15} /> Save Changes
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
