/**
 * ASPIRE Learning Centre - Fee Management Service
 * Manages student fee records, progress calculations, amount formatting (k and L),
 * persistent storage, and alerts dispatch for Students & Parents.
 */

import { getStoredStudents } from './userAuthStore.js';

export const FEES_STORAGE_KEY = 'aspire_fees_records_v1';

/**
 * Format amounts according to ASPIRE rules:
 * - Use 'L' for Lakh (>= 1,00,000) e.g., 100000 -> 1L, 150000 -> 1.5L
 * - Use 'k' for Thousands (>= 1,000) e.g., 11000 -> 11k, 20000 -> 20k
 * - Pure numbers for < 1000
 */
export function formatFeeAmount(val) {
  const num = Number(val);
  if (isNaN(num) || num === 0) return '0';

  if (num >= 100000) {
    const inLakhs = num / 100000;
    const formatted = Number.isInteger(inLakhs)
      ? inLakhs.toString()
      : parseFloat(inLakhs.toFixed(2)).toString();
    return `${formatted}L`;
  }

  if (num >= 1000) {
    const inThousands = num / 1000;
    const formatted = Number.isInteger(inThousands)
      ? inThousands.toString()
      : parseFloat(inThousands.toFixed(1)).toString();
    return `${formatted}k`;
  }

  return num.toString();
}

/**
 * Format paid and total into "11k/20k" or "1.5L/2L"
 */
export function formatFeeFraction(paid, total) {
  return `${formatFeeAmount(paid)}/${formatFeeAmount(total)}`;
}

/**
 * Initial Default Fee Records
 * Rohan Sharma has 11k paid out of 20k (11k/20k) matching the prompt
 */
export const DEFAULT_FEE_RECORDS = [
  {
    id: 's-101',
    name: 'Rohan Sharma',
    roll: '101',
    rollNumber: 'ASPIRE-2025-101',
    course: '12th Science',
    totalFee: 20000,
    paidFee: 11000,
    isFullyPaid: false,
    lastPaymentDate: '15 Sep 2026',
    remarks: '1st Installment Cleared'
  },
  {
    id: 's-102',
    name: 'Aarav Patel',
    roll: '102',
    rollNumber: 'ASPIRE-2025-102',
    course: 'JEE (Mains + Adv)',
    totalFee: 75000,
    paidFee: 45000,
    isFullyPaid: false,
    lastPaymentDate: '10 Sep 2026',
    remarks: 'Partially Paid'
  },
  {
    id: 's-103',
    name: 'Ananya Iyer',
    roll: '103',
    rollNumber: 'ASPIRE-2025-103',
    course: 'NEET',
    totalFee: 120000,
    paidFee: 120000,
    isFullyPaid: true,
    lastPaymentDate: '01 Sep 2026',
    remarks: 'One-time Full Advance'
  },
  {
    id: 's-104',
    name: 'Sneha Kulkarni',
    roll: '104',
    rollNumber: 'ASPIRE-2025-104',
    course: '12th Science',
    totalFee: 25000,
    paidFee: 18000,
    isFullyPaid: false,
    lastPaymentDate: '22 Aug 2026',
    remarks: 'Balance due next week'
  },
  {
    id: 's-105',
    name: 'Vikram Joshi',
    roll: '105',
    rollNumber: 'ASPIRE-2025-105',
    course: '11th Science',
    totalFee: 20000,
    paidFee: 20000,
    isFullyPaid: true,
    lastPaymentDate: '28 Aug 2026',
    remarks: 'Full Tuition Paid'
  },
  {
    id: 's-106',
    name: 'Ishita Deshmukh',
    roll: '106',
    rollNumber: 'ASPIRE-2025-106',
    course: 'MHT-CET',
    totalFee: 15000,
    paidFee: 8000,
    isFullyPaid: false,
    lastPaymentDate: '05 Sep 2026',
    remarks: '2nd installment pending'
  },
  {
    id: 's-107',
    name: 'Aditya Verma',
    roll: '107',
    rollNumber: 'ASPIRE-2025-107',
    course: 'JEE (Mains + Adv)',
    totalFee: 200000,
    paidFee: 150000,
    isFullyPaid: false,
    lastPaymentDate: '12 Sep 2026',
    remarks: 'Scholarship Adjusted'
  },
  {
    id: 's-108',
    name: 'Tanvi Nair',
    roll: '108',
    rollNumber: 'ASPIRE-2025-108',
    course: 'NEET',
    totalFee: 120000,
    paidFee: 80000,
    isFullyPaid: false,
    lastPaymentDate: '18 Sep 2026',
    remarks: '3rd Installment Pending'
  },
  {
    id: 's-109',
    name: 'Aryan Gupta',
    roll: '109',
    rollNumber: 'ASPIRE-2025-109',
    course: '9th Standard',
    totalFee: 15000,
    paidFee: 15000,
    isFullyPaid: true,
    lastPaymentDate: '03 Sep 2026',
    remarks: 'Full Fees Cleared'
  },
  {
    id: 's-110',
    name: 'Diya Sharma',
    roll: '110',
    rollNumber: 'ASPIRE-2025-110',
    course: '10th Standard',
    totalFee: 18000,
    paidFee: 12000,
    isFullyPaid: false,
    lastPaymentDate: '14 Sep 2026',
    remarks: 'Remaining 6k due'
  }
];

/**
 * Retrieve fees merged with stored students
 */
