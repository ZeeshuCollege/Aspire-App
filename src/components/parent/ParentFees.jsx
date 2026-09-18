import React from 'react';
import { CheckCircle, Download } from 'lucide-react';

export default function ParentFees() {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Fee Structure & Payments</h3>

      {/* Main Fee Summary Card (From ASPIRE THEME.png Row 3 Screen 22) */}
      <div className="card" style={{ padding: '20px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Total Annual Fees (2025-26)
        </span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-900)', marginTop: '2px' }}>₹75,000</h2>

        {/* Paid vs Pending Breakdown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Amount Paid</span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--success)' }}>₹45,000</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pending Balance</span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--danger)' }}>₹30,000</div>
          </div>
        </div>

        {/* 60% Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'var(--surface-alt)', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #0ea5e9 100%)', borderRadius: '9999px' }} />
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-500)', display: 'block', textAlign: 'right', marginTop: '4px' }}>
          60% Paid
        </span>
      </div>

      {/* Past Receipts */}
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-900)', marginBottom: '10px' }}>Payment Receipts</h4>
        <div className="card" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--success-tint)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: 700 }}>Receipt #ASP-2025-089</h5>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>10 Jan 2025 • ₹45,000 (UPI)</span>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-800)' }} title="Download Receipt">
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
