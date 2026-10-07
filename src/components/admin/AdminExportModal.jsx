import React, { useState, useEffect } from 'react';
import {
  X, Download, Printer, Share2, FileText, CheckCircle2,
  Loader2, AlertCircle, Table, Users, BookOpen, DollarSign,
  Calendar, Award
} from 'lucide-react';
import {
  collectInstituteTablesData,
  generateCSVReport,
  generateExcelReport,
  generatePDFDocument,
  printDataAsTables,
  downloadBlobFile,
  FILE_BASE_NAME
} from '../../lib/exportDataService';

export default function AdminExportModal({
  isOpen,
  onClose,
  initialFormat = 'pdf' // 'pdf' | 'xlsx' | 'csv'
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'collecting' | 'processing' | 'ready' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [dataSnapshot, setDataSnapshot] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [activeFormat, setActiveFormat] = useState(initialFormat);

  // Close animation handler
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setStatus('idle');
      setStatusMessage('');
    }, 280);
  };

  // Android back button support
  useEffect(() => {
    if (!isOpen) return;
    const handleAppBack = (e) => {
      handleClose();
      e.detail?.markHandled();
    };
    window.addEventListener('app:back', handleAppBack);
    return () => window.removeEventListener('app:back', handleAppBack);
  }, [isOpen]);

  // Execute download when modal opens with initialFormat
  useEffect(() => {
    if (isOpen) {
      setActiveFormat(initialFormat);
      runExportProcess(initialFormat);
    }
  }, [isOpen, initialFormat]);

  const runExportProcess = async (format) => {
    setActiveFormat(format);
    setStatus('collecting');
    setStatusMessage('Download in process: Collecting institute data...');

    try {
      // Step 1: Collect live data
      await new Promise(r => setTimeout(r, 400)); // Smooth feedback
      const data = collectInstituteTablesData();
      setDataSnapshot(data);

      // Step 2: Store in tables format & prepare document
      setStatus('processing');
      setStatusMessage('Storing data in tables format and preparing document...');
      await new Promise(r => setTimeout(r, 450));

      const filename = `${FILE_BASE_NAME}.${format === 'excel' ? 'xlsx' : format}`;

      if (format === 'pdf') {
        const doc = generatePDFDocument(data);
        // Save PDF using jsPDF
        doc.save(filename);
      } else if (format === 'xlsx' || format === 'excel') {
        const blob = generateExcelReport(data);
        await downloadBlobFile(blob, `${FILE_BASE_NAME}.xlsx`);
      } else if (format === 'csv') {
        const blob = generateCSVReport(data);
        await downloadBlobFile(blob, `${FILE_BASE_NAME}.csv`);
      }

      setStatus('ready');
      setStatusMessage(`✓ "${filename}" downloaded successfully to your device.`);
    } catch (err) {
      console.error('Export error:', err);
      setStatus('error');
      setStatusMessage('Export encounterd an issue. You can use Print / Save as PDF below.');
    }
  };

  const handleManualPrint = () => {
    const data = dataSnapshot || collectInstituteTablesData();
    printDataAsTables(data);
  };

  const handleShare = async () => {
    const data = dataSnapshot || collectInstituteTablesData();
    const doc = generatePDFDocument(data);
    const pdfBlob = doc.output('blob');
    await downloadBlobFile(pdfBlob, `${FILE_BASE_NAME}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-backdrop-05s ${isClosing ? 'closing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        zIndex: 1300,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div
        className={`modal-sheet-05s ${isClosing ? 'closing' : ''}`}
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface, #ffffff)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Drag handle */}
        <div className="sheet-drag-handle" onClick={handleClose} style={{ cursor: 'pointer' }} />

        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border, #e2e8f0)',
          background: 'var(--surface, #ffffff)',
          flexShrink: 0
        }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
              Export Institute Data
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              File: "{FILE_BASE_NAME}"
            </span>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Content Container */}
        <div style={{
          padding: '18px 20px 30px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>

          {/* ── Progress / Status Banner ── */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: status === 'ready' ? '#f0fdf4' : status === 'error' ? '#fef2f2' : '#eff6ff',
            border: `1.5px solid ${status === 'ready' ? '#86efac' : status === 'error' ? '#fecaca' : '#93c5fd'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              {status === 'ready' ? (
                <CheckCircle2 size={22} color="#16a34a" />
              ) : status === 'error' ? (
                <AlertCircle size={22} color="#dc2626" />
              ) : (
                <Loader2 size={22} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h5 style={{
                fontSize: '13.5px',
                fontWeight: 800,
                margin: 0,
                color: status === 'ready' ? '#15803d' : status === 'error' ? '#b91c1c' : '#1d4ed8'
              }}>
                {status === 'ready' ? 'Download Completed' : status === 'error' ? 'Download Notice' : 'Download in Process'}
              </h5>
              <p style={{
                fontSize: '12px',
                color: status === 'ready' ? '#166534' : status === 'error' ? '#991b1b' : '#1e40af',
                margin: '3px 0 0 0',
                lineHeight: 1.4
              }}>
                {statusMessage}
              </p>
            </div>
          </div>

          {/* ── Data Collected in Tables Format ── */}
          {dataSnapshot && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Collected Data Tables
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="#2563eb" />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Students</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)' }}>{dataSnapshot.students.length} Records</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="#7c3aed" />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Faculty</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)' }}>{dataSnapshot.teachers.length} Members</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} color="#059669" />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Fees Accounts</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)' }}>{dataSnapshot.fees.length} Accounts</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={16} color="#d97706" />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Courses</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)' }}>{dataSnapshot.courses.length} Courses</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} color="#4f46e5" />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Timetable</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)' }}>{dataSnapshot.timetable.length} Lectures</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="#dc2626" />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Tests & Exams</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)' }}>{dataSnapshot.tests.length} Papers</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Native Mobile Print & Download Formats ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Choose Format or Print to Phone
            </span>

            {/* Print / Save as PDF Button (Native Android/iOS system print dialog) */}
            <button
              type="button"
              onClick={handleManualPrint}
              style={{
                padding: '13px 16px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} />
                <span>Print / Save as PDF on Mobile</span>
              </div>
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                Recommended
              </span>
            </button>

            {/* 3 Download Format Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => runExportProcess('pdf')}
                style={{
                  padding: '11px 8px',
                  background: activeFormat === 'pdf' ? '#eff6ff' : '#f8fafc',
                  border: `1.5px solid ${activeFormat === 'pdf' ? '#3b82f6' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: activeFormat === 'pdf' ? '#1d4ed8' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Download size={16} />
                <span>PDF Document</span>
              </button>

              <button
                type="button"
                onClick={() => runExportProcess('xlsx')}
                style={{
                  padding: '11px 8px',
                  background: activeFormat === 'xlsx' ? '#f0fdf4' : '#f8fafc',
                  border: `1.5px solid ${activeFormat === 'xlsx' ? '#22c55e' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: activeFormat === 'xlsx' ? '#15803d' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Table size={16} />
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => runExportProcess('csv')}
                style={{
                  padding: '11px 8px',
                  background: activeFormat === 'csv' ? '#f5f3ff' : '#f8fafc',
                  border: `1.5px solid ${activeFormat === 'csv' ? '#8b5cf6' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: activeFormat === 'csv' ? '#6d28d9' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <FileText size={16} />
                <span>CSV Tables</span>
              </button>
            </div>

            {/* Mobile Share / Save to Drive */}
            <button
              type="button"
              onClick={handleShare}
              style={{
                padding: '11px 16px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--brand-900)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Share2 size={16} />
              <span>Share / Save File to Phone Storage</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
            style={{
              padding: '10px',
              fontSize: '13px',
              borderRadius: '10px',
              marginTop: '4px'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
