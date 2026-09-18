import React from 'react';
import { User, Calendar, BarChart2, DollarSign, ChevronRight } from 'lucide-react';

export default function ParentHome({ user, onNavigate, onOpenTestPaper }) {
  const child = user.linkedChild || {
    name: 'Rohan Sharma',
    class: 'Std. 12 • Science',
    attendance: 92,
    tests: 86,
    performance: 78
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '90px' }}>
      {/* Parent Greeting - Compact Upward Placement with Square Avatar */}
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
            Hello,
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
          <span className="badge badge-info" style={{ marginTop: '6px', display: 'inline-block' }}>
            Verified Parent
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

      {/* Linked Child Card (From ASPIRE THEME.png Row 3 Screen 17) */}
      <div className="card" style={{ padding: '18px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"
            alt={child.name}
            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-800)' }}
          />
          <div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>{child.name}</h4>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{child.class}</span>
          </div>
        </div>

        {/* 3 Metric Pills: Attendance, Tests, Performance */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div
            onClick={() => onNavigate('child')}
            style={{ background: '#ecfdf5', padding: '10px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600, display: 'block' }}>Attendance</span>
            <strong style={{ fontSize: '18px', color: '#15803d' }}>{child.attendance}%</strong>
          </div>

          <div
            onClick={() => onNavigate('performance')}
            style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600, display: 'block' }}>Tests</span>
            <strong style={{ fontSize: '18px', color: '#1e3a8a' }}>{child.tests}%</strong>
          </div>

          <div
            onClick={() => onNavigate('performance')}
            style={{ background: '#fef3c7', padding: '10px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, display: 'block' }}>Progress</span>
            <strong style={{ fontSize: '18px', color: '#b45309' }}>{child.performance}%</strong>
          </div>
        </div>
      </div>


      {/* Quick Navigation Rows (From Child Profile Screen 18) */}
      <div className="card" style={{ padding: '6px 16px' }}>
        {[
          { id: 'child', label: 'Lecture Attendance', icon: Calendar, color: '#10b981' },
          { id: 'performance', label: 'Academic Performance', icon: BarChart2, color: '#0ea5e9' },
          { id: 'fees', label: 'Fee Details & Receipts', icon: DollarSign, color: '#f59e0b' }
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
                padding: '12px 0',
                borderBottom: index < 2 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={item.color} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
