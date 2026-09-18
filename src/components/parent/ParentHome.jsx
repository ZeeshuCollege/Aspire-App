import React from 'react';
import { User, Calendar, FileText, BarChart2, DollarSign, ChevronRight, AlertCircle } from 'lucide-react';

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
      {/* Parent Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hello,</span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-900)' }}>{user.name}</h2>
          <span className="badge badge-info" style={{ marginTop: '2px' }}>Verified Parent</span>
        </div>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
        />
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

      {/* Upcoming Test Alert Card */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-900)' }}>Upcoming Assessment</h4>
          <span style={{ fontSize: '11px', color: 'var(--accent-500)', fontWeight: 600 }}>Tomorrow</span>
        </div>

        <div
          onClick={() => onOpenTestPaper({ title: 'Chemistry Test 02', subtitle: 'Organic Chemistry • 16 Apr 2025' })}
          className="card card-hover"
          style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '4px solid var(--warning)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--warning-tint)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} />
            </div>
            <div>
              <h5 style={{ fontSize: '14px', fontWeight: 700 }}>Chemistry Test 02</h5>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>16 Apr 2025 • 90 min</span>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
      </div>

      {/* Quick Navigation Rows (From Child Profile Screen 18) */}
      <div className="card" style={{ padding: '6px 16px' }}>
        {[
          { id: 'child', label: 'Attendance Calendar', icon: Calendar, color: '#10b981' },
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
