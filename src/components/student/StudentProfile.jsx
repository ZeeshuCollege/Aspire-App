import React, { useState } from 'react';
import { User, Lock, HelpCircle, LogOut, ChevronRight, Award, ShieldCheck, Camera } from 'lucide-react';
import PersonalDetailsModal from './PersonalDetailsModal';
import ManagePasswordModal from './ManagePasswordModal';
import ChangeAvatarModal from '../common/ChangeAvatarModal';

export default function StudentProfile({ user, onLogout, onUpdateAvatar, onUpdateUser, onOpenPermissions }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isManagePasswordOpen, setIsManagePasswordOpen] = useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);

  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';
  const isAdmin = user?.role === 'admin';

  // Dynamic Subtitle
  const subtitle = isTeacher
    ? (user.subject || user.subjects || 'Physics Faculty')
    : isParent
    ? `Parent of ${user.linkedChild?.name || 'Rohan Sharma'}`
    : isAdmin
    ? 'System Administrator'
    : (user.course || '12th Science');

  // Dynamic Verification Badge
  const roleBadgeLabel = isTeacher
    ? 'Verified ASPIRE Teacher'
    : isParent
    ? 'Verified ASPIRE Parent'
    : isAdmin
    ? 'Verified ASPIRE Admin'
    : 'Verified ASPIRE Student';

  // Dynamic Personal Details Badge
  const personalDetailsBadge = isTeacher
    ? (user.employeeId || 'ID #018')
    : isParent
    ? 'Parent ID'
    : isAdmin
    ? 'Admin ID'
    : (user.rollNumber ? `#${user.rollNumber.split('-').pop()}` : 'Roll #104');

  const menuItems = [
    { icon: User, label: 'Personal Details', badge: personalDetailsBadge },
    { icon: Lock, label: 'Manage Password', badge: null },
    { icon: ShieldCheck, label: 'Device Permissions', badge: 'Active' },
    { icon: HelpCircle, label: 'Help & Support', badge: null }
  ];

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Profile</h3>

      {/* User Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={user.avatar}
            alt={user.name}
            onClick={() => setIsChangeAvatarOpen(true)}
            style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '2px solid var(--border)', cursor: 'pointer' }}
            title="Click to change profile picture"
          />
          <button
            type="button"
            onClick={() => setIsChangeAvatarOpen(true)}
            aria-label="Change profile picture"
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-800) 0%, var(--brand-600) 100%)',
              border: '2px solid #ffffff',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(30, 58, 138, 0.3)',
              transition: 'transform 0.15s ease'
            }}
            title="Change Profile Picture"
          >
            <Camera size={12} strokeWidth={2.5} />
          </button>
        </div>
        <div>
          <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>{user.name}</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>{subtitle}</p>
          <span className="badge badge-success" style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} />
            {roleBadgeLabel}
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
              onClick={() => {
                if (item.label === 'Personal Details') {
                  setIsDetailsOpen(true);
                } else if (item.label === 'Manage Password') {
                  setIsManagePasswordOpen(true);
                } else if (item.label === 'Device Permissions' && onOpenPermissions) {
                  onOpenPermissions();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: index < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
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

      {/* Personal Details Modal (0.5s Bottom-to-Top Pop-up) */}
      <PersonalDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        user={user}
        onSaveUser={onUpdateUser}
      />

      {/* Manage Password Modal (0.5s Bottom-to-Top Pop-up) */}
      <ManagePasswordModal
        isOpen={isManagePasswordOpen}
        onClose={() => setIsManagePasswordOpen(false)}
        user={user}
      />

      {/* Change Avatar Modal (0.5s Bottom-to-Top Pop-up, Camera & Media Access) */}
      <ChangeAvatarModal
        isOpen={isChangeAvatarOpen}
        onClose={() => setIsChangeAvatarOpen(false)}
        currentAvatar={user.avatar}
        onSaveAvatar={onUpdateAvatar}
      />

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
