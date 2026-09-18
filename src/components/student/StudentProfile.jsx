import React from 'react';
import { User, Lock, Bell, HelpCircle, LogOut, ChevronRight, Award, ShieldCheck } from 'lucide-react';

export default function StudentProfile({ user, onLogout }) {
  const menuItems = [
    { icon: User, label: 'Personal Details', badge: 'Roll #104' },
    { icon: Lock, label: 'Change Password', badge: null },
    { icon: Bell, label: 'Notifications', badge: 'On' },
    { icon: HelpCircle, label: 'Help & Support', badge: null }
  ];

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Profile</h3>

      {/* User Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border)' }}
        />
        <div>
          <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>{user.name}</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.course}</p>
          <span className="badge badge-success" style={{ marginTop: '6px' }}>
            <ShieldCheck size={12} />
            Verified ASPIRE Student
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="card" style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column' }}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: index < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color="var(--brand-800)" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.badge && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.badge}</span>
                )}
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Out Button */}
      <button
        onClick={onLogout}
        style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: 'var(--danger)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px',
          fontSize: '14px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <LogOut size={16} />
        Log Out
      </button>
    </div>
  );
}