export function getStoredFees() {
  let saved = [];
  try {
    const raw = localStorage.getItem(FEES_STORAGE_KEY);
    if (raw) {
      saved = JSON.parse(raw);
    }
  } catch (e) {
    saved = [];
  }

  // Base list starts with default records or saved records
  const existingMap = new Map();
  (saved.length > 0 ? saved : DEFAULT_FEE_RECORDS).forEach(item => {
    existingMap.set(item.id || item.name, item);
  });

  // Merge any dynamically registered students from userAuthStore
  try {
    const storedStudents = getStoredStudents();
    if (Array.isArray(storedStudents)) {
      storedStudents.forEach(std => {
        const key = std.id || std.name;
        if (!existingMap.has(key)) {
          // Default fee assignment for newly added student
          existingMap.set(key, {
            id: std.id || `std-${Date.now()}`,
            name: std.name,
            roll: std.roll || std.rollNumber || '—',
            rollNumber: std.rollNumber || std.roll || '—',
            course: std.course || '12th Science',
            totalFee: 20000,
            paidFee: 0,
            isFullyPaid: false,
            lastPaymentDate: '—',
            remarks: 'New Admission'
          });
        }
      });
    }
  } catch (e) {}

  return Array.from(existingMap.values());
}

/**
 * Persist fee list to local storage
 */
export function saveStoredFees(feesList) {
  try {
    localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(feesList || []));
  } catch (e) {
    console.error('Failed to save fees to localStorage', e);
  }
}

/**
 * Update a student's fees details (e.g. edit paid fees from 11k to 15k out of 20k)
 */
export function updateStudentFeeRecord(studentId, updates) {
  const fees = getStoredFees();
  const updatedList = fees.map(item => {
    if (item.id === studentId || item.name === studentId) {
      const newTotal = updates.totalFee !== undefined ? Number(updates.totalFee) : item.totalFee;
      const newPaid = updates.paidFee !== undefined ? Number(updates.paidFee) : item.paidFee;
      const fullPaid = updates.isFullyPaid !== undefined 
        ? updates.isFullyPaid 
        : (newPaid >= newTotal && newTotal > 0);

      return {
        ...item,
        ...updates,
        totalFee: newTotal,
        paidFee: newPaid,
        isFullyPaid: fullPaid,
        lastPaymentDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      };
    }
    return item;
  });

  saveStoredFees(updatedList);
  return updatedList;
}

/**
 * Mark a student's fees as Full Paid
 */
export function markStudentAsFullPaid(studentId) {
  const fees = getStoredFees();
  const updatedList = fees.map(item => {
    if (item.id === studentId || item.name === studentId) {
      return {
        ...item,
        paidFee: item.totalFee,
        isFullyPaid: true,
        lastPaymentDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        remarks: 'Marked Fully Paid by Admin'
      };
    }
    return item;
  });

  saveStoredFees(updatedList);
  return updatedList;
}

/**
 * Add a new manual fee entry by Admin
 */
export function addManualFeeRecord(record) {
  const fees = getStoredFees();
  const total = Number(record.totalFee) || 0;
  const paid = Number(record.paidFee) || 0;
  const isFull = paid >= total && total > 0;

  const newEntry = {
    id: record.id || `fee-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: record.name.trim(),
    roll: record.roll || record.rollNumber || '—',
    rollNumber: record.rollNumber || record.roll || '—',
    course: record.course || '12th Science',
    totalFee: total,
    paidFee: paid,
    isFullyPaid: isFull,
    lastPaymentDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    remarks: record.remarks || 'Manual Admin Entry'
  };

  const updatedList = [newEntry, ...fees];
  saveStoredFees(updatedList);
  return { updatedList, newEntry };
}

/**
 * Send Fee Alert to Student and Parent
 * Dispatches formal notice into ASPIRE notice board & triggers custom events
 */
export function sendFeeNotificationAlert(student) {
  const total = Number(student.totalFee) || 0;
  const paid = Number(student.paidFee) || 0;
  const remaining = Math.max(0, total - paid);
  const isCleared = student.isFullyPaid || paid >= total;
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const totalFormatted = formatFeeAmount(total);
  const paidFormatted = formatFeeAmount(paid);
  const remainingFormatted = formatFeeAmount(remaining);
  const fractionStr = formatFeeFraction(paid, total);

  const notice = {
    id: `fee-alert-${student.id}-${Date.now()}`,
    title: isCleared 
      ? `✅ Fee Clearance Receipt: ${student.name}` 
      : `⚠️ Fee Account Alert: ${student.name}`,
    message: isCleared
      ? `Full Fee Notification for ${student.name} (${student.course}): All fees totaling ₹${total.toLocaleString('en-IN')} (${totalFormatted}) have been fully settled (${fractionStr}). Account is in good standing.`
      : `Institute Fee Notice for ${student.name} (${student.course}): Total Fee: ₹${total.toLocaleString('en-IN')} (${totalFormatted}), Paid: ₹${paid.toLocaleString('en-IN')} (${paidFormatted}), Outstanding Balance: ₹${remaining.toLocaleString('en-IN')} (${remainingFormatted}). Status: ${fractionStr} Paid. Kindly clear the pending balance at institute desk or via online portal.`,
    category: 'Fee',
    priority: isCleared ? 'normal' : 'high',
    timestamp: 'Just now',
    date: today,
    read: false,
    studentId: student.id,
    studentName: student.name,
    courses: [student.course, 'All Courses'],
    feeDetails: {
      totalFee: total,
      paidFee: paid,
      remainingFee: remaining,
      fraction: fractionStr,
      isFullyPaid: isCleared
    }
  };

  // 1. Save directly to aspire_notices_list
  try {
    const rawNotices = localStorage.getItem('aspire_notices_list');
    const notices = rawNotices ? JSON.parse(rawNotices) : [];
    const updatedNotices = [notice, ...notices];
    localStorage.setItem('aspire_notices_list', JSON.stringify(updatedNotices));
  } catch (e) {}

  // 2. Broadcast application-level custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aspire:fee-alert', {
      detail: { notice, student }
    }));
  }

  return notice;
}
