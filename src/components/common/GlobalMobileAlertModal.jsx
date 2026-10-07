import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Copy,
  Check
} from 'lucide-react';
import { registerAlertHandler, unregisterAlertHandler } from '../../lib/mobileAlert';

export default function GlobalMobileAlertModal() {
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    registerAlertHandler((alertData) => {
      setIsDismissing(false);
      setCurrentAlert(alertData);
    });

    return () => {
      unregisterAlertHandler();
    };
  }, []);

  if (!currentAlert) return null;

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      if (typeof currentAlert.onDismiss === 'function') {
        try {
          currentAlert.onDismiss();
        } catch (e) {
          console.error(e);
        }
      }
      setCurrentAlert(null);
      setIsDismissing(false);
    }, 180);
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  // Type configuration
  const typeConfigs = {
    success: {
      bg: '#ecfdf5',
      border: '#a7f3d0',
      color: '#059669',
      icon: <CheckCircle2 size={22} color="#10b981" />
    },
    warning: {
      bg: '#fffbeb',
      border: '#fde68a',
      color: '#d97706',
      icon: <AlertTriangle size={22} color="#f59e0b" />
    },
    error: {
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#dc2626',
      icon: <AlertCircle size={22} color="#ef4444" />
    },
    info: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      color: '#2563eb',
      icon: <Info size={22} color="#3b82f6" />
    }
  };

  const config = typeConfigs[currentAlert.type] || typeConfigs.info;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: isDismissing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.2s ease forwards'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '340px',
          background: 'var(--surface, #ffffff)',
          borderRadius: '20px',
          border: '1px solid var(--border, #e2e8f0)',
          boxShadow: '0 20px 45px -8px rgba(10, 31, 61, 0.3)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxSizing: 'border-box',
          animation: isDismissing
            ? 'alertPopOut 0.18s ease forwards'
            : 'alertPopIn 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Header: Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: config.bg,
              border: `1px solid ${config.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {config.icon}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              style={{
                fontSize: '15.5px',
                fontWeight: 800,
                color: 'var(--brand-900, #0f172a)',
                margin: 0,
                lineHeight: 1.3,
                wordBreak: 'break-word'
              }}
            >
              {currentAlert.title || 'Notice'}
            </h3>
          </div>
        </div>

        {/* Credentials Box (if email/password present) */}
        {currentAlert.credentials && (
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {currentAlert.credentials.email && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Email ID
                  </span>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--brand-900, #0f172a)', wordBreak: 'break-all' }}>
                    {currentAlert.credentials.email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentAlert.credentials.email, 'email')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedField === 'email' ? '#16a34a' : 'var(--text-muted, #64748b)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '11px',
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                  title="Copy Email"
                >
                  {copiedField === 'email' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            )}

            {currentAlert.credentials.password && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Password
                  </span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-900, #0f172a)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {currentAlert.credentials.password}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentAlert.credentials.password, 'password')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedField === 'password' ? '#16a34a' : 'var(--text-muted, #64748b)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '11px',
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                  title="Copy Password"
                >
                  {copiedField === 'password' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        {currentAlert.message && (
          <p
            style={{
              fontSize: '12.5px',
              color: 'var(--text-secondary, #475569)',
              margin: 0,
              lineHeight: 1.5,
              whiteSpace: 'pre-line',
              wordBreak: 'break-word'
            }}
          >
            {currentAlert.message}
          </p>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '11px 16px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(10, 31, 61, 0.15)',
            marginTop: '2px'
          }}
        >
          {currentAlert.buttonText || 'OK'}
        </button>
      </div>
    </div>
  );
}
