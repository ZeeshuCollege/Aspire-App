import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, ArrowLeft, Search, Award, CheckSquare, Users, BookOpen, 
  Calendar, Check, AlertCircle, CheckCircle2, TrendingUp, Filter,
  FileSpreadsheet, Sparkles, Download, Save, RefreshCw
} from 'lucide-react';
import { mockTests } from '../../lib/mockData';
import { getStoredStudents, saveStoredStudents } from '../../lib/userAuthStore';
import { COURSE_OPTIONS } from './AdminStudyMaterialsModal';

// Sample fallback students if no students are enrolled in store yet
const DEFAULT_SAMPLE_STUDENTS = [
  { id: 's-101', name: 'Rohan Sharma', roll: '101', rollNumber: 'ASPIRE-2025-101', course: '12th Science' },
  { id: 's-102', name: 'Aarav Patel', roll: '102', rollNumber: 'ASPIRE-2025-102', course: 'JEE (Mains + Adv)' },
  { id: 's-103', name: 'Ananya Iyer', roll: '103', rollNumber: 'ASPIRE-2025-103', course: 'NEET' },
  { id: 's-104', name: 'Sneha Kulkarni', roll: '104', rollNumber: 'ASPIRE-2025-104', course: '12th Science' },
  { id: 's-105', name: 'Vikram Joshi', roll: '105', rollNumber: 'ASPIRE-2025-105', course: '11th Science' },
  { id: 's-106', name: 'Ishita Deshmukh', roll: '106', rollNumber: 'ASPIRE-2025-106', course: 'MHT-CET' },
  { id: 's-107', name: 'Aditya Verma', roll: '107', rollNumber: 'ASPIRE-2025-107', course: 'JEE (Mains + Adv)' },
  { id: 's-108', name: 'Tanvi Nair', roll: '108', rollNumber: 'ASPIRE-2025-108', course: 'NEET' }
];

