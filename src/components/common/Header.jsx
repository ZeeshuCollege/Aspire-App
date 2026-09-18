import React from 'react';
import { Bell, ShieldCheck, ChevronDown, LogOut } from 'lucide-react';

export default function Header({ currentRole, setRole, user, onOpenLogin, onLogout }) {
  const roles = ['student', 'teacher', 'parent', 'admin'];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
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

      {/* Role Switcher & Profile Actions */}
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
              padding: '6px 28px 6px 12px',
              fontSize: '12px',
              fontWeight: 600,
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

        {/* Notifications Icon */}
        <button
          style={{
            background: 'var(--surface-alt)',
            border: 'none',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
          title="Notifications"
        >
          <Bell size={16} color="var(--text-secondary)" />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '7px',
            height: '7px',
            background: 'var(--danger)',
            borderRadius: '50%'
          }} />
        </button>

        {/* User Avatar & Login/Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-800)' }}
            />
            <button
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--danger)',
                padding: '4px'
              }}
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
