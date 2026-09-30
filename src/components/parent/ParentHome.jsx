import React from 'react';
import { Calendar, BarChart2, DollarSign, ChevronRight } from 'lucide-react';
import { DEFAULT_GREY_AVATAR } from '../../lib/mockData';

export default function ParentHome({ user, onNavigate, onOpenTestPaper }) {
  const child = user.linkedChild || {
    name: user.linkedChildName || 'Student',
    class: user.course || 'Enrolled Course',
    attendance: 0,
    tests: 0,
    performance: 0
  };

  return (
    <div className="view-transition-enter" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      {/* Parent Greeting - Sharp Architectural Alignment */}
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
            ACADEMIC_SYS // PARENT PORTAL
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
          <span className="badge badge-info" style={{ marginTop: '4px', display: 'inline-block' }}>
            VERIFIED GUARDIAN
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

      {/* Linked Child Card - Smooth Curved Block */}
      <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--accent-500)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <img
            src={child.avatar || DEFAULT_GREY_AVATAR}
            alt={child.name}
            style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1.5px solid var(--border)' }}
          />
          <div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>LINKED WARD</span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-900)', margin: '1px 0 0 0' }}>{child.name}</h4>
            <span style={{ fontSize: '11px', color: 'var(--accent-600)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{child.class}</span>
          </div>
        </div>

        {/* 3 Metric Boxes: Attendance, Tests, Performance */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div
            onClick={() => onNavigate('child')}
            style={{ background: 'var(--surface-alt)', border: '1px solid #bbf7d0', padding: '10px 6px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block' }}>Attendance</span>
            <strong style={{ fontSize: '17px', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>{child.attendance}%</strong>
          </div>

          <div
            onClick={() => onNavigate('performance')}
            style={{ background: 'var(--surface-alt)', border: '1px solid #bfdbfe', padding: '10px 6px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block' }}>Tests</span>
            <strong style={{ fontSize: '17px', color: 'var(--brand-800)', fontFamily: 'var(--font-mono)' }}>{child.tests}%</strong>
          </div>

          <div
            onClick={() => onNavigate('performance')}
            style={{ background: 'var(--surface-alt)', border: '1px solid #fed7aa', padding: '10px 6px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block' }}>Progress</span>
            <strong style={{ fontSize: '17px', color: 'var(--accent-600)', fontFamily: 'var(--font-mono)' }}>{child.performance}%</strong>
          </div>
        </div>
      </div>

      {/* Quick Navigation Rows */}
      <div className="card" style={{ padding: '4px 16px' }}>
        {[
          { id: 'child', label: 'Lecture Attendance Ledger', icon: Calendar, color: 'var(--success)' },
          { id: 'performance', label: 'Academic Performance Analytics', icon: BarChart2, color: 'var(--brand-700)' },
          { id: 'fees', label: 'Fee Account & Receipts', icon: DollarSign, color: 'var(--warning)' }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 0',
                borderBottom: index < 2 ? '1px solid var(--border-subtle)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={item.color} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-900)' }}>{item.label}</span>
              </div>
              <ChevronRight size={16} color="var(--brand-700)" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
