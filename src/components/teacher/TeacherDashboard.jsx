import React from 'react';
import { PlusCircle, Users } from 'lucide-react';

export default function TeacherDashboard({ user, onNavigate, onOpenCreateTest }) {
  return (
    <div className="view-transition-enter" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      {/* Greeting Header - Sharp Architectural Alignment */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2px 0 6px 0',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px'
      }}>
        <div style={{ flex: 1, paddingRight: '14px' }}>
          <span style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            display: 'block',
            marginBottom: '2px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            ACADEMIC_SYS // FACULTY CONSOLE
          </span>
          <h1 style={{
            fontSize: 'clamp(24px, 6.5vw, 30px)',
            fontWeight: 900,
            color: 'var(--brand-900)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: 0
          }}>
            {user.name}
          </h1>
          <span className="badge badge-accent" style={{ marginTop: '4px' }}>
            {user.subject || 'Faculty'} • ACTIVE
          </span>
        </div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: 'clamp(68px, 18vw, 80px)',
              height: 'clamp(68px, 18vw, 80px)',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '2.5px solid var(--accent-500)',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.15)'
            }}
          />
        </div>
      </div>

      {/* Today's Classes Card - Smooth Curved Block */}
      <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--accent-500)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>Today's Lectures</h4>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BATCH_ALLOCATION</span>
          </div>
          <span className="badge badge-accent" style={{ borderRadius: '9999px' }}>3 Lectures Today</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface-alt)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
            <div>
              <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>Class 10 - A • Physics</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>10:00 AM - 11:00 AM • Room 105</span>
            </div>
            <span className="badge badge-success" style={{ borderRadius: '9999px' }}>Ongoing</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface-alt)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
            <div>
              <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>Class 12 - A • Physics</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>12:00 PM - 1:00 PM • Room 204</span>
            </div>
            <span className="badge badge-warning" style={{ borderRadius: '9999px' }}>Upcoming</span>
          </div>
        </div>
      </div>

      {/* Quick Actions - Smooth Curved Tiles */}
      <div>
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)', marginBottom: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Operations & Batch Actions
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <button
            onClick={onOpenCreateTest}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 12px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: 'var(--shadow-card)',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-400)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff7ed', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-600)', flexShrink: 0 }}>
              <PlusCircle size={20} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 800, display: 'block', color: 'var(--brand-900)' }}>Create Test</span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Upload Paper</span>
            </div>
          </button>

          <button
            onClick={onOpenUploadMaterial}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 12px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: 'var(--shadow-card)',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-400)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--brand-50)', border: '1px solid var(--brand-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-600)', flexShrink: 0 }}>
              <Upload size={20} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 800, display: 'block', color: 'var(--brand-900)' }}>Upload Files</span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PDFs & Notes</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('batches')}
            style={{
              gridColumn: 'span 2',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: 'var(--shadow-card)',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-400)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-900)', flexShrink: 0 }}>
              <Users size={20} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 800, display: 'block', color: 'var(--brand-900)' }}>My Batches & Rosters</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>4 Active Batches • Mark Attendance</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