export default function AdminMarksModal({ isOpen, onClose }) {
  const [tests] = useState(mockTests);
  const [selectedTestId, setSelectedTestId] = useState(mockTests[0]?.id || 't-01');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Editable test parameters
  const activeTest = useMemo(() => {
    return tests.find(t => t.id === selectedTestId) || tests[0] || {
      id: 'custom',
      title: 'Classroom Unit Assessment',
      subject: 'Physics (JEE)',
      course: '12th Science',
      maxMarks: 100,
      passingMarks: 35
    };
  }, [tests, selectedTestId]);

  const [maxMarks, setMaxMarks] = useState(activeTest.maxMarks || 100);
  const [passingMarks, setPassingMarks] = useState(activeTest.passingMarks || 35);
  const [testDate, setTestDate] = useState(activeTest.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));

  // Student list: enrolled students from userAuthStore + default samples if none
  const [studentsList, setStudentsList] = useState([]);
  // Marks map: { [studentId]: { score: number | '', isAbsent: boolean, remarks: string } }
  const [studentMarks, setStudentMarks] = useState({});

  const [successToast, setSuccessToast] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  // Load students & existing marks on mount or test change
  useEffect(() => {
    if (!isOpen) return;

    const stored = getStoredStudents();
    const baseList = stored && stored.length > 0 ? stored : DEFAULT_SAMPLE_STUDENTS;
    setStudentsList(baseList);

    // Load saved marks for this test from localStorage
    try {
      const savedStorage = JSON.parse(localStorage.getItem(`aspire_marks_${selectedTestId}`) || '{}');
      const initialMap = {};
      baseList.forEach((std, idx) => {
        if (savedStorage[std.id]) {
          initialMap[std.id] = savedStorage[std.id];
        } else {
          // Pre-populate with realistic mock score or empty
          const fallbackScore = Math.min(maxMarks, Math.max(30, 85 - (idx * 5)));
          initialMap[std.id] = {
            score: fallbackScore.toString(),
            isAbsent: false,
            remarks: ''
          };
        }
      });
      setStudentMarks(initialMap);
    } catch {
      const fallbackMap = {};
      baseList.forEach(std => {
        fallbackMap[std.id] = { score: '', isAbsent: false, remarks: '' };
      });
      setStudentMarks(fallbackMap);
    }
  }, [isOpen, selectedTestId, maxMarks]);

  // Sync test metadata when test changes
  useEffect(() => {
    if (activeTest) {
      setMaxMarks(activeTest.maxMarks || 100);
      setPassingMarks(activeTest.passingMarks || 35);
      if (activeTest.date) setTestDate(activeTest.date);
    }
  }, [activeTest]);

  // Back navigation handler with smooth animation
  const handleBack = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 320);
  };

  // Android back button / escape support
  useEffect(() => {
    if (!isOpen) return;
    const handleAppBack = (e) => {
      handleBack();
      e.detail?.markHandled?.();
    };
    window.addEventListener('app:back', handleAppBack);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('app:back', handleAppBack);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isClosing]);

  if (!isOpen) return null;

  // Filter students based on course and search query
  const filteredStudents = studentsList.filter(std => {
    const matchesCourse = selectedCourseFilter === 'All' || std.course === selectedCourseFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || 
      (std.name || '').toLowerCase().includes(q) || 
      (std.rollNumber || '').toLowerCase().includes(q) ||
      (std.roll || '').toString().includes(q);
    return matchesCourse && matchesSearch;
  });

  // Handle single student score change
  const handleScoreChange = (studentId, rawValue) => {
    if (rawValue === '') {
      setStudentMarks(prev => ({
        ...prev,
        [studentId]: { ...(prev[studentId] || {}), score: '', isAbsent: false }
      }));
      return;
    }
    const val = parseInt(rawValue, 10);
    if (isNaN(val)) return;
    const clamped = Math.max(0, Math.min(Number(maxMarks) || 100, val));
    setStudentMarks(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        score: clamped.toString(),
        isAbsent: false
      }
    }));
  };

  // Toggle student absence
  const handleToggleAbsent = (studentId) => {
    setStudentMarks(prev => {
      const current = prev[studentId] || { score: '', isAbsent: false };
      const nextAbsent = !current.isAbsent;
      return {
        ...prev,
        [studentId]: {
          ...current,
          isAbsent: nextAbsent,
          score: nextAbsent ? '0' : (current.score === '0' ? '35' : current.score)
        }
      };
    });
  };

  // Quick preset actions
  const handleMarkAllPresent = () => {
    setStudentMarks(prev => {
      const updated = { ...prev };
      filteredStudents.forEach(std => {
        if (updated[std.id]?.isAbsent) {
          updated[std.id] = { ...updated[std.id], isAbsent: false, score: '40' };
        }
      });
      return updated;
    });
    setSuccessToast('✓ All students marked present.');
    setTimeout(() => setSuccessToast(''), 2500);
  };

  const handleQuickFillPassing = () => {
    setStudentMarks(prev => {
      const updated = { ...prev };
      filteredStudents.forEach(std => {
        if (!updated[std.id]?.score || updated[std.id]?.score === '0') {
          updated[std.id] = { ...updated[std.id], score: passingMarks.toString(), isAbsent: false };
        }
      });
      return updated;
    });
    setSuccessToast(`✓ Filled passing marks (${passingMarks}) for unentered students.`);
    setTimeout(() => setSuccessToast(''), 2500);
  };

  // Compute live test metrics
  const stats = useMemo(() => {
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalScoreSum = 0;
    let evaluatedCount = 0;
    let passedCount = 0;
    let highest = -1;
    let lowest = 9999;

    studentsList.forEach(std => {
      const entry = studentMarks[std.id];
      if (!entry) return;
      if (entry.isAbsent) {
        totalAbsent += 1;
        return;
      }
      if (entry.score !== '' && !isNaN(Number(entry.score))) {
        const s = Number(entry.score);
        totalPresent += 1;
        evaluatedCount += 1;
        totalScoreSum += s;
        if (s >= Number(passingMarks)) passedCount += 1;
        if (s > highest) highest = s;
        if (s < lowest) lowest = s;
      }
    });

    const avg = evaluatedCount > 0 ? (totalScoreSum / evaluatedCount).toFixed(1) : '—';
    const passRate = evaluatedCount > 0 ? Math.round((passedCount / evaluatedCount) * 100) : 0;

    return {
      totalStudents: studentsList.length,
      evaluatedCount,
      totalPresent,
      totalAbsent,
      avgScore: avg,
      highestScore: highest >= 0 ? highest : '—',
      lowestScore: lowest <= 100 ? lowest : '—',
      passRate
    };
  }, [studentsList, studentMarks, passingMarks]);

  // Helper for Grade Badge
  const getGradeInfo = (scoreStr, isAbsent) => {
    if (isAbsent) return { label: 'Absent', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
    if (scoreStr === '' || scoreStr === undefined) return { label: 'Pending', color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0' };
    const num = Number(scoreStr);
    const max = Number(maxMarks) || 100;
    const pct = Math.round((num / max) * 100);

    if (num < Number(passingMarks)) return { label: 'Fail', color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5' };
    if (pct >= 90) return { label: 'A+ (90%+)', color: '#047857', bg: '#d1fae5', border: '#6ee7b7' };
    if (pct >= 75) return { label: 'A (75%+)', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
    if (pct >= 60) return { label: 'B (60%+)', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' };
    if (pct >= 45) return { label: 'C (45%+)', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    return { label: 'Pass', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' };
  };

  // Save and publish marks
  const handleSaveMarks = () => {
    try {
      // 1. Persist marks record for this test
      localStorage.setItem(`aspire_marks_${selectedTestId}`, JSON.stringify(studentMarks));

      // 2. Update students list in userAuthStore with latestTest scores
      const currentStored = getStoredStudents();
      if (currentStored && currentStored.length > 0) {
        const updated = currentStored.map(s => {
          const m = studentMarks[s.id];
          if (m && m.score !== '') {
            const scoreNum = Number(m.score);
            const pct = Math.round((scoreNum / (Number(maxMarks) || 100)) * 100);
            return {
              ...s,
              score: `${pct}%`,
              latestTest: {
                title: activeTest.title,
                subject: activeTest.subject,
                date: testDate,
                score: scoreNum,
                maxMarks: Number(maxMarks),
                percentage: pct,
                status: m.isAbsent ? 'Absent' : (scoreNum >= Number(passingMarks) ? 'Passed' : 'Failed'),
                grade: getGradeInfo(m.score, m.isAbsent).label.split(' ')[0]
              }
            };
          }
          return s;
        });
        saveStoredStudents(updated);
      }

      setSuccessToast(`✓ Marks successfully uploaded & published for "${activeTest.title}"!`);
      setTimeout(() => setSuccessToast(''), 3500);
    } catch {
      setSuccessToast('⚠️ Marks saved locally.');
      setTimeout(() => setSuccessToast(''), 2500);
    }
  };

  return (
    <div
      className={`fullscreen-page-modal ${isClosing ? 'closing' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--canvas)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Navigation Bar */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleBack}
            style={{
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--brand-900)'
            }}
            title="Back to Admin"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)', margin: 0, lineHeight: 1.2 }}>
                Marks Upload
              </h2>
              <span className="badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontSize: '11px', fontWeight: 700, padding: '2px 8px' }}>
                Quick Action
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Efficiently grade & publish student test scores
            </span>
          </div>
        </div>

        {/* Header Save Button */}
        <button
          type="button"
          onClick={handleSaveMarks}
          className="btn-primary"
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '10px'
          }}
        >
          <Save size={15} />
          <span>Publish Marks</span>
        </button>
      </div>

      {/* Success Banner */}
      {successToast && (
        <div style={{
          background: '#ecfdf5',
          color: '#065f46',
          borderBottom: '1px solid #a7f3d0',
          padding: '10px 16px',
          fontSize: '12.5px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeInShade 0.2s ease-out'
        }}>
          <CheckCircle2 size={16} color="#059669" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Scrollable Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Test Selector Card */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-800)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Test to Grade
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {tests.length} tests available
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            <select
              value={selectedTestId}
              onChange={e => setSelectedTestId(e.target.value)}
              className="input-field"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1.5px solid var(--border)' }}
            >
              {tests.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} • {t.course} ({t.subject})
                </option>
              ))}
            </select>
          </div>

          {/* Test Parameters Bar */}
          <div style={{
            background: 'var(--surface-alt)',
            padding: '10px 14px',
            borderRadius: '10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '10px',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Max Marks</span>
              <input
                type="number"
                min="1"
                max="1000"
                value={maxMarks}
                onChange={e => setMaxMarks(e.target.value)}
                style={{ width: '100%', maxWidth: '80px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', fontWeight: 700, marginTop: '2px' }}
              />
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Passing Marks</span>
              <input
                type="number"
                min="1"
                max={maxMarks}
                value={passingMarks}
                onChange={e => setPassingMarks(e.target.value)}
                style={{ width: '100%', maxWidth: '80px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', fontWeight: 700, marginTop: '2px' }}
              />
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Exam Date</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginTop: '6px' }}>{testDate}</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Target Course</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-700)', display: 'block', marginTop: '6px' }}>{activeTest.course}</span>
            </div>
          </div>
        </div>

        {/* Live Performance KPI Ribbon */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <div className="card" style={{ padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Evaluated</span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-800)', margin: '2px 0 0 0' }}>
              {stats.evaluatedCount} / {filteredStudents.length}
            </h4>
          </div>
          <div className="card" style={{ padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Class Avg</span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7', margin: '2px 0 0 0' }}>
              {stats.avgScore}
            </h4>
          </div>
          <div className="card" style={{ padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Highest</span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a', margin: '2px 0 0 0' }}>
              {stats.highestScore}
            </h4>
          </div>
          <div className="card" style={{ padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Pass Rate</span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#d97706', margin: '2px 0 0 0' }}>
              {stats.passRate}%
            </h4>
          </div>
        </div>

        {/* Filter & Quick Action Row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search student or roll no..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '12.5px',
                  background: 'var(--surface)'
                }}
              />
            </div>

            {/* Course Filter Dropdown */}
            <select
              value={selectedCourseFilter}
              onChange={e => setSelectedCourseFilter(e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '12px',
                fontWeight: 600,
                background: 'var(--surface)',
                maxWidth: '130px'
              }}
            >
              <option value="All">All Courses</option>
              {COURSE_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Quick Buttons */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              type="button"
              onClick={handleMarkAllPresent}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid #a7f3d0',
                background: '#ecfdf5',
                color: '#065f46',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <CheckSquare size={13} />
              Mark All Present
            </button>

            <button
              type="button"
              onClick={handleQuickFillPassing}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid #fed7aa',
                background: '#fff7ed',
                color: '#c2410c',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={13} />
              Fill Passing ({passingMarks})
            </button>
          </div>
        </div>

        {/* Students Marks Upload List */}
        <div className="card" style={{ padding: '4px 14px', background: 'var(--surface)' }}>
          <div style={{ padding: '10px 0 6px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Student ({filteredStudents.length})
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Marks / {maxMarks}
            </span>
          </div>

          {filteredStudents.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <p style={{ fontSize: '13px', margin: 0 }}>No students found matching current filter.</p>
            </div>
          ) : (
            filteredStudents.map((student, idx) => {
              const entry = studentMarks[student.id] || { score: '', isAbsent: false, remarks: '' };
              const grade = getGradeInfo(entry.score, entry.isAbsent);

              return (
                <div
                  key={student.id || idx}
                  style={{
                    padding: '12px 0',
                    borderBottom: idx < filteredStudents.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  {/* Student Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {student.name}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'var(--surface-alt)',
                        color: 'var(--text-secondary)',
                        fontWeight: 600
                      }}>
                        #{student.roll || student.rollNumber?.split('-').pop() || idx + 101}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {student.course || '12th Science'}
                      </span>
                      {/* Grade Badge */}
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: '999px',
                        background: grade.bg,
                        color: grade.color,
                        border: `1px solid ${grade.border}`
                      }}>
                        {grade.label}
                      </span>
                    </div>
                  </div>

                  {/* Marks Input & Absence Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Absent button */}
                    <button
                      type="button"
                      onClick={() => handleToggleAbsent(student.id)}
                      style={{
                        padding: '5px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: entry.isAbsent ? '1px solid #fecaca' : '1px solid var(--border)',
                        background: entry.isAbsent ? '#fee2e2' : 'var(--surface-alt)',
                        color: entry.isAbsent ? '#b91c1c' : 'var(--text-secondary)',
                        transition: 'all 0.15s ease'
                      }}
                      title="Toggle Absent"
                    >
                      {entry.isAbsent ? 'AB' : 'Present'}
                    </button>

                    {/* Numeric Marks Input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        disabled={entry.isAbsent}
                        value={entry.isAbsent ? '' : entry.score}
                        placeholder={entry.isAbsent ? 'AB' : '0'}
                        min="0"
                        max={maxMarks}
                        onChange={e => handleScoreChange(student.id, e.target.value)}
                        style={{
                          width: '56px',
                          textAlign: 'center',
                          padding: '7px 4px',
                          fontSize: '14px',
                          fontWeight: 800,
                          borderRadius: '8px',
                          border: entry.isAbsent ? '1px solid #fecaca' : (entry.score !== '' ? '1.5px solid #3b82f6' : '1px solid var(--border)'),
                          background: entry.isAbsent ? '#fef2f2' : (entry.score !== '' ? '#eff6ff' : 'var(--surface)'),
                          color: entry.isAbsent ? '#dc2626' : 'var(--brand-900)'
                        }}
                      />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        /{maxMarks}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Save Action Panel */}
        <div style={{ padding: '10px 0 20px 0' }}>
          <button
            type="button"
            onClick={handleSaveMarks}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '14px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '12px',
              boxShadow: '0 4px 14px rgba(30, 58, 138, 0.25)'
            }}
          >
            <Save size={18} />
            <span>Save & Publish All Marks ({stats.evaluatedCount} entered)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
