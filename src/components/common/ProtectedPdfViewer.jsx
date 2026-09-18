import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, ShieldAlert, Lock } from 'lucide-react';

export default function ProtectedPdfViewer({ title, subtitle, studentName = 'Rohan Sharma', rollNo = 'ASPIRE-104', onClose }) {
  const [zoom, setZoom] = useState(1);

  const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const watermarkText = `${studentName} • Roll #${rollNo} • ${timestamp}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Top Controls Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'var(--brand-900)',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lock size={18} color="var(--accent-400)" />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>{title}</h4>
            <p style={{ fontSize: '11px', color: 'var(--accent-400)' }}>{subtitle} • Protected In-App Viewer</p>
          </div>
        </div>

        {/* Action Controls (Zoom + Close only - No Download!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: '12px', padding: '0 8px', color: '#cbd5e1' }}>{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171',
              cursor: 'pointer'
            }}
            title="Close Viewer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Document Canvas with Repeating Diagonal Watermark */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '680px',
          background: '#ffffff',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          borderRadius: '8px',
          padding: '40px 32px',
          color: '#0f172a',
          position: 'relative',
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.1s ease',
          userSelect: 'none'
        }}>
          {/* Forensic Diagonal Watermark Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            opacity: 0.12,
            zIndex: 10
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                style={{
                  transform: 'rotate(-25deg)',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  letterSpacing: '3px'
                }}
              >
                {watermarkText} • ASPIRE CONFIDENTIAL
              </div>
            ))}
          </div>

          {/* Test Paper Header */}
          <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.05em' }}>ASPIRE LEARNING CENTRE</h2>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-800)' }}>JEE ADVANCED MOCK ASSESSMENT • ACADEMIC SESSION 2025-26</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
              <span>Subject: Physics (Mechanics)</span>
              <span>Duration: 90 Minutes</span>
              <span>Max Marks: 100</span>
            </div>
          </div>

          {/* Instructions Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '24px', fontSize: '12px' }}>
            <p style={{ fontWeight: 700, marginBottom: '4px' }}>General Instructions:</p>
            <ul style={{ paddingLeft: '18px', lineHeight: 1.6, color: '#334155' }}>
              <li>Section I contains 10 Multiple Choice Questions with single correct option (+4, -1).</li>
              <li>Section II contains 5 Numerical Value questions with no negative marking (+4, 0).</li>
              <li>Use of calculators, smartphones, or unauthorized notes is strictly prohibited.</li>
            </ul>
          </div>

          {/* Sample Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '13px', lineHeight: 1.6 }}>
            <div>
              <p style={{ fontWeight: 700 }}>Q1. A particle of mass <i>m</i> is projected from the ground with an initial velocity <i>u</i> at an angle θ with the horizontal. The radius of curvature of its trajectory at the highest point is:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', paddingLeft: '12px' }}>
                <div>(A) (u² cos²θ) / g</div>
                <div>(B) (u² sin²θ) / g</div>
                <div>(C) (u² cosθ) / 2g</div>
                <div>(D) (2u² sinθ) / g</div>
              </div>
            </div>

            <div>
              <p style={{ fontWeight: 700 }}>Q2. A block of mass 2 kg is placed on a rough horizontal surface with coefficient of friction μ = 0.4. A horizontal force F = 6 N is applied on the block. The frictional force acting on the block is (g = 10 m/s²):</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', paddingLeft: '12px' }}>
                <div>(A) 8 N</div>
                <div>(B) 6 N</div>
                <div>(C) 0 N</div>
                <div>(D) 2 N</div>
              </div>
            </div>

            <div>
              <p style={{ fontWeight: 700 }}>Q3. A solid cylinder of mass M and radius R rolls without slipping down an inclined plane of inclination θ. The acceleration of its center of mass is:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', paddingLeft: '12px' }}>
                <div>(A) g sinθ</div>
                <div>(B) (2/3) g sinθ</div>
                <div>(C) (1/2) g sinθ</div>
                <div>(D) (3/4) g sinθ</div>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div style={{ marginTop: '36px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
            <span>Page 1 of 4 • Confidential Question Paper</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={12} color="var(--danger)" />
              Copying, screenshotting or distribution is prohibited
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
