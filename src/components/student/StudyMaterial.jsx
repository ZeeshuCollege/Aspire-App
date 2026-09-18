import React, { useState } from 'react';
import { mockStudyMaterials } from '../../lib/mockData';
import { Search, FileText, Book, Video, ChevronRight } from 'lucide-react';

export default function StudyMaterial({ onOpenViewer }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Notes', 'PDF', 'Video'];

  const filtered = mockStudyMaterials.filter(m => {
    const matchesFilter = selectedFilter === 'All' || m.type.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Study Material</h3>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search material..."
          style={{
            width: '100%',
            padding: '12px 14px 12px 38px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '13px',
            outline: 'none',
            background: 'var(--surface)'
          }}
        />
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: selectedFilter === filter ? 'var(--brand-800)' : 'var(--surface-alt)',
              color: selectedFilter === filter ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Material List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(mat => (
          <div
            key={mat.id}
            onClick={() => onOpenViewer({ title: mat.title, subtitle: `${mat.subject} • ${mat.chapter} (${mat.size})` })}
            className="card card-hover"
            style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: mat.type === 'PDF' ? '#fee2e2' : mat.type === 'Notes' ? '#fef3c7' : '#e0e7ff',
                color: mat.type === 'PDF' ? '#ef4444' : mat.type === 'Notes' ? '#d97706' : '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {mat.type === 'PDF' ? <FileText size={20} /> : mat.type === 'Notes' ? <Book size={20} /> : <Video size={20} />}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{mat.title}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mat.subject} • {mat.chapter} • {mat.size}</p>
              </div>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
        ))}
      </div>
    </div>
  );
}
