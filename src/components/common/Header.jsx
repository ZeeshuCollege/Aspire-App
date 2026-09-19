import React from 'react';
import { Bell } from 'lucide-react';

export default function Header({ currentRole, user, onOpenLogin, onLogout, onOpenNotifications, unreadCount = 0 }) {
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
        <img
          src="/logo.png"
          alt="ASPIRE Logo"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            objectFit: 'contain',
            boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)'
          }}
        />
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            ASPIRE
          </h2>
          <span style={{ fontSize: '10px', color: 'var(--accent-500)', fontWeight: 600, letterSpacing: '0.04em' }}>
            LEARNING CENTRE
          </span>
        </div>
      </div>

      {/* Right Controls: Role Badge & Notifications Bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'var(--surface-alt)',
          border: '1px solid var(--border)',
          fontSize: '11px',
          fontWeight: 800,
          color: 'var(--brand-900)',
          letterSpacing: '0.04em'
        }}>
          {currentRole?.toUpperCase() || 'ADMIN'}
        </span>

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
