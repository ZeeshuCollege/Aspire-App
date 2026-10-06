import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Search, Plus, CheckCircle2, Bell, Edit3, Check,
  X, AlertCircle, Sparkles, Filter, IndianRupee, Send, DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getStoredFees,
  saveStoredFees,
  updateStudentFeeRecord,
  markStudentAsFullPaid,
  addManualFeeRecord,
  sendFeeNotificationAlert,
  formatFeeAmount,
  formatFeeFraction,
  fetchFeesFromSupabase
} from '../../lib/feeService';
import { getStoredStudents } from '../../lib/userAuthStore';
import { COURSE_OPTIONS } from './AdminStudyMaterialsModal';
import MobileDropdown from '../common/MobileDropdown';

const FILTER_OPTIONS = [
  { id: 'All', label: 'All' },
  { id: 'JEE', label: 'JEE' },
  { id: 'NEET', label: 'NEET' },
  { id: 'MHT-CET', label: 'MHT-CET' },
  { id: '9th', label: '9th' },
  { id: '10th', label: '10th' }
];

export default function AdminFeesModal({ isOpen, onClose }) {
  const [feesList, setFeesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  // Manual Add Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStudentName, setAddStudentName] = useState('');
  const [addStudentCourse, setAddStudentCourse] = useState('JEE');
  const [addTotalFee, setAddTotalFee] = useState('');
  const [addPaidFee, setAddPaidFee] = useState('');
  const [addRemarks, setAddRemarks] = useState('');

  // Edit Mode States (when card is opened)
  const [isEditing, setIsEditing] = useState(false);
  const [editPaidFee, setEditPaidFee] = useState('');
  const [editTotalFee, setEditTotalFee] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Load fees on open (Initial cache + Live Supabase Backend Query)
  useEffect(() => {
    if (!isOpen) return;
    setFeesList(getStoredFees());
    setIsSyncing(true);

    fetchFeesFromSupabase()
      .then(liveData => {
        if (Array.isArray(liveData) && liveData.length > 0) {
          setFeesList(liveData);
        }
      })
      .catch(err => {
        console.warn('[AdminFeesModal] Live Supabase fetch notice:', err?.message);
      })
      .finally(() => {
        setIsSyncing(false);
      });
  }, [isOpen]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setSelectedStudent(null);
      setIsEditing(false);
    }, 280);
  };

  // Filter & Search Logic
  const filteredStudents = useMemo(() => {
    return feesList.filter(student => {
      // 1. Search by student name
      const matchesSearch = searchTerm.trim() === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase().trim());

      // 2. Filter by course buttons (All, 9th, 10th, 11th, 12th, JEE, NEET, MHT-CET)
      if (!matchesSearch) return false;
      if (selectedFilter === 'All') return true;

      const courseLower = (student.course || '').toLowerCase();
      const filterLower = selectedFilter.toLowerCase();

      if (selectedFilter === '9th') return courseLower.includes('9th') || courseLower.includes('9');
      if (selectedFilter === '10th') return courseLower.includes('10th') || courseLower.includes('10');
      if (selectedFilter === '11th') return courseLower.includes('11th') || courseLower.includes('11');
      if (selectedFilter === '12th') return courseLower.includes('12th') || courseLower.includes('12');
      if (selectedFilter === 'JEE') return courseLower.includes('jee');
      if (selectedFilter === 'NEET') return courseLower.includes('neet');
      if (selectedFilter === 'MHT-CET') return courseLower.includes('cet') || courseLower.includes('mht');

      return courseLower.includes(filterLower);
    });
  }, [feesList, searchTerm, selectedFilter]);

  // Open a student's card
  const handleOpenCard = (student) => {
    setSelectedStudent(student);
    setEditPaidFee(student.paidFee.toString());
    setEditTotalFee(student.totalFee.toString());
    setIsEditing(false);
  };

  // Button 1: Send Alert (notify student and parent)
  const handleSendAlert = (student) => {
    if (!student) return;
    sendFeeNotificationAlert(student);
    showToast(`🔔 Alert sent! Notification dispatched to ${student.name} and parent with full fee details.`);
  };

  // Button 2: Save Edited Fees (e.g. from 11k to 15k out of 20k)
  const handleSaveEdit = () => {
    if (!selectedStudent) return;
    const paidNum = Math.max(0, Number(editPaidFee) || 0);
    const totalNum = Math.max(0, Number(editTotalFee) || 0);

    if (paidNum > totalNum) {
      showToast(`⚠️ Paid fees (₹${paidNum.toLocaleString('en-IN')}) cannot exceed total fees (₹${totalNum.toLocaleString('en-IN')}).`);
      return;
    }

    const updated = updateStudentFeeRecord(selectedStudent.id, {
      paidFee: paidNum,
      totalFee: totalNum
    });

    setFeesList(updated);
    const updatedStudent = updated.find(s => s.id === selectedStudent.id) || {
      ...selectedStudent,
      paidFee: paidNum,
      totalFee: totalNum,
      isFullyPaid: paidNum >= totalNum && totalNum > 0
    };
    setSelectedStudent(updatedStudent);
    setIsEditing(false);

    showToast(`✓ Updated fees for ${selectedStudent.name}: ${formatFeeFraction(paidNum, totalNum)}`);
  };

  // Button 3: Full Paid
  const handleMarkFullPaid = (student) => {
    if (!student) return;
    const updated = markStudentAsFullPaid(student.id);
    setFeesList(updated);

    const updatedStudent = updated.find(s => s.id === student.id) || {
      ...student,
      paidFee: student.totalFee,
      isFullyPaid: true
    };
    setSelectedStudent(updatedStudent);
    setEditPaidFee(student.totalFee.toString());

    // Celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast(`🎉 ${student.name}'s fees marked as Full Paid! Green tick active.`);
  };

  // Manual Add Student Fee Record
  const handleSaveManualRecord = (e) => {
    e.preventDefault();
    if (!addStudentName.trim()) {
      showToast('⚠️ Please enter student name.');
      return;
    }

    const totalNum = Math.max(0, Number(addTotalFee) || 0);
    const paidNum = Math.max(0, Number(addPaidFee) || 0);

    if (paidNum > totalNum) {
      showToast(`⚠️ Paid fees (₹${paidNum.toLocaleString('en-IN')}) cannot exceed total fees (₹${totalNum.toLocaleString('en-IN')}).`);
      return;
    }

    const { updatedList, newEntry } = addManualFeeRecord({
      name: addStudentName.trim(),
      course: addStudentCourse,
      totalFee: totalNum,
      paidFee: paidNum,
      remarks: addRemarks.trim() || 'Manual Entry'
    });

    setFeesList(updatedList);
    setShowAddModal(false);
    setAddStudentName('');
    setAddTotalFee('');
    setAddPaidFee('');
    setAddRemarks('');

    showToast(`✓ Added fee record for ${newEntry.name} (${formatFeeFraction(newEntry.paidFee, newEntry.totalFee)})`);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fullscreen-page-modal ${isClosing ? 'closing' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        maxWidth: '480px',
        margin: '0 auto',
        background: 'var(--canvas)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* ── Top Navigation Bar (Status bar safe area aware) ── */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 14px 10px',
        paddingTop: 'calc(12px + max(var(--safe-area-top, 0px), env(safe-area-inset-top, 0px), 28px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          <button
            onClick={handleBack}
            style={{
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--brand-900)',
              flexShrink: 0
            }}
            title="Back to Admin"
          >
            <ArrowLeft size={17} />
          </button>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ fontSize: '15.5px', fontWeight: 800, color: 'var(--brand-900)', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                Fees Management
              </h2>
              <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe', fontSize: '9.5px', fontWeight: 700, padding: '1px 5px', whiteSpace: 'nowrap' }}>
                Quick Action
              </span>
            </div>
            <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Track dues & alerts</span>
              <span>•</span>
              <span style={{ color: isSyncing ? '#0284c7' : '#16a34a', fontWeight: 600 }}>
                {isSyncing ? '⏳ Syncing...' : '☁️ Supabase Backend'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Toast Notification Banner ── */}
      {toastMessage && (
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)',
          color: '#ffffff',
          padding: '9px 14px',
          fontSize: '12px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.2s ease',
          zIndex: 10
        }}>
          <Sparkles size={15} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Controls Section: Search Bar & Filter Buttons ── */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 14px 10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flexShrink: 0
      }}>
        {/* Simple Search Bar to Search Student with Name */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--surface-alt)',
          borderRadius: '10px',
          border: '1.5px solid var(--border)',
          padding: '0 10px'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search student by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: '9px 8px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              outline: 'none',
              fontWeight: 500
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div style={{ marginTop: '2px' }}>
          <MobileDropdown
            title="Filter by Course / Standard"
            options={FILTER_OPTIONS.map(f => ({ value: f.id, label: f.label === 'All' ? 'All Courses' : f.label }))}
            value={selectedFilter}
            onChange={val => setSelectedFilter(val)}
            placeholder="Filter by Course"
          />
        </div>
      </div>

      {/* ── Student Cards List ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 14px',
        paddingBottom: 'calc(24px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)))',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Enrolled Students ({filteredStudents.length})
          </span>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
            Tap card for actions & alerts
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div style={{
            background: 'var(--surface)',
            border: '1px dashed var(--border)',
            borderRadius: '12px',
            padding: '30px 16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={28} color="var(--text-muted)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-900)', margin: 0 }}>
              No Students Found
            </h4>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, maxWidth: '240px' }}>
              No student matched "{searchTerm}" under filter "{selectedFilter}".
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedFilter('All'); }}
              className="btn-secondary"
              style={{ fontSize: '11.5px', padding: '6px 14px', marginTop: '6px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const total = Number(student.totalFee) || 0;
            const paid = Number(student.paidFee) || 0;
            const isFull = student.isFullyPaid || (paid >= total && total > 0);
            const paidPct = total > 0 ? Math.min(100, Math.max(0, (paid / total) * 100)) : 0;
            const amountText = formatFeeFraction(paid, total);

            return (
              <div
                key={student.id}
                onClick={() => handleOpenCard(student)}
                className="card"
                style={{
                  padding: '12px 14px',
                  background: 'var(--surface)',
                  border: isFull ? '1.5px solid #86efac' : '1px solid var(--border)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Top Row: Student Name, Course Name, and Green Tick if Fully Paid */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                      {student.name}
                    </h4>
                    {/* Green Tick appears whenever searched if student fees are fully paid */}
                    {isFull && (
                      <span
                        title="Fees Fully Paid"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: '#16a34a',
                          background: '#dcfce7',
                          borderRadius: '50%',
                          padding: '2px'
                        }}
                      >
                        <CheckCircle2 size={16} color="#16a34a" />
                      </span>
                    )}
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'var(--surface-alt)',
                    color: 'var(--brand-800)',
                    border: '1px solid var(--border)'
                  }}>
                    {student.course}
                  </span>
                </div>

                {/* Bottom Row: Amount at top-left corner of the bar & Blue Fee Bar */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    {/* Top left corner of the bar has amount e.g. 11k/20k */}
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: 'var(--brand-900)',
                      letterSpacing: '0.01em'
                    }}>
                      {amountText}
                    </span>

                    {/* Status hint on right */}
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: isFull ? '#16a34a' : 'var(--text-muted)'
                    }}>
                      {isFull ? 'Full Paid' : `${Math.round(paidPct)}% Paid`}
                    </span>
                  </div>

                  {/* Fee Bar: Blue color area = paid, rest = remaining */}
                  <div style={{
                    width: '100%',
                    height: '10px',
                    background: '#e2e8f0', // remaining gray area
                    borderRadius: '999px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${paidPct}%`,
                      height: '100%',
                      background: '#2563eb', // crisp blue color as requested
                      borderRadius: '999px',
                      transition: 'width 0.35s ease'
                    }} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Fixed Bottom Button: Add Fee Details covering left to right ── */}
      <div style={{
        padding: '12px 16px',
        paddingBottom: 'calc(12px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)))',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        flexShrink: 0
      }}>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '13px 18px',
            fontSize: '13.5px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(10, 31, 61, 0.2)'
          }}
        >
          <Plus size={18} />
          <span>Add Fee Details</span>
        </button>
      </div>

      {/* ── Student Fee Details Sheet (When Card is Opened) ── */}
      {selectedStudent && (
        <div
          className="modal-backdrop-05s"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedStudent(null); }}
        >
          <div
            className="modal-sheet-05s"
            style={{
              padding: '20px 18px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div className="sheet-drag-handle" />

            {/* Header with Student Name & Course */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '6px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                    {selectedStudent.name}
                  </h3>
                  {(selectedStudent.isFullyPaid || selectedStudent.paidFee >= selectedStudent.totalFee) && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                      <CheckCircle2 size={13} /> Full Paid
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>
                  {selectedStudent.course} • Roll #{selectedStudent.roll || selectedStudent.rollNumber || '101'}
                </span>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Fee Breakdown Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginTop: '16px'
            }}>
              <div style={{ background: '#f8fafc', padding: '10px 8px', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Total Fee</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', marginTop: '2px', display: 'block' }}>
                  ₹{Number(selectedStudent.totalFee).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({formatFeeAmount(selectedStudent.totalFee)})</span>
              </div>

              <div style={{ background: '#eff6ff', padding: '10px 8px', borderRadius: '10px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <span style={{ fontSize: '10.5px', color: '#1d4ed8', fontWeight: 600, display: 'block' }}>Paid Fee</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#1d4ed8', marginTop: '2px', display: 'block' }}>
                  ₹{Number(selectedStudent.paidFee).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '10px', color: '#1d4ed8' }}>({formatFeeAmount(selectedStudent.paidFee)})</span>
              </div>

              <div style={{ background: '#fef2f2', padding: '10px 8px', borderRadius: '10px', border: '1px solid #fecaca', textAlign: 'center' }}>
                <span style={{ fontSize: '10.5px', color: '#b91c1c', fontWeight: 600, display: 'block' }}>Remaining</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#b91c1c', marginTop: '2px', display: 'block' }}>
                  ₹{Math.max(0, selectedStudent.totalFee - selectedStudent.paidFee).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '10px', color: '#b91c1c' }}>({formatFeeAmount(Math.max(0, selectedStudent.totalFee - selectedStudent.paidFee))})</span>
              </div>
            </div>

            {/* Visual Fee Bar in Details View */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-900)' }}>
                  {formatFeeFraction(selectedStudent.paidFee, selectedStudent.totalFee)}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {selectedStudent.totalFee > 0 ? Math.round((selectedStudent.paidFee / selectedStudent.totalFee) * 100) : 0}% Paid
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '12px',
                background: '#e2e8f0',
                borderRadius: '999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${selectedStudent.totalFee > 0 ? Math.min(100, Math.max(0, (selectedStudent.paidFee / selectedStudent.totalFee) * 100)) : 0}%`,
                  height: '100%',
                  background: '#2563eb',
                  borderRadius: '999px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Inline Edit Form when Edit is clicked */}
            {isEditing ? (
              <div style={{
                marginTop: '16px',
                padding: '14px',
                background: 'var(--surface-alt)',
                borderRadius: '12px',
                border: '1.5px solid var(--brand-700)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                    Edit Paid Fees (Admin)
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--brand-700)', fontWeight: 700 }}>
                    Preview: {formatFeeFraction(editPaidFee, editTotalFee)}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Paid Fee Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={editPaidFee}
                    onChange={(e) => setEditPaidFee(e.target.value)}
                    placeholder="e.g. 15000"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#1d4ed8'
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    e.g. change 11000 to 15000 (displays as 15k)
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Total Fee Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={editTotalFee}
                    onChange={(e) => setEditTotalFee(e.target.value)}
                    placeholder="e.g. 20000"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="btn-primary"
                    style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : null}

            {/* ── 3 Action Buttons Specified in Requirements ── */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '20px'
            }}>
              {/* 1. Button: Send Alert */}
              <button
                type="button"
                onClick={() => handleSendAlert(selectedStudent)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <Bell size={16} />
                <span>Send Alert</span>
                <span style={{ fontSize: '11px', opacity: 0.85, fontWeight: 500 }}>(Student & Parent)</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {/* 2. Button: Edit */}
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    flex: 1,
                    padding: '11px 12px',
                    borderRadius: '10px',
                    background: isEditing ? 'var(--brand-100)' : 'var(--surface-alt)',
                    color: 'var(--brand-900)',
                    border: '1.5px solid var(--border)',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={15} />
                  <span>{isEditing ? 'Close Edit' : 'Edit'}</span>
                </button>

                {/* 3. Button: Full Paid */}
                <button
                  type="button"
                  onClick={() => handleMarkFullPaid(selectedStudent)}
                  style={{
                    flex: 1,
                    padding: '11px 12px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Full Paid</span>
                </button>
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid var(--border)',
              fontSize: '11px',
              color: 'var(--text-secondary)'
            }}>
              💡 <b>Tip:</b> Clicking <b>Full Paid</b> applies a permanent green tick to {selectedStudent.name}'s card whenever searched in the institute database.
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Manual Add Modal (Button for admin to add these details manually too) ── */}
      {showAddModal && (
        <div
          className="modal-backdrop-05s"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div
            className="modal-sheet-05s"
            style={{
              padding: '22px 18px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div className="sheet-drag-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>
                  Add Student Fee Details
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Enter student fee records manually
                </span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveManualRecord} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Full Name"
                  value={addStudentName}
                  onChange={(e) => setAddStudentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <MobileDropdown
                label="Course / Standard *"
                title="Select Course / Standard"
                options={COURSE_OPTIONS.map(c => ({ value: c, label: c }))}
                value={addStudentCourse}
                onChange={val => setAddStudentCourse(val)}
                placeholder="Select Course"
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Total Fee (₹) *
                    </label>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-700)' }}>
                      {formatFeeAmount(addTotalFee)}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 20000"
                    value={addTotalFee}
                    onChange={(e) => setAddTotalFee(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '13px'
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Use L for Lakhs (e.g. 100000 = 1L)</span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Paid Fee (₹) *
                    </label>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8' }}>
                      {formatFeeAmount(addPaidFee)}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 11000"
                    value={addPaidFee}
                    onChange={(e) => setAddPaidFee(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '13px'
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Displays as {formatFeeFraction(addPaidFee, addTotalFee)}</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Remarks / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1st installment paid via UPI"
                  value={addRemarks}
                  onChange={(e) => setAddRemarks(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
