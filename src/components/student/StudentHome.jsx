import React from 'react';
import { Calendar, FileText, BookOpen, CheckCircle2 } from 'lucide-react';

export default function StudentHome({ user, onNavigate, onOpenTestPaper }) {
  return (
    <div style={{
      padding: '16px',
      minHeight: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      paddingBottom: '90px'
    }}>
      {/* Greeting Header - Compact Upward Placement with Square Avatar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 0 6px 0'
      }}>
        <div style={{ flex: 1, paddingRight: '14px' }}>
          <span style={{
            fontSize: 'clamp(15px, 3.8vw, 18px)',
            color: 'var(--text-muted)',
            fontWeight: 600,
            display: 'block',
            marginBottom: '4px',
            letterSpacing: '-0.01em'
          }}>
            Good Morning,
          </span>
          <h1 style={{
            fontSize: 'clamp(28px, 7vw, 34px)',
            fontWeight: 900,
            color: 'var(--brand-900)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: 0
          }}>
            {user.name}
          </h1>
        </div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: 'clamp(76px, 19vw, 90px)',
              height: 'clamp(76px, 19vw, 90px)',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '2px solid var(--border)',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)'
            }}
          />
        </div>
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
            <p style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>10:00 AM - 11:00 AM</p>
          </div>
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

      {/* Quick Action 2x2 Grid covering empty space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          flex: 1,
          minHeight: '260px'
        }}>
          {[
            {
              id: 'attendance',
              label: 'Attendance',
              desc: 'Check records & log',
              icon: CheckCircle2,
              bg: '#ecfdf5',
              color: '#10b981',
              border: '#bbf7d0'
            },
            {
              id: 'tests',
              label: 'Tests',
              desc: 'Upcoming & results',
              icon: FileText,
              bg: '#fffbeb',
              color: '#f59e0b',
              border: '#fde68a'
            },
            {
              id: 'materials',
              label: 'Materials',
              desc: 'Notes, PDFs & videos',
              icon: BookOpen,
              bg: '#eff6ff',
              color: '#2563eb',
              border: '#bfdbfe'
            },
            {
              id: 'classes',
              label: 'Schedule',
              desc: 'Lectures & routine',
              icon: Calendar,
              bg: '#f5f3ff',
              color: '#8b5cf6',
              border: '#ddd6fe'
            }
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
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: 'var(--surface)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '20px',
                  padding: '18px 12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: action.bg,
                  border: `1px solid ${action.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: action.color,
                  marginBottom: '10px'
                }}>
                  <Icon size={26} />
                </div>
                <span style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: 'var(--brand-900)',
                  marginBottom: '4px'
                }}>
                  {action.label}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--text-muted)'
                }}>
                  {action.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
