import React, { useState } from 'react';
import { mockAdminStats, mockStudentsList, mockTeachersList, mockBatches } from '../../lib/mockData';
import {
  Users, UserCheck, BookOpen, CheckSquare, Plus, Search,
  Download, Settings, ShieldCheck, ChevronRight, Bell, DollarSign, Calendar
} from 'lucide-react';

export default function AdminMobileDashboard({ activeTab, onNavigate, onLogout }) {
  const [students, setStudents] = useState(mockStudentsList);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('Std. 12 • JEE');
  const [exportFeedback, setExportFeedback] = useState('');

  const handleExport = (format) => {
    setExportFeedback(`Exported to ASPIRE_Report.${format}`);
    setTimeout(() => setExportFeedback(''), 2500);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName) return;
    const newStd = {
      id: `s-${Date.now()}`,
      name: newStudentName,
      roll: (students.length + 101).toString(),
      course: newStudentCourse,
      attendance: 'Present',
      score: '85%',
      status: 'Active'
    };
    setStudents([newStd, ...students]);
    setNewStudentName('');
    setShowAddModal(false);
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '90px' }}>
      {/* ====================================================================
          SCREEN 25: ADMIN MOBILE HOME
         ==================================================================== */}
      {activeTab === 'home' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Institute Governance
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-900)' }}>Admin Portal</h2>
            </div>
            <span className="badge badge-success">
              <ShieldCheck size={12} /> Live Closed App
            </span>
          </div>

          {/* 4 Top KPI Cards (Grid matching Mobile Screen 25) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="card" style={{ padding: '14px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Students</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb', margin: '4px 0 2px 0' }}>{mockAdminStats.totalStudents}</h3>
              <span style={{ fontSize: '10px', color: 'var(--success)' }}>+12 this month</span>
            </div>

            <div className="card" style={{ padding: '14px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Present Today</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', margin: '4px 0 2px 0' }}>{mockAdminStats.presentToday}</h3>
              <span style={{ fontSize: '10px', color: 'var(--accent-500)' }}>88% Attendance</span>
            </div>

            <div className="card" style={{ padding: '14px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Teachers</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#8b5cf6', margin: '4px 0 2px 0' }}>{mockAdminStats.totalTeachers}</h3>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>All batches active</span>
            </div>

            <div className="card" style={{ padding: '14px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Fees</span>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ef4444', margin: '4px 0 2px 0' }}>{mockAdminStats.pendingFees}</h3>
              <span style={{ fontSize: '10px', color: 'var(--warning)' }}>Due in 7 days</span>
            </div>
          </div>

          {/* Attendance Overview Weekly Trend (From Mobile Screen 25) */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Attendance Overview</h4>
              <span style={{ fontSize: '11px', color: 'var(--accent-500)', fontWeight: 600 }}>Weekly (88% Avg)</span>
            </div>

            <div style={{ height: '110px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
              {[
                { day: 'Mon', val: 85 },
                { day: 'Tue', val: 92 },
                { day: 'Wed', val: 88 },
                { day: 'Thu', val: 90 },
                { day: 'Fri', val: 89 },
                { day: 'Sat', val: 84 }
              ].map(bar => (
                <div key={bar.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '100%', height: `${bar.val * 0.85}px`, background: 'linear-gradient(180deg, #0ea5e9 0%, #e0f2fe 100%)', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Classes (From Mobile Screen 25) */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Ongoing Lectures</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: 700 }}>Physics (JEE 12 - A)</h5>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Room 204 • Ms. Priya Shah</span>
                </div>
                <span className="badge badge-success">Ongoing</span>
              </div>

              <div className="card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: 700 }}>Chemistry (NEET 12 - B)</h5>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Room 201 • Mr. Rahul Verma</span>
                </div>
                <span className="badge badge-accent">Ongoing</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ====================================================================
          SCREEN 26: STUDENTS MOBILE DESK
         ==================================================================== */}
      {activeTab === 'students' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Students ({students.length})</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px', gap: '4px' }}
            >
              <Plus size={14} /> Add Student
            </button>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 34px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '13px',
                background: 'var(--surface)'
              }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Mobile Student List (From Screen 26) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {students
              .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll.includes(searchTerm))
              .map(std => (
                <div key={std.id} className="card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{std.name}</h5>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Roll #{std.roll} • {std.course}</span>
                  </div>
                  <span className="badge badge-success">{std.status}</span>
                </div>
              ))}
          </div>
        </>
      )}

      {/* ====================================================================
          SCREEN 27: TEACHERS MOBILE DESK
         ==================================================================== */}
      {activeTab === 'teachers' && (
        <>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Faculty ({mockTeachersList.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mockTeachersList.map(t => (
              <div key={t.id} className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700 }}>{t.name}</h5>
                  <span style={{ fontSize: '11px', color: 'var(--accent-500)', fontWeight: 600 }}>{t.subject}</span>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Batches: {t.batches}</p>
                </div>
                <span className="badge badge-success">{t.status}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ====================================================================
          SCREEN 28: COURSES & BATCHES
         ==================================================================== */}
      {activeTab === 'batches' && (
        <>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Courses & Batches</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Std. 9 - 10 Foundation', code: 'FND-9-10', batches: 'Class 10 - A (30 Students)' },
              { name: 'Std. 11 - 12 Science', code: 'SCI-11-12', batches: 'Class 11 - A (32 Students)' },
              { name: 'NEET Medical', code: 'NEET-MED', batches: 'NEET 12 - B (29 Students)' },
              { name: 'JEE Main + Advanced', code: 'JEE-ENG', batches: 'JEE 12 - A (35 Students)' }
            ].map(c => (
              <div key={c.code} className="card" style={{ padding: '16px' }}>
                <span className="badge badge-accent" style={{ marginBottom: '6px' }}>{c.code}</span>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{c.name}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Active Batches: {c.batches}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ====================================================================
          SCREEN 30: SETTINGS MOBILE DESK
         ==================================================================== */}
      {activeTab === 'profile' && (
        <>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Settings & Reports</h3>

          {/* Quick Export Cards */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Export Institute Data</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>Download full reports in 1-tap:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleExport('csv')} className="btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '8px' }}>
                <Download size={13} /> CSV
              </button>
              <button onClick={() => handleExport('xlsx')} className="btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '8px' }}>
                <Download size={13} /> Excel
              </button>
              <button onClick={() => handleExport('pdf')} className="btn-primary" style={{ flex: 1, fontSize: '11px', padding: '8px' }}>
                <Download size={13} /> PDF
              </button>
            </div>
            {exportFeedback && (
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, display: 'block', marginTop: '8px', textAlign: 'center' }}>
                {exportFeedback}
              </span>
            )}
          </div>

          <div className="card" style={{ padding: '6px 14px' }}>
            {[
              'Institute Profile',
              'App Settings',
              'WhatsApp OTP Settings',
              'User Access & Roles',
              'Backup & Restore'
            ].map((item, idx) => (
              <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx < 4 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{item}</span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>

          <button
            onClick={onLogout}
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            Log Out from Admin
          </button>
        </>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '340px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px' }}>Add New Student</h4>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600 }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Student Name"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600 }}>Stream</label>
                <select
                  value={newStudentCourse}
                  onChange={e => setNewStudentCourse(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                >
                  <option value="Std. 12 • JEE">Std. 12 • JEE Main + Adv</option>
                  <option value="Std. 12 • NEET">Std. 12 • NEET Medical</option>
                  <option value="Std. 11 • Science">Std. 11 • Science</option>
                  <option value="Std. 10 • Foundation">Std. 10 • Foundation</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>
                  Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
