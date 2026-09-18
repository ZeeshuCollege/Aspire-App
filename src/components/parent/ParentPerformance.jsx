import React, { useState } from 'react';
import { 
  Award, FileText, CheckCircle2, XCircle, MinusCircle, 
  TrendingUp, Calendar, ChevronRight, BarChart2, BookOpen, 
  Search, ShieldCheck, ArrowUpRight 
} from 'lucide-react';

export const mockLast10Tests = [
  {
    id: 'pt-01',
    testNumber: 10,
    title: 'Physics Unit Test 04',
    subject: 'Physics',
    chapter: 'Ray Optics & Modern Physics',
    date: '14 Apr 2025',
    score: 92,
    maxMarks: 100,
    rank: 2,
    classAverage: 73,
    correct: 23,
    incorrect: 1,
    unattempted: 1,
    grade: 'A+',
    status: 'Passed (Distinction)',
    paperUrl: 'mock_physics_test_01.pdf'
  },
  {
    id: 'pt-02',
    testNumber: 9,
    title: 'Chemistry Unit Test 04',
    subject: 'Chemistry',
    chapter: 'Hydrocarbons & Alkyl Halides',
    date: '11 Apr 2025',
    score: 85,
    maxMarks: 100,
    rank: 5,
    classAverage: 68,
    correct: 21,
    incorrect: 3,
    unattempted: 1,
    grade: 'A',
    status: 'Passed',
    paperUrl: 'mock_chemistry_test_02.pdf'
  },
  {
    id: 'pt-03',
    testNumber: 8,
    title: 'Mathematics Unit Test 04',
    subject: 'Mathematics',
    chapter: 'Differential Equations',
    date: '08 Apr 2025',
    score: 88,
    maxMarks: 100,
    rank: 3,
    classAverage: 70,
    correct: 22,
    incorrect: 2,
    unattempted: 1,
    grade: 'A',
    status: 'Passed (Distinction)',
    paperUrl: 'mock_maths_test_01.pdf'
  },
  {
    id: 'pt-04',
    testNumber: 7,
    title: 'Physics Unit Test 03',
    subject: 'Physics',
    chapter: 'Rotational Dynamics & SHM',
    date: '04 Apr 2025',
    score: 80,
    maxMarks: 100,
    rank: 7,
    classAverage: 65,
    correct: 20,
    incorrect: 4,
    unattempted: 1,
    grade: 'B+',
    status: 'Passed',
    paperUrl: 'mock_physics_test_01.pdf'
  },
  {
    id: 'pt-05',
    testNumber: 6,
    title: 'Chemistry Unit Test 03',
    subject: 'Chemistry',
    chapter: 'Chemical Kinetics & Electrochemistry',
    date: '01 Apr 2025',
    score: 94,
    maxMarks: 100,
    rank: 1,
    classAverage: 72,
    correct: 24,
    incorrect: 1,
    unattempted: 0,
    grade: 'A+',
    status: 'Batch Topper (Distinction)',
    paperUrl: 'mock_chemistry_test_02.pdf'
  },
  {
    id: 'pt-06',
    testNumber: 5,
    title: 'Mathematics Unit Test 03',
    subject: 'Mathematics',
    chapter: 'Definite & Indefinite Integrals',
    date: '27 Mar 2025',
    score: 78,
    maxMarks: 100,
    rank: 8,
    classAverage: 64,
    correct: 19,
    incorrect: 4,
    unattempted: 2,
    grade: 'B+',
    status: 'Passed',
    paperUrl: 'mock_maths_test_01.pdf'
  },
  {
    id: 'pt-07',
    testNumber: 4,
    title: 'Physics Unit Test 02',
    subject: 'Physics',
    chapter: 'Work, Energy & Gravitation',
    date: '22 Mar 2025',
    score: 86,
    maxMarks: 100,
    rank: 4,
    classAverage: 69,
    correct: 21,
    incorrect: 2,
    unattempted: 2,
    grade: 'A',
    status: 'Passed',
    paperUrl: 'mock_physics_test_01.pdf'
  },
  {
    id: 'pt-08',
    testNumber: 3,
    title: 'Chemistry Unit Test 02',
    subject: 'Chemistry',
    chapter: 'Thermodynamics & Equilibrium',
    date: '18 Mar 2025',
    score: 82,
    maxMarks: 100,
    rank: 6,
    classAverage: 67,
    correct: 20,
    incorrect: 3,
    unattempted: 2,
    grade: 'B+',
    status: 'Passed',
    paperUrl: 'mock_chemistry_test_02.pdf'
  },
  {
    id: 'pt-09',
    testNumber: 2,
    title: 'Mathematics Unit Test 02',
    subject: 'Mathematics',
    chapter: 'Continuity & Differentiability',
    date: '14 Mar 2025',
    score: 90,
    maxMarks: 100,
    rank: 3,
    classAverage: 71,
    correct: 23,
    incorrect: 2,
    unattempted: 0,
    grade: 'A+',
    status: 'Passed (Distinction)',
    paperUrl: 'mock_maths_test_01.pdf'
  },
  {
    id: 'pt-10',
    testNumber: 1,
    title: 'Physics Unit Test 01',
    subject: 'Physics',
    chapter: 'Kinematics & Laws of Motion',
    date: '10 Mar 2025',
    score: 88,
    maxMarks: 100,
    rank: 4,
    classAverage: 71,
    correct: 22,
    incorrect: 2,
    unattempted: 1,
    grade: 'A',
    status: 'Passed (Distinction)',
    paperUrl: 'mock_physics_test_01.pdf'
  }
];

