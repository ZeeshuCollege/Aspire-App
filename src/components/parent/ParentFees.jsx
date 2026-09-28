import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, CheckCircle2 } from 'lucide-react';
import { getStoredFees, formatFeeAmount, formatFeeFraction } from '../../lib/feeService';

export default function ParentFees({ childName = 'Rohan Sharma' }) {
  const [feeRecord, setFeeRecord] = useState(null);

  useEffect(() => {
    const loadFees = () => {
      const fees = getStoredFees();
      const match = fees.find(f => f.name.toLowerCase() === childName.toLowerCase()) || fees[0];
      setFeeRecord(match || {
        name: childName,
        totalFee: 20000,
        paidFee: 11000,
        isFullyPaid: false,
        course: '12th Science'
      });
    };

    loadFees();
    window.addEventListener('storage', loadFees);
    window.addEventListener('aspire:fee-alert', loadFees);
    return () => {
      window.removeEventListener('storage', loadFees);
      window.removeEventListener('aspire:fee-alert', loadFees);
    };
  }, [childName]);

  const total = feeRecord ? Number(feeRecord.totalFee) || 0 : 20000;
  const paid = feeRecord ? Number(feeRecord.paidFee) || 0 : 11000;
  const pending = Math.max(0, total - paid);
  const isFull = feeRecord ? (feeRecord.isFullyPaid || (paid >= total && total > 0)) : false;
  const paidPct = total > 0 ? Math.min(100, Math.max(0, Math.round((paid / total) * 100))) : 0;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>Fee Structure & Payments</h3>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Student: <b>{feeRecord?.name || childName}</b> ({feeRecord?.course || '12th Science'})
          </span>
        </div>
        {isFull && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
            <CheckCircle2 size={13} /> Full Paid
          </span>
        )}
      </div>

      {/* Main Fee Summary Card */}
      <div className="card" style={{ padding: '20px', border: isFull ? '1.5px solid #86efac' : '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Academic Fees (2025-26)
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-900)' }}>
            {formatFeeFraction(paid, total)}
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-900)', marginTop: '4px' }}>
          ₹{total.toLocaleString('en-IN')} <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>({formatFeeAmount(total)})</span>
        </h2>

        {/* Paid vs Pending Breakdown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Amount Paid</span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--success)' }}>
              ₹{paid.toLocaleString('en-IN')} <span style={{ fontSize: '12px' }}>({formatFeeAmount(paid)})</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pending Balance</span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: isFull ? 'var(--success)' : 'var(--danger)' }}>
              ₹{pending.toLocaleString('en-IN')} <span style={{ fontSize: '12px' }}>({formatFeeAmount(pending)})</span>
            </div>
          </div>
        </div>

        {/* Blue Progress Bar */}
        <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', marginTop: '12px', overflow: 'hidden' }}>
          <div style={{ width: `${paidPct}%`, height: '100%', background: '#2563eb', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {isFull ? 'All dues settled' : `Due: ₹${pending.toLocaleString('en-IN')}`}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: isFull ? '#16a34a' : 'var(--brand-700)' }}>
            {paidPct}% Paid
          </span>
        </div>
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
              <h5 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Receipt #ASP-2025-089</h5>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {feeRecord?.lastPaymentDate || '15 Sep 2026'} • ₹{paid.toLocaleString('en-IN')} (UPI / Desk)
              </span>
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
