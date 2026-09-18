import React, { useState } from 'react';
import { mockAdminStats, mockStudentsList, mockTeachersList, mockBatches } from '../../lib/mockData';
import {
  LayoutDashboard, Users, UserCheck, BookOpen, CheckSquare,
  FileText, DollarSign, BarChart2, Settings, Download, Plus, Search, ShieldCheck
} from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [students, setStudents] = useState(mockStudentsList);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('Std. 12 • JEE');
  const [exportFeedback, setExportFeedback] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: UserCheck },
    { id: 'courses', label: 'Courses & Batches', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'tests', label: 'Tests', icon: FileText },
    { id: 'fees', label: 'Fees', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Handle Quick 1-Click Export
  const handleExport = (format) => {
    setExportFeedback(`Exporting institute records to ${format.toUpperCase()}...`);
    setTimeout(() => {
      setExportFeedback(`Report successfully exported to ASPIRE_Institute_Report.${format}`);
      setTimeout(() => setExportFeedback(''), 3000);
    }, 800);
  };

  // Add Student Handler
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
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Dark Slate Sidebar (From ASPIRE THEME.png Row 4 Screen 25) */}
      <aside style={{
        width: '240px',
        background: 'var(--brand-900)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #1e3a8a, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px' }}>
            ▲
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.02em', color: '#ffffff' }}>ASPIRE</h3>
            <span style={{ fontSize: '10px', color: 'var(--accent-400)', fontWeight: 600 }}>ADMIN DESK</span>
          </div>
        </div>

        {/* Sidebar Menu Links */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'var(--brand-800)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#38bdf8' : '#94a3b8'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Admin User Info Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', display: 'block' }}>Admin Director</span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>aspirelearningcentre</span>
          </div>
          <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
            Exit
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-900)' }}>
              {menuItems.find(m => m.id === activeMenu)?.label || 'Dashboard'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              ASPIRE Learning Centre • Central Academic & Operations Center
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="badge badge-success">
              <ShieldCheck size={14} /> Closed Ecosystem
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {exportFeedback && (
          <div style={{ background: 'var(--success-tint)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
            {exportFeedback}
          </div>
        )}

        {/* ====================================================================
            VIEW: DASHBOARD (From ASPIRE THEME.png Row 4 Screen 25)
           ==================================================================== */}
        {activeMenu === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 4 Top KPI Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: 'Total Students', value: mockAdminStats.totalStudents, change: '+12 this month', color: '#2563eb' },
                { label: 'Present Today', value: mockAdminStats.presentToday, change: '88% attendance', color: '#10b981' },
                { label: 'Total Teachers', value: mockAdminStats.totalTeachers, change: 'All active', color: '#8b5cf6' },
                { label: 'Pending Fees', value: mockAdminStats.pendingFees, change: 'Due in 7 days', color: '#ef4444' }
              ].map(stat => (
                <div key={stat.label} className="card" style={{ padding: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{stat.label}</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: stat.color, margin: '6px 0 2px 0' }}>{stat.value}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{stat.change}</span>
                </div>
              ))}
            </div>

            {/* 2 Analytics Charts (Attendance Area Chart & Fee Collection Bar Chart) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
              {/* Attendance Overview Area Chart */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Attendance Overview</h4>
                  <span style={{ fontSize: '11px', color: 'var(--accent-500)', fontWeight: 600 }}>Weekly Trend (88% Avg)</span>
                </div>
                <div style={{ height: '160px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                  {[
                    { day: 'Mon', val: 85 },
                    { day: 'Tue', val: 92 },
                    { day: 'Wed', val: 88 },
                    { day: 'Thu', val: 90 },
                    { day: 'Fri', val: 89 },
                    { day: 'Sat', val: 84 }
                  ].map(bar => (
                    <div key={bar.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-800)' }}>{bar.val}%</span>
                      <div style={{ width: '100%', height: `${bar.val * 1.3}px`, background: 'linear-gradient(180deg, #0ea5e9 0%, #e0f2fe 100%)', borderRadius: '6px 6px 0 0' }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fee Collection Bar Chart */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Fee Collection</h4>
                  <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>₹8.4L Collected</span>
                </div>
                <div style={{ height: '160px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                  {[
                    { month: 'Jan', val: 70 },
                    { month: 'Feb', val: 85 },
                    { month: 'Mar', val: 65 },
                    { month: 'Apr', val: 95 }
                  ].map(b => (
                    <div key={b.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '100%', height: `${b.val * 1.3}px`, background: 'linear-gradient(180deg, #10b981 0%, #1e3a8a 100%)', borderRadius: '6px 6px 0 0' }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Classes Live Tracker */}
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Live Classrooms & Batches</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div style={{ padding: '12px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
                  <span className="badge badge-success" style={{ marginBottom: '4px' }}>Room 204 • Active</span>
                  <h5 style={{ fontSize: '14px', fontWeight: 700 }}>Physics (JEE 12 - A)</h5>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ms. Priya Shah • 35 Students</p>
                </div>
                <div style={{ padding: '12px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
                  <span className="badge badge-accent" style={{ marginBottom: '4px' }}>Room 201 • Active</span>
                  <h5 style={{ fontSize: '14px', fontWeight: 700 }}>Chemistry (NEET 12 - B)</h5>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mr. Rahul Verma • 29 Students</p>
                </div>
                <div style={{ padding: '12px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
                  <span className="badge badge-warning" style={{ marginBottom: '4px' }}>Room 102 • Next: 12:00 PM</span>
                  <h5 style={{ fontSize: '14px', fontWeight: 700 }}>Mathematics (Class 11 - A)</h5>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ms. Neha Kapoor • 32 Students</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            VIEW: STUDENTS MANAGEMENT (From ASPIRE THEME.png Row 4 Screen 26)
           ==================================================================== */}
        {activeMenu === 'students' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '300px' }}>
                <input
                  type="text"
                  placeholder="Search students by name or roll..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                <Plus size={16} />
                Add Student
              </button>
            </div>

            {/* Students Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Roll #</th>
                  <th style={{ padding: '10px' }}>Student Name</th>
                  <th style={{ padding: '10px' }}>Enrolled Course</th>
                  <th style={{ padding: '10px' }}>Today Attendance</th>
                  <th style={{ padding: '10px' }}>Average Score</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(std => (
                  <tr key={std.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>{std.roll}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>{std.name}</td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{std.course}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={`badge ${std.attendance === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                        {std.attendance}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--brand-800)' }}>{std.score}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge badge-success">{std.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ====================================================================
            VIEW: REPORTS & 1-CLICK EXPORT (From ASPIRE THEME.png Row 4 Screen 29)
           ==================================================================== */}
        {activeMenu === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { title: 'Attendance Report', desc: 'Daily, weekly & monthly attendance breakdowns' },
                { title: 'Performance Report', desc: 'Batch, subject & student test marks analytics' },
                { title: 'Fee Collection Report', desc: 'Paid, pending, and overdue fee audits' },
                { title: 'Enrollment Report', desc: 'New admissions & batch capacity status' }
              ].map(rep => (
                <div key={rep.title} className="card" style={{ padding: '18px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-900)' }}>{rep.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '14px' }}>{rep.desc}</p>
                  <button onClick={() => handleExport('pdf')} className="btn-secondary" style={{ width: '100%', fontSize: '11px', padding: '6px' }}>
                    Generate Summary
                  </button>
                </div>
              ))}
            </div>

            {/* Quick 1-Click Export Bar */}
            <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Quick Export Complete Dataset</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Export all institute records in 1-click without third-party fees.</p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleExport('csv')} className="btn-secondary" style={{ gap: '6px' }}>
                  <Download size={15} /> CSV
                </button>
                <button onClick={() => handleExport('xlsx')} className="btn-secondary" style={{ gap: '6px' }}>
                  <Download size={15} /> Excel
                </button>
                <button onClick={() => handleExport('pdf')} className="btn-primary" style={{ gap: '6px' }}>
                  <Download size={15} /> Printable PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Student */}
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99 }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '380px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Add New Student</h4>
              <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Student Name"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Enrolled Stream</label>
                  <select
                    value={newStudentCourse}
                    onChange={e => setNewStudentCourse(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '4px' }}
                  >
                    <option value="Std. 12 • JEE">Std. 12 • JEE Main + Adv</option>
                    <option value="Std. 12 • NEET">Std. 12 • NEET Medical</option>
                    <option value="Std. 11 • Science">Std. 11 • Science</option>
                    <option value="Std. 10 • Foundation">Std. 10 • Foundation</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    Enroll Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
