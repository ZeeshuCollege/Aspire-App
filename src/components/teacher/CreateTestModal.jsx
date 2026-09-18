import React, { useState } from 'react';
import { X, Upload, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function CreateTestModal({ isOpen, onClose, onCreated }) {
  const [testName, setTestName] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('Laws of Motion');
  const [date, setDate] = useState('2025-04-18');
  const [duration, setDuration] = useState('1 hr 30 min');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testName) return;

    if (onCreated) {
      onCreated({
        id: `t-${Date.now()}`,
        code: testName,
        subject,
        chapter,
        date,
        duration,
        maxMarks: 100,
        status: 'Upcoming'
      });
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 95,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-modal)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>Create Test</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Test Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unit Test 1 - Mechanics"
              value={testName}
              onChange={e => setTestName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  background: 'var(--surface)'
                }}
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Chapter / Topic
            </label>
            <input
              type="text"
              value={chapter}
              onChange={e => setChapter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Test Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Test Paper Upload Dropzone */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Upload Test Paper (PDF)
            </label>
            <div
              onClick={() => {
                setFileUploaded(true);
                setFileName('Physics_Mock_Test_Paper_2025.pdf');
              }}
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: fileUploaded ? 'var(--success-tint)' : 'var(--surface-alt)'
              }}
            >
              {fileUploaded ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--success)', fontSize: '12px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} />
                  <span>{fileName} (Attached)</span>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  <Upload size={20} style={{ margin: '0 auto 4px auto', display: 'block', color: 'var(--brand-800)' }} />
                  <span>Click to select question paper (PDF, max 10MB)</span>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '6px' }}>
            Schedule & Publish Test
          </button>
        </form>
      </div>
    </div>
  );
}
