import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

export default function Header({ currentRole, setRole, user, onOpenLogin, onLogout, onOpenNotifications, unreadCount = 0 }) {
  const roles = ['student', 'teacher', 'parent', 'admin'];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 18px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, var(--brand-800) 0%, var(--accent-500) 100%)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '18px',
          boxShadow: '0 3px 10px rgba(30, 58, 138, 0.25)'
        }}>
          ▲
        </div>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            ASPIRE
          </h2>
          <span style={{ fontSize: '10px', color: 'var(--accent-500)', fontWeight: 600, letterSpacing: '0.04em' }}>
            LEARNING CENTRE
          </span>
        </div>
      </div>

      {/* Right Controls: Role Toggle & Enlarged Notifications Bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Dynamic Role Quick Toggle */}
        <div style={{ position: 'relative' }}>
          <select
            value={currentRole}
            onChange={(e) => setRole(e.target.value)}
            style={{
              appearance: 'none',
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              padding: '7px 28px 7px 12px',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--brand-800)',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {roles.map(r => (
              <option key={r} value={r}>{r.toUpperCase()}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
        </div>

        {/* 20% Enlarged Notifications Icon shifted to the right */}
        <button
          onClick={onOpenNotifications}
          style={{
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
          title={`Notice Board ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell size={21} color="var(--brand-900)" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '7px',
              right: '7px',
              width: '9px',
              height: '9px',
              background: 'var(--danger)',
              borderRadius: '50%',
              border: '2px solid var(--surface)',
              animation: 'pulseGlow 2s infinite'
            }} />
          )}
        </button>
      </div>
    </header>
  );
}
