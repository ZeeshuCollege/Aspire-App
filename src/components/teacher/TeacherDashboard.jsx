import React from 'react';
import { PlusCircle, Upload, BookOpen, Clock, ChevronRight, Users } from 'lucide-react';

export default function TeacherDashboard({ user, onNavigate, onOpenCreateTest, onOpenUploadMaterial }) {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '90px' }}>
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
          <span style={{
            fontSize: '12px',
            color: 'var(--accent-500)',
            fontWeight: 700,
            display: 'inline-block',
            marginTop: '4px',
            background: 'var(--accent-50)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)'
          }}>
            {user.subject}
          </span>
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

      {/* Today's Classes Card (From ASPIRE THEME.png Row 2 Screen 9) */}
      <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--brand-800)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Today's Classes</h4>
          <span className="badge badge-accent">3 Lectures Today</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
            <div>
              <strong style={{ fontSize: '13px', display: 'block' }}>Class 10 - A • Physics</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>10:00 AM - 11:00 AM • Room 105</span>
            </div>
            <span className="badge badge-success">Ongoing</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--surface-alt)', borderRadius: '10px' }}>
            <div>
              <strong style={{ fontSize: '13px', display: 'block' }}>Class 12 - A • Physics</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>12:00 PM - 1:00 PM • Room 204</span>
            </div>
            <span className="badge badge-warning">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Quick Actions (From ASPIRE THEME.png Row 2 Screen 9) */}
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-900)', marginBottom: '12px' }}>Quick Action</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <button
            onClick={onOpenCreateTest}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <PlusCircle size={20} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, display: 'block', color: 'var(--text-primary)' }}>Create Test</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Schedule & Upload</span>
            </div>
          </button>

          <button
            onClick={onOpenUploadMaterial}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Upload size={20} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, display: 'block', color: 'var(--text-primary)' }}>Upload Material</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PDFs & Notes</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('batches')}
            style={{
              gridColumn: 'span 2',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <Users size={20} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, display: 'block', color: 'var(--text-primary)' }}>My Batches</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>4 Active Batches</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