export default function ParentPerformance({ onOpenTestPaper }) {
  const [subjectFilter, setSubjectFilter] = useState('All');

  const totalTests = mockLast10Tests.length;
  const avgScore = Math.round(mockLast10Tests.reduce((acc, t) => acc + t.score, 0) / totalTests);
  const bestRank = Math.min(...mockLast10Tests.map(t => t.rank));

  const filteredTests = mockLast10Tests.filter(t => {
    if (subjectFilter === 'All') return true;
    return t.subject === subjectFilter;
  });

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Physics':
        return { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' };
      case 'Chemistry':
        return { bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
      case 'Mathematics':
        return { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' };
      default:
        return { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' };
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)', margin: '0 0 4px 0' }}>
          Academic Performance
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          Results and question breakdowns for the last {totalTests} completed tests
        </p>
      </div>

      {/* KPI Overview Summary Card */}
      <div className="card" style={{ padding: '16px', background: 'var(--surface)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div style={{ padding: '10px 6px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
              Average Score
            </span>
            <strong style={{ fontSize: '20px', color: 'var(--brand-900)', display: 'block', marginTop: '2px' }}>
              {avgScore}%
            </strong>
            <span style={{ fontSize: '10px', color: '#15803d', fontWeight: 700 }}>
              Consistent A
            </span>
          </div>

          <div style={{ padding: '10px 6px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
              Best Rank
            </span>
            <strong style={{ fontSize: '20px', color: 'var(--accent-500)', display: 'block', marginTop: '2px' }}>
              #{bestRank}
            </strong>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Batch of 35
            </span>
          </div>

          <div style={{ padding: '10px 6px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
              Tests Cleared
            </span>
            <strong style={{ fontSize: '20px', color: '#10b981', display: 'block', marginTop: '2px' }}>
              10/10
            </strong>
            <span style={{ fontSize: '10px', color: '#15803d', fontWeight: 700 }}>
              100% Pass
            </span>
          </div>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['All', 'Physics', 'Chemistry', 'Mathematics'].map(subj => {
          const count = subj === 'All' 
            ? mockLast10Tests.length 
            : mockLast10Tests.filter(t => t.subject === subj).length;

          const isActive = subjectFilter === subj;

          return (
            <button
              key={subj}
              type="button"
              onClick={() => setSubjectFilter(subj)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                border: isActive ? '1px solid var(--brand-800)' : '1px solid var(--border)',
                background: isActive ? 'var(--brand-800)' : 'var(--surface)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {subj} ({count})
            </button>
          );
        })}
      </div>

      {/* Last 10 Test Result Cards with Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTests.map((test) => {
          const sc = getSubjectColor(test.subject);
          const diffFromAvg = test.score - test.classAverage;

          return (
            <div
              key={test.id}
              className="card card-hover"
              style={{
                padding: '16px',
                background: 'var(--surface)',
                borderLeft: `4px solid ${test.score >= 90 ? '#10b981' : test.score >= 80 ? 'var(--brand-800)' : '#f59e0b'}`
              }}
            >
              {/* Top Row: Subject Badge & Test Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 800,
                  background: sc.bg,
                  color: sc.color,
                  border: `1px solid ${sc.border}`
                }}>
                  {test.subject}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <Calendar size={12} />
                  <span>{test.date}</span>
                </div>
              </div>

              {/* Title & Topic */}
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: '0 0 2px 0' }}>
                  {test.title}
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Unit: {test.chapter}
                </span>
              </div>

              {/* Score & Rank Highlight Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: 'var(--surface-alt)',
                borderRadius: '10px',
                marginBottom: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Score</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <strong style={{ fontSize: '18px', color: 'var(--brand-900)' }}>
                      {test.score}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/{test.maxMarks}</span>
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: test.score >= 90 ? '#15803d' : '#1e40af'
                    }}>
                      ({test.score}%)
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Batch Rank</span>
                  <strong style={{ fontSize: '15px', color: 'var(--brand-800)' }}>
                    Rank #{test.rank}
                  </strong>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>
                    Grade {test.grade}
                  </span>
                </div>
              </div>

              {/* Simple Breakdown Section */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Test Breakdown
                </span>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: '#ecfdf5',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <CheckCircle2 size={13} color="#15803d" />
                    <div>
                      <strong style={{ fontSize: '12px', color: '#15803d', display: 'block', lineHeight: 1 }}>
                        {test.correct}
                      </strong>
                      <span style={{ fontSize: '9px', color: '#166534', fontWeight: 600 }}>Correct</span>
                    </div>
                  </div>

                  <div style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <XCircle size={13} color="#b91c1c" />
                    <div>
                      <strong style={{ fontSize: '12px', color: '#b91c1c', display: 'block', lineHeight: 1 }}>
                        {test.incorrect}
                      </strong>
                      <span style={{ fontSize: '9px', color: '#991b1b', fontWeight: 600 }}>Incorrect</span>
                    </div>
                  </div>

                  <div style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <MinusCircle size={13} color="var(--text-muted)" />
                    <div>
                      <strong style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'block', lineHeight: 1 }}>
                        {test.unattempted}
                      </strong>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>Skipped</span>
                    </div>
                  </div>
                </div>

                {/* Class Average Comparison Pill */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  paddingTop: '6px',
                  borderTop: '1px solid var(--border)'
                }}>
                  <span>Class Average: <strong>{test.classAverage}/100</strong></span>
                  <span style={{ color: diffFromAvg >= 0 ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                    {diffFromAvg >= 0 ? `+${diffFromAvg} above avg` : `${diffFromAvg} below avg`}
                  </span>
                </div>
              </div>

              {/* View Question Paper Action */}
              {onOpenTestPaper && (
                <button
                  type="button"
                  onClick={() => onOpenTestPaper({ title: test.title, subtitle: `${test.subject} • ${test.date}` })}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-alt)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--brand-800)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <FileText size={13} />
                  <span>View Test Paper & Answers</span>
                  <ArrowUpRight size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
