import React from 'react';
import { mockBatches } from '../../lib/mockData';
import { Users, Clock, ChevronRight } from 'lucide-react';

export default function MyBatches({ onSelectBatch }) {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>My Batches</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockBatches.map(batch => (
          <div
            key={batch.id}
            onClick={() => onSelectBatch && onSelectBatch(batch)}
            className="card card-hover"
            style={{ padding: '16px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-900)' }}>{batch.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <Users size={14} />
                  <span>{batch.studentsCount} Students Enrolled</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-success">{batch.status}</span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <Clock size={12} color="var(--accent-500)" />
              <span>Daily Class: {batch.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
