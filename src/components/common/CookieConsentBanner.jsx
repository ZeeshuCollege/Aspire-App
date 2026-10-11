import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, Settings, X } from 'lucide-react';
import { getCookiePreferences, saveCookiePreferences } from '../../lib/consentService';

export default function CookieConsentBanner({ onOpenLegalModal }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only display if user has not yet recorded cookie preferences
    const existing = getCookiePreferences();
    if (!existing) {
      // Short delay so page loads cleanly first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    saveCookiePreferences({ essential: true, functional: true, analytics: true });
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    saveCookiePreferences({ essential: true, functional: false, analytics: false });
    setIsVisible(false);
  };

  const handleCustomize = () => {
    if (onOpenLegalModal) {
      onOpenLegalModal('cookies');
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and local storage consent"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        maxWidth: '460px',
        margin: '0 auto',
        zIndex: 9998,
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.22)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Cookie size={19} />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Cookie & Data Storage Choice
            </h4>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Zero Ads • Privacy Protected
            </span>
          </div>
        </div>
        <button
          onClick={handleEssentialOnly}
          aria-label="Dismiss cookie notice and keep essential only"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px'
          }}
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
        ASPIRE Learning Centre uses essential local storage to keep your student/parent session active and manage academic notices. We do not use commercial ad trackers.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
        <button
          type="button"
          onClick={handleAcceptAll}
          className="btn-primary"
          style={{
            flex: '1 1 120px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: '10px'
          }}
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={handleEssentialOnly}
          className="btn-secondary"
          style={{
            flex: '1 1 110px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: '10px'
          }}
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={handleCustomize}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px 6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Settings size={12} /> Preferences
        </button>
      </div>
    </div>
  );
}
