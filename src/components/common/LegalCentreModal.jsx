import React, { useState, useEffect } from 'react';
import { 
  X, Shield, FileText, DollarSign, Cookie, 
  ExternalLink, CheckCircle2, AlertCircle, Building2, 
  Mail, Bell, Lock, Award, HeartHandshake, Trash2, Check
} from 'lucide-react';
import { 
  getCookiePreferences, saveCookiePreferences,
  getCommunicationPreferences, saveCommunicationPreferences,
  recordTermsAndPrivacyConsent
} from '../../lib/consentService';

export default function LegalCentreModal({ isOpen, onClose, initialTab = 'privacy', onOpenDeleteAccount }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [cookiePrefs, setCookiePrefs] = useState(() => getCookiePreferences() || { essential: true, functional: true, analytics: false });
  const [cookieSaved, setCookieSaved] = useState(false);
  const [commPrefs, setCommPrefs] = useState(() => getCommunicationPreferences());
  const [commSaved, setCommSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'privacy');
      setCookiePrefs(getCookiePreferences() || { essential: true, functional: true, analytics: false });
      setCommPrefs(getCommunicationPreferences());
      setCookieSaved(false);
      setCommSaved(false);
    }
  }, [isOpen, initialTab]);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveCookies = () => {
    saveCookiePreferences(cookiePrefs);
    setCookieSaved(true);
    setTimeout(() => setCookieSaved(false), 2500);
  };

  const handleSaveComm = () => {
    saveCommunicationPreferences(commPrefs);
    setCommSaved(true);
    setTimeout(() => setCommSaved(false), 2500);
  };

  const navItems = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'refund', label: 'Refund Policy', icon: DollarSign },
    { id: 'cookies', label: 'Cookie Preferences', icon: Cookie },
    { id: 'sdks', label: 'Third-Party SDKs', icon: Lock },
    { id: 'disclaimers', label: 'Academic Disclaimers', icon: Award },
    { id: 'business', label: 'Institute Details', icon: Building2 },
    { id: 'communications', label: 'Communication Preferences', icon: Bell }
  ];

  return (
    <div
      className="modal-backdrop-05s"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Legal & Compliance Centre"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
    >
      <div
        className="modal-sheet-05s"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '92vh',
          background: 'var(--surface, #ffffff)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        <div className="sheet-drag-handle" style={{ alignSelf: 'center', marginTop: '10px' }} />

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px 10px',
          borderBottom: '1px solid var(--border, #e2e8f0)'
        }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--brand-900, #0f172a)', margin: 0 }}>
              Legal & Compliance Centre
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', fontFamily: 'var(--font-mono, monospace)' }}>
              ASPIRE Learning Centre • Verified Policy Framework
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Legal Centre"
            style={{
              background: 'var(--surface-alt, #f1f5f9)',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary, #475569)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '8px 14px',
          gap: '8px',
          borderBottom: '1px solid var(--border, #e2e8f0)',
          background: 'var(--surface-alt, #f8fafc)',
          scrollbarWidth: 'none'
        }}>
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--accent-600, #0284c7)' : '1px solid var(--border, #e2e8f0)',
                  background: isActive ? 'var(--brand-900, #0f172a)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--text-secondary, #475569)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={13} color={isActive ? '#38bdf8' : 'currentColor'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Viewport */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 18px',
          fontSize: '13px',
          color: 'var(--text-primary, #1e293b)',
          lineHeight: 1.6
        }}>

          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--brand-900, #0f172a)' }}>
                  Privacy Policy (India DPDP Act 2023 Compliant)
                </h4>
                <a
                  href="/privacy-policy.html"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11.5px', color: 'var(--accent-600, #0284c7)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 700 }}
                >
                  Open Full Web Page <ExternalLink size={12} />
                </a>
              </div>
              <p>
                ASPIRE Learning Centre protects your personal educational information under strict data minimization guidelines:
              </p>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <ul style={{ margin: 0, paddingLeft: '18px' }}>
                  <li><strong>Data Processed:</strong> Student name, enrolled course (JEE/NEET/Boards), roll number, parent phone number, attendance logs, and test performance.</li>
                  <li><strong>Data Security:</strong> Encrypted in transit (TLS 1.3 / HTTPS) and isolated at rest with Supabase Row Level Security (RLS).</li>
                  <li><strong>Device Permissions:</strong> Only optional Camera (for user profile photo) and Notifications (for class attendance & schedule alerts). Zero background tracking, location, or microphone access.</li>
                  <li><strong>Zero Ads & Data Sales:</strong> We do not sell data or broker student profiles to third-party ad networks.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--brand-900, #0f172a)' }}>
                  Terms of Service
                </h4>
                <a
                  href="/terms-of-service.html"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11.5px', color: 'var(--accent-600, #0284c7)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 700 }}
                >
                  Open Full Web Page <ExternalLink size={12} />
                </a>
              </div>
              <p>
                By using the ASPIRE Learning Centre ecosystem, enrolled students, parents, and faculty agree to the following terms:
              </p>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <ul style={{ margin: 0, paddingLeft: '18px' }}>
                  <li><strong>Coaching Scope:</strong> Primary coaching instruction is delivered offline at our physical coaching center. This app is an administrative companion portal.</li>
                  <li><strong>Intellectual Property:</strong> Study materials, test question papers, and solutions are proprietary to ASPIRE and may not be redistributed.</li>
                  <li><strong>Account Safety:</strong> You must keep your credentials confidential. Parents supervise accounts for minors.</li>
                  <li><strong>Disciplinary Code:</strong> Harassment, academic cheating, and platform tampering may result in termination of digital access and offline disciplinary action.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND POLICY */}
          {activeTab === 'refund' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--brand-900, #0f172a)' }}>
                  Tuition Fee & Refund Policy
                </h4>
                <a
                  href="/refund-policy.html"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11.5px', color: 'var(--accent-600, #0284c7)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 700 }}
                >
                  Open Full Web Page <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #0284c7', fontSize: '12.5px' }}>
                <strong>No Hidden Fees:</strong> All declared tuition covers lectures, printed kit, examination evaluations, and digital platform access.
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 700 }}>Refund Timeline Summary:</p>
                <ul style={{ margin: 0, paddingLeft: '18px' }}>
                  <li><strong>15+ days before batch starts:</strong> 100% Tuition Fee Refund (registration fee deducted).</li>
                  <li><strong>1–14 days before batch starts:</strong> 85% Tuition Fee Refund.</li>
                  <li><strong>First 14 days of batch:</strong> Pro-rata refund after deducting classes attended and study material kit cost.</li>
                  <li><strong>After 30 days:</strong> Non-refundable as faculty allocation and classroom seat reservations are fixed.</li>
                  <li><strong>Disbursement:</strong> Direct NEFT/Bank transfer to parent within 15–30 working days.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: COOKIE & STORAGE PREFERENCES */}
          {activeTab === 'cookies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--brand-900, #0f172a)' }}>
                  Cookie & Local Storage Preferences
                </h4>
                <a
                  href="/cookie-policy.html"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11.5px', color: 'var(--accent-600, #0284c7)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 700 }}
                >
                  Cookie Policy <ExternalLink size={12} />
                </a>
              </div>
              <p>
                Manage how ASPIRE stores your session and experience data in your browser and device:
              </p>

              {/* Essential */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px' }}>Strictly Necessary Tokens</strong>
                  <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0 0' }}>Authentication session, role permissions, and brute-force protection.</p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                  Always Active
                </span>
              </div>

              {/* Functional */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px' }}>Functional & Theme Preferences</strong>
                  <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0 0' }}>Remembers dismissed announcements, display layout, and tab state.</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.functional}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, functional: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--brand-900)' }}
                />
              </div>

              {/* Analytics */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px' }}>Diagnostics & Performance</strong>
                  <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0 0' }}>Captures internal app errors in ErrorBoundary to prevent crashes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.analytics}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, analytics: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--brand-900)' }}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveCookies}
                className="btn-primary"
                style={{ padding: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {cookieSaved ? <Check size={16} /> : null}
                {cookieSaved ? 'Preferences Saved!' : 'Save Cookie Settings'}
              </button>
            </div>
          )}

          {/* TAB 5: THIRD PARTY SDKS */}
          {activeTab === 'sdks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--brand-900, #0f172a)' }}>
                  Third-Party SDKs & Data Practices
                </h4>
                <a
                  href="/licenses.html"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11.5px', color: 'var(--accent-600, #0284c7)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 700 }}
                >
                  Licenses & IP Credits <ExternalLink size={12} />
                </a>
              </div>
              <p>
                Every third-party software library embedded in ASPIRE has been audited for security and data compliance:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <strong>Supabase JS SDK (@supabase/supabase-js)</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>PostgreSQL backend connectivity. Communicates exclusively over TLS 1.3 / HTTPS. Zero user advertising.</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <strong>Capacitor Runtime (@capacitor/*)</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>Mobile native container bridging Android hardware (camera & notification services). Open source (MIT).</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <strong>jsPDF & AutoTable</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>100% Client-side PDF generation for fee receipts and student report cards. Transmits zero data externally.</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <strong>Meta WhatsApp Cloud API</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>Used solely for one-time password (OTP) verification for secure phone logins.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACADEMIC DISCLAIMERS */}
          {activeTab === 'disclaimers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--brand-900, #0f172a)' }}>
                Educational & Regulatory Disclaimers
              </h4>
              <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', borderLeft: '4px solid #0284c7' }}>
                <p style={{ margin: '0 0 6px 0', fontWeight: 800, color: '#1e3a8a' }}>
                  No Misleading Claims or Guaranteed Ranks:
                </p>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#334155' }}>
                  ASPIRE Learning Centre provides structured academic coaching, faculty lectures, study material kits, and evaluation exams. Individual student examination scores, percentile ranks, and admissions into competitive government or private institutions (NEET, JEE Mains, JEE Advanced, MHT-CET, or Board Examinations) depend on individual aptitude, regular attendance, diligence, and actual performance. We do not make false or unsubstantiated claims guaranteeing rank 1, 100% selection, or guaranteed admissions.
                </p>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '12.5px' }}>Official Curriculum Reference:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Syllabi and exam patterns follow official guidelines published by NTA (National Testing Agency), Maharashtra State Board of Secondary and Higher Secondary Education, and CBSE.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: INSTITUTE DETAILS & GRIEVANCE */}
          {activeTab === 'business' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--brand-900, #0f172a)' }}>
                Official Institute & Grievance Details
              </h4>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Legal Entity Name</span>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--brand-900)' }}>ASPIRE Learning Centre</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Campus Address</span>
                  <div style={{ fontSize: '13px', color: '#334155' }}>ASPIRE Learning Centre, Offline Campus, Navi Mumbai, Maharashtra, India</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Official Email</span>
                  <div><a href="mailto:aspirelearningcentre@outlook.com" style={{ color: 'var(--accent-600)', textDecoration: 'none', fontWeight: 700 }}>aspirelearningcentre@outlook.com</a></div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Helpline Phone</span>
                  <div style={{ fontSize: '13px', color: '#334155' }}>+91 77385 78685 (10:00 AM – 6:00 PM IST)</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Designated Grievance Redressal Officer</span>
                  <div style={{ fontSize: '13px', color: '#334155' }}>Zeeshan Pinjari (Email: aspirelearningcentre@outlook.com)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: COMMUNICATION PREFERENCES & UNSUBSCRIBE */}
          {activeTab === 'communications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--brand-900, #0f172a)' }}>
                  Notification & Email Preferences
                </h4>
                <a
                  href="/unsubscribe.html"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11.5px', color: 'var(--accent-600, #0284c7)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 700 }}
                >
                  Unsubscribe Portal <ExternalLink size={12} />
                </a>
              </div>
              <p>
                Configure which notifications and communications you receive:
              </p>

              {/* Academic */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px' }}>Academic & Attendance Alerts</strong>
                  <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0 0' }}>Daily attendance warnings, marks, lecture timetables, and fee receipts.</p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                  Mandatory
                </span>
              </div>

              {/* Promotional */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px' }}>Promotional & Seminar Announcements</strong>
                  <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0 0' }}>Career counseling webinars, vacation workshops, and institute news.</p>
                </div>
                <input
                  type="checkbox"
                  checked={commPrefs.promotionalAnnouncements}
                  onChange={(e) => setCommPrefs({ ...commPrefs, promotionalAnnouncements: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--brand-900)' }}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveComm}
                className="btn-primary"
                style={{ padding: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {commSaved ? <Check size={16} /> : null}
                {commSaved ? 'Preferences Saved!' : 'Save Communication Preferences'}
              </button>

              <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '6px 0' }} />

              {/* Direct Account Deletion Trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2', padding: '12px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                <div>
                  <strong style={{ color: '#991b1b', fontSize: '13px' }}>Account & Data Deletion</strong>
                  <p style={{ fontSize: '11px', color: '#b91c1c', margin: '2px 0 0 0' }}>Permanently erase your account, attendance, and test scores.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenDeleteAccount) onOpenDeleteAccount();
                  }}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Delete Data
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Sheet Footer */}
        <div style={{
          padding: '10px 18px',
          borderTop: '1px solid var(--border, #e2e8f0)',
          background: 'var(--surface, #ffffff)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>
            &copy; 2026 ASPIRE Learning Centre
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '7px 16px', fontSize: '12.5px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
