import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, Phone, BookOpen, Heart, ShieldCheck,
  Copy, Check, ChevronRight, Trash2, Users, GraduationCap,
  Calendar, Award, DollarSign, CheckCircle2, Clock, Eye, EyeOff,
  AlertCircle
} from 'lucide-react';
import { getStoredFees, formatFeeFraction } from '../../lib/feeService';
import { getUserPassword } from '../../lib/userAuthStore';

export default function AdminUserDetailsModal({
  isOpen,
  onClose,
  userType, // 'student' | 'parent' | 'teacher'
  userData,
  onDeleteUser,
  onSwitchUser, // (type, data) => void
  onOpenPerformance,
  onOpenAttendance
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Close animation handler
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setShowPassword(false);
      setCopiedKey(null);
    }, 280);
  };

  // Android hardware / gesture back button support
  useEffect(() => {
    if (!isOpen) return;
    const handleAppBack = (e) => {
      handleClose();
      e.detail?.markHandled();
    };
    window.addEventListener('app:back', handleAppBack);
    return () => window.removeEventListener('app:back', handleAppBack);
  }, [isOpen]);

  if (!isOpen || !userData) return null;

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText?.(String(text));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Determine user role and styling
  const isStudent = userType === 'student';
  const isParent = userType === 'parent';
  const isTeacher = userType === 'teacher' || userType === 'faculty';

  // Role metadata
  const roleConfig = {
    student: {
      title: 'Student Details',
      badge: 'STUDENT',
      color: '#2563eb',
      bgLight: '#eff6ff',
      borderLight: '#bfdbfe',
      icon: GraduationCap,
      avatarGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    },
    parent: {
      title: 'Parent Details',
      badge: 'GUARDIAN',
      color: '#059669',
      bgLight: '#ecfdf5',
      borderLight: '#a7f3d0',
      icon: Users,
      avatarGradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
    },
    teacher: {
      title: 'Faculty Details',
      badge: 'FACULTY',
      color: '#8b5cf6',
      bgLight: '#f5f3ff',
      borderLight: '#ddd6fe',
      icon: BookOpen,
      avatarGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
    }
  }[isStudent ? 'student' : isParent ? 'parent' : 'teacher'];

  // Retrieve password if available
  const storedPassword = userData.password || getUserPassword(userData.email);

  // Look up fee details for student
  let feeRecord = null;
  if (isStudent) {
    try {
      const fees = getStoredFees() || [];
      feeRecord = fees.find(f =>
        (f.studentId && f.studentId === userData.id) ||
        (f.studentRoll && (f.studentRoll === userData.roll || f.studentRoll === userData.rollNumber)) ||
        (f.studentName && f.studentName.toLowerCase() === (userData.name || '').toLowerCase())
      );
    } catch {}
  }

  // Parse batches array for teacher
  const teacherBatches = isTeacher
    ? Array.isArray(userData.batches)
      ? userData.batches
      : typeof userData.batches === 'string'
        ? userData.batches.split(',').map(b => b.trim()).filter(Boolean)
        : []
    : [];

  // Parse subjects for teacher
  const teacherSubjects = isTeacher
    ? Array.isArray(userData.subjects)
      ? userData.subjects
      : typeof userData.subject === 'string'
        ? userData.subject.split(',').map(s => s.trim()).filter(Boolean)
        : []
    : [];

  const RoleIcon = roleConfig.icon;

  return (
    <div
      className={`modal-backdrop-05s ${isClosing ? 'closing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        zIndex: 1050,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div
        className={`modal-sheet-05s ${isClosing ? 'closing' : ''}`}
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface, #ffffff)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Top Drag Handle */}
        <div className="sheet-drag-handle" style={{ cursor: 'pointer' }} onClick={handleClose} />

        {/* Modal Top Nav Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border, #e2e8f0)',
          background: 'var(--surface, #ffffff)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              background: roleConfig.bgLight,
              color: roleConfig.color,
              border: `1px solid ${roleConfig.borderLight}`
            }}>
              <RoleIcon size={12} />
              {roleConfig.badge}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>
              Profile View
            </span>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary, #475569)',
              transition: 'background 0.15s ease'
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div style={{
          padding: '18px 20px 32px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>

          {/* ── 1. Hero Identity Card ── */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            border: '1.5px solid var(--border, #e2e8f0)',
            borderRadius: '16px',
            padding: '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            {/* Avatar */}
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              background: roleConfig.avatarGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              flexShrink: 0
            }}>
              {(userData.name || 'U').charAt(0).toUpperCase()}
            </div>

            {/* Name & Quick Badges */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: 'var(--brand-900, #0f172a)',
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  {userData.name || 'Unknown User'}
                </h3>
              </div>

              {/* Sub-label */}
              <div style={{ fontSize: '12px', color: 'var(--text-secondary, #475569)', marginTop: '4px', fontWeight: 600 }}>
                {isStudent && (
                  <span>
                    Roll #{userData.roll || userData.rollNumber || 'N/A'} • <strong style={{ color: roleConfig.color }}>{userData.course || 'General'}</strong>
                  </span>
                )}
                {isParent && (
                  <span>
                    Guardian of <strong style={{ color: roleConfig.color }}>{userData.linkedChildName || 'Student'}</strong>
                  </span>
                )}
                {isTeacher && (
                  <span>
                    {userData.designation || 'Faculty'} • <strong style={{ color: roleConfig.color }}>{userData.subject || userData.subjects || 'Academics'}</strong>
                  </span>
                )}
              </div>

              {/* Status Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: (userData.status === 'Inactive' ? '#fef2f2' : '#ecfdf5'),
                  color: (userData.status === 'Inactive' ? '#dc2626' : '#059669'),
                  border: `1px solid ${userData.status === 'Inactive' ? '#fca5a5' : '#a7f3d0'}`
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: (userData.status === 'Inactive' ? '#dc2626' : '#10b981')
                  }} />
                  {userData.status || 'Active'}
                </span>

                {isStudent && userData.course && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: '#f1f5f9',
                    color: 'var(--brand-900, #0f172a)'
                  }}>
                    {userData.course}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── 2. Quick Action Bar (Call, Email, WhatsApp) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {/* Phone Call */}
            {(userData.phone || userData.parentPhone) ? (
              <a
                href={`tel:${(userData.phone || userData.parentPhone).replace(/\s+/g, '')}`}
                style={{
                  padding: '10px 8px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  color: '#15803d',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                <Phone size={16} />
                <span>Call</span>
              </a>
            ) : (
              <div style={{
                padding: '10px 8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600
              }}>
                <Phone size={16} />
                <span>No Phone</span>
              </div>
            )}

            {/* Email */}
            {userData.email ? (
              <a
                href={`mailto:${userData.email}`}
                style={{
                  padding: '10px 8px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  color: '#1d4ed8',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                <Mail size={16} />
                <span>Email</span>
              </a>
            ) : (
              <div style={{
                padding: '10px 8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600
              }}>
                <Mail size={16} />
                <span>No Email</span>
              </div>
            )}

            {/* Copy Info Button */}
            <button
              onClick={() => copyToClipboard(
                `Name: ${userData.name}\nRole: ${userType}\nEmail: ${userData.email || 'N/A'}\nPhone: ${userData.phone || userData.parentPhone || 'N/A'}`,
                'all'
              )}
              style={{
                padding: '10px 8px',
                background: copiedKey === 'all' ? '#dcfce7' : '#f8fafc',
                border: `1px solid ${copiedKey === 'all' ? '#86efac' : '#e2e8f0'}`,
                borderRadius: '10px',
                color: copiedKey === 'all' ? '#15803d' : 'var(--text-secondary, #475569)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {copiedKey === 'all' ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedKey === 'all' ? 'Copied!' : 'Share Info'}</span>
            </button>
          </div>

          {/* ── 3. STUDENT SPECIFIC: Academic Highlights ── */}
          {isStudent && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--brand-900, #0f172a)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Academic Performance & Attendance
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', marginBottom: '2px' }}>
                    <CheckCircle2 size={14} />
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>Attendance</span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>
                    {userData.attendance || (userData.overallAttendance ? `${userData.overallAttendance}%` : 'Present')}
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', marginBottom: '2px' }}>
                    <Award size={14} />
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>Score Average</span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>
                    {userData.score || (userData.overallPerformance ? `${userData.overallPerformance}%` : '85%')}
                  </div>
                </div>
              </div>

              {/* Fee status indicator if available */}
              {feeRecord && (
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={15} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Fee Status</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-900)' }}>
                        {formatFeeFraction(feeRecord.paidAmount || 0, feeRecord.totalAmount || 0)}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: feeRecord.status === 'Paid' ? '#ecfdf5' : '#fef3c7',
                    color: feeRecord.status === 'Paid' ? '#059669' : '#d97706'
                  }}>
                    {feeRecord.status || 'Active'}
                  </span>
                </div>
              )}

              {/* Link to Detailed Student Performance Modal */}
              {onOpenPerformance && (
                <button
                  onClick={() => {
                    handleClose();
                    onOpenPerformance(userData);
                  }}
                  style={{
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '10px',
                    color: '#2563eb',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    marginTop: '2px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={15} />
                    View Detailed Analytics & Marks
                  </span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}

          {/* ── 4. Contact & Identity Information ── */}
          <div style={{
            background: 'var(--surface, #ffffff)',
            border: '1px solid var(--border, #e2e8f0)',
            borderRadius: '14px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '10px 14px',
              background: '#f8fafc',
              borderBottom: '1px solid var(--border, #e2e8f0)',
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--brand-900)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Contact & Credentials
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Email */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '11px 14px',
                borderBottom: '1px solid #f1f5f9',
                fontSize: '12.5px'
              }}>
                <span style={{ color: 'var(--text-muted, #64748b)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} /> Email
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-900)' }}>
                    {userData.email || 'Not registered'}
                  </span>
                  {userData.email && (
                    <button
                      onClick={() => copyToClipboard(userData.email, 'email')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedKey === 'email' ? '#16a34a' : '#94a3b8', padding: '2px' }}
                      title="Copy Email"
                    >
                      {copiedKey === 'email' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '11px 14px',
                borderBottom: '1px solid #f1f5f9',
                fontSize: '12.5px'
              }}>
                <span style={{ color: 'var(--text-muted, #64748b)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} /> Phone
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-900)' }}>
                    {userData.phone || userData.parentPhone || 'Not set'}
                  </span>
                  {(userData.phone || userData.parentPhone) && (
                    <button
                      onClick={() => copyToClipboard(userData.phone || userData.parentPhone, 'phone')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedKey === 'phone' ? '#16a34a' : '#94a3b8', padding: '2px' }}
                      title="Copy Phone"
                    >
                      {copiedKey === 'phone' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Blood Group (if present) */}
              {userData.bloodGroup && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '11px 14px',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '12.5px'
                }}>
                  <span style={{ color: 'var(--text-muted, #64748b)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={14} /> Blood Group
                  </span>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>
                    {userData.bloodGroup}
                  </span>
                </div>
              )}

              {/* Password / Credentials (Admin Insight) */}
              {storedPassword && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '11px 14px',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '12.5px',
                  background: '#fcfcfd'
                }}>
                  <span style={{ color: 'var(--text-muted, #64748b)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} /> Password
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontWeight: 700,
                      fontFamily: showPassword ? 'inherit' : 'var(--font-mono, monospace)',
                      color: 'var(--brand-900)'
                    }}>
                      {showPassword ? storedPassword : '••••••••'}
                    </span>
                    <button
                      onClick={() => setShowPassword(p => !p)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
                      title={showPassword ? 'Hide' : 'Show'}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(storedPassword, 'pass')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedKey === 'pass' ? '#16a34a' : '#94a3b8', padding: '2px' }}
                      title="Copy Password"
                    >
                      {copiedKey === 'pass' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}

              {/* System Identifier */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '11px 14px',
                fontSize: '12.5px'
              }}>
                <span style={{ color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>System ID</span>
                <span style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11.5px',
                  color: 'var(--text-secondary, #475569)',
                  background: '#f1f5f9',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {userData.id || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* ── 5. STUDENT: Linked Parent Card ── */}
          {isStudent && (
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #bbf7d0',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#047857',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Users size={13} />
                  Parent / Guardian Details
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: '999px',
                  background: userData.parentName ? '#dcfce7' : '#f1f5f9',
                  color: userData.parentName ? '#15803d' : '#64748b'
                }}>
                  {userData.parentName ? 'Linked' : 'Not Linked'}
                </span>
              </div>

              {userData.parentName ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                        {userData.parentName}
                      </h4>
                      {userData.parentPhone && (
                        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          📞 {userData.parentPhone}
                        </span>
                      )}
                      {userData.parentEmail && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          ✉️ {userData.parentEmail}
                        </div>
                      )}
                    </div>

                    {userData.parentPhone && (
                      <a
                        href={`tel:${userData.parentPhone.replace(/\s+/g, '')}`}
                        style={{
                          padding: '6px 12px',
                          background: '#10b981',
                          color: '#ffffff',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Phone size={12} /> Call Parent
                      </a>
                    )}
                  </div>

                  {onSwitchUser && (
                    <button
                      onClick={() => onSwitchUser('parent', {
                        id: userData.parentId || `p-${userData.id}`,
                        name: userData.parentName,
                        phone: userData.parentPhone || '',
                        email: userData.parentEmail || '',
                        linkedChildName: userData.name,
                        linkedChildRoll: userData.roll,
                        linkedChildCourse: userData.course,
                        status: 'Active'
                      })}
                      style={{
                        padding: '8px 10px',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        color: '#15803d',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        marginTop: '4px'
                      }}
                    >
                      <span>Switch to Parent Profile</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                  No guardian record currently attached to this student.
                </div>
              )}
            </div>
          )}

          {/* ── 6. PARENT: Linked Child Details ── */}
          {isParent && (
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#1d4ed8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <GraduationCap size={14} />
                  Linked Student (Ward)
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: '999px',
                  background: '#dbeafe',
                  color: '#1e40af'
                }}>
                  {userData.linkedChildCourse || 'Enrolled'}
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                  {userData.linkedChildName || 'Aarav Sharma'}
                </h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '3px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>Roll #{userData.linkedChildRoll || '101'}</span>
                  <span>•</span>
                  <span>{userData.linkedChildCourse || 'JEE'}</span>
                </div>
                {userData.linkedChildEmail && (
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ✉️ {userData.linkedChildEmail}
                  </div>
                )}
              </div>

              {onSwitchUser && (
                <button
                  onClick={() => onSwitchUser('student', {
                    id: userData.linkedChildId || userData.studentId || `s-${userData.id}`,
                    name: userData.linkedChildName,
                    roll: userData.linkedChildRoll,
                    course: userData.linkedChildCourse,
                    email: userData.linkedChildEmail || '',
                    parentName: userData.name,
                    parentPhone: userData.phone,
                    status: 'Active'
                  })}
                  style={{
                    padding: '8px 12px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    color: '#1d4ed8',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <span>Open Student Profile</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}

          {/* ── 7. TEACHER / FACULTY: Teaching Assignment ── */}
          {isTeacher && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--brand-900)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <BookOpen size={13} color="#8b5cf6" />
                Assigned Batches & Subjects
              </span>

              {/* Batches Pills */}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Batches ({teacherBatches.length || 1}):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {teacherBatches.length > 0 ? teacherBatches.map(b => (
                    <span key={b} style={{
                      padding: '4px 10px',
                      background: '#ffffff',
                      border: '1px solid #ddd6fe',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#6d28d9'
                    }}>
                      {b}
                    </span>
                  )) : (
                    <span style={{
                      padding: '4px 10px',
                      background: '#ffffff',
                      border: '1px solid #ddd6fe',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#6d28d9'
                    }}>
                      {userData.batches || 'General Faculty'}
                    </span>
                  )}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Subjects:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {teacherSubjects.length > 0 ? teacherSubjects.map(s => (
                    <span key={s} style={{
                      padding: '4px 10px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--brand-900)'
                    }}>
                      {s}
                    </span>
                  )) : (
                    <span style={{
                      padding: '4px 10px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--brand-900)'
                    }}>
                      {userData.subject || 'Academics'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── 8. Management & Deletion Bar ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '8px',
            borderTop: '1px solid #f1f5f9'
          }}>
            {onDeleteUser && (
              <button
                onClick={() => {
                  const confirmMsg = `Are you sure you want to remove ${userData.name || 'this user'} from the institute database?`;
                  if (window.confirm(confirmMsg)) {
                    handleClose();
                    onDeleteUser(userType, userData);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  padding: '6px 0'
                }}
              >
                <Trash2 size={14} /> Remove User
              </button>
            )}

            <button
              onClick={handleClose}
              className="btn-secondary"
              style={{
                padding: '8px 18px',
                fontSize: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                marginLeft: 'auto'
              }}
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
