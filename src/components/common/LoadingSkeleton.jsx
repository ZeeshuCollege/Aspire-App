import React from 'react';

/**
 * Technical Blueprint Sharp Loading Skeletons
 * Provides zero-radius, shimmer loading states for instant visual feedback.
 */

export function TopLoadingBar() {
  return <div className="top-loader-bar" aria-label="Loading content" />;
}

export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* Top Greeting Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div className="skeleton-box" style={{ width: '110px', height: '14px' }} />
          <div className="skeleton-box" style={{ width: '220px', height: '28px' }} />
        </div>
        <div className="skeleton-box" style={{ width: '74px', height: '74px' }} />
      </div>

      {/* Main Focus Card Skeleton */}
      <div className="skeleton-box" style={{ width: '100%', height: '120px', border: '1px solid var(--border)' }} />

      {/* 2x2 Action Tiles Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton-box"
            style={{ height: '110px', border: '1px solid var(--border-subtle)' }}
          />
        ))}
      </div>

      {/* Schedule / Content Card Skeleton */}
      <div className="skeleton-card">
        <div className="skeleton-box" style={{ width: '140px', height: '16px' }} />
        <div className="skeleton-box" style={{ width: '100%', height: '48px' }} />
        <div className="skeleton-box" style={{ width: '100%', height: '48px' }} />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton-box"
          style={{
            height: '68px',
            border: '1px solid var(--border-subtle)',
            width: '100%'
          }}
        />
      ))}
    </div>
  );
}

export function StatCounterSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="skeleton-box"
          style={{ height: '80px', border: '1px solid var(--border-subtle)' }}
        />
      ))}
    </div>
  );
}
