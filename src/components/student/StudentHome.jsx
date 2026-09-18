import React from 'react';
import { Calendar, FileText, BookOpen, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function StudentHome({ user, onNavigate, onOpenTestPaper }) {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '90px' }}>
      {/* Greeting Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Good Morning,</span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-900)' }}>{user.name}</h2>
          <span style={{ fontSize: '11px', color: 'var(--accent-500)', fontWeight: 600 }}>{user.course}</span>
        </div>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
        />
      </div>

      {/* Today's Class Card (From ASPIRE THEME.png Row 1 Screen 3) */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        color: '#ffffff',
        boxShadow: '0 10px 25px rgba(2, 132, 199, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circle */}
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, fontWeight: 700 }}>
              Today's Class
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>Physics</h3>
            <p style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>10:00 AM - 11:00 AM • Room 204</p>
          </div>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 700
          }}>
            Ongoing
          </span>
        </div>

        <button
          onClick={() => onNavigate('classes')}
          style={{
            marginTop: '16px',
            background: '#ffffff',
            color: 'var(--brand-800)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          View Schedule
        </button>
      </div>

      {/* Quick Action Grid (4 Squircles from Theme) */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { id: 'attendance', label: 'Attendance', icon: CheckCircle2, bg: '#ecfdf5', color: '#10b981' },
            { id: 'tests', label: 'Tests', icon: FileText, bg: '#fffbeb', color: '#f59e0b' },
            { id: 'materials', label: 'Materials', icon: BookOpen, bg: '#eff6ff', color: '#2563eb' },
            { id: 'classes', label: 'Schedule', icon: Calendar, bg: '#f5f3ff', color: '#8b5cf6' }
          ].map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 6px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color, marginBottom: '6px' }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tests Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-900)' }}>Upcoming Tests</h4>
          <button
            onClick={() => onNavigate('tests')}
            style={{ background: 'none', border: 'none', color: 'var(--brand-800)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            View All
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 't-02', name: 'Chemistry Test', date: '16 Apr 2025 • 90 min', subject: 'Chemistry', iconColor: '#f59e0b' },
            { id: 't-03', name: 'Mathematics Test', date: '22 Apr 2025 • 90 min', subject: 'Mathematics', iconColor: '#8b5cf6' }
          ].map(test => (
            <div
              key={test.id}
              onClick={() => onOpenTestPaper({ title: test.name, subtitle: `${test.subject} • ${test.date}` })}
              className="card card-hover"
              style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: test.iconColor }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{test.name}</h5>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{test.date}</span>
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
