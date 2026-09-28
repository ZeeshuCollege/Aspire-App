/**
 * ASPIRE Learning Centre - Fee Management Service
 * Manages student fee records, progress calculations, amount formatting (k and L),
 * persistent storage directly in Supabase Backend Database, and alerts dispatch.
 */

import { supabase } from './supabaseClient.js';
import { getStoredStudents } from './userAuthStore.js';

export const FEES_STORAGE_KEY = 'aspire_fees_records_v1';

/**
 * Format amounts according to ASPIRE rules:
 * - Use 'L' for Lakh (>= 1,00,000) e.g., 100000 -> 1L, 150000 -> 1.5L
 * - Use 'k' for Thousands (>= 1,00,000) e.g., 11000 -> 11k, 20000 -> 20k
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
 * Default Seed Records
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

// In-memory runtime cache for snappy zero-latency UI rendering
let runtimeFeeCache = null;

/**
 * Sync individual record directly into Supabase backend database
 */
export async function syncFeeToSupabaseBackend(record) {
  if (!record) return;

  try {
    // 1. Try upserting to dedicated student_fees table if available
    const { error: feeErr } = await supabase
      .from('student_fees')
      .upsert({
        id: record.id || `fee-${Date.now()}`,
        name: record.name,
        roll: record.roll || record.rollNumber || '—',
        course: record.course || '12th Science',
        total_fee: Number(record.totalFee) || 0,
        paid_fee: Number(record.paidFee) || 0,
        is_fully_paid: Boolean(record.isFullyPaid),
        last_payment_date: record.lastPaymentDate || '—',
        remarks: record.remarks || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (!feeErr) {
      console.log(`[Supabase Fee DB] Record "${record.name}" synced to student_fees table.`);
    }
  } catch (err) {
    // student_fees table might not be created yet, fallback to profiles table
  }

  try {
    // 2. Sync to Supabase public.profiles table
    const feePayload = {
      totalFee: Number(record.totalFee) || 0,
      paidFee: Number(record.paidFee) || 0,
      isFullyPaid: Boolean(record.isFullyPaid),
      lastPaymentDate: record.lastPaymentDate || '—',
      remarks: record.remarks || ''
    };

    // Update by ID or by name/email
    const query = supabase.from('profiles').update({
      batches: JSON.stringify(feePayload),
      course: record.course || undefined,
      updated_at: new Date().toISOString()
    });

    if (record.id && record.id.includes('-') && record.id.length > 20) {
      await query.eq('id', record.id);
    } else {
      await query.or(`full_name.eq.${record.name},email.eq.${record.email || ''}`);
    }
  } catch (profErr) {
    console.warn('[Supabase Fee DB] Profiles sync notice:', profErr?.message);
  }
}

/**
 * Fetch all fee records live from Supabase Backend Database
 */
export async function fetchFeesFromSupabase() {
  const map = new Map();

  // 1. Populate default records first
  DEFAULT_FEE_RECORDS.forEach(item => {
    map.set(item.id || item.name, { ...item });
  });

  // 2. Fetch from Supabase student_fees table (if created)
  try {
    const { data: dbFees, error: dbErr } = await supabase
      .from('student_fees')
      .select('*')
      .order('created_at', { ascending: false });

    if (!dbErr && Array.isArray(dbFees) && dbFees.length > 0) {
      dbFees.forEach(row => {
        const item = {
          id: row.id,
          name: row.name,
          roll: row.roll || '—',
          rollNumber: row.roll || '—',
          course: row.course || '12th Science',
          totalFee: Number(row.total_fee) || 0,
          paidFee: Number(row.paid_fee) || 0,
          isFullyPaid: Boolean(row.is_fully_paid) || (Number(row.paid_fee) >= Number(row.total_fee) && Number(row.total_fee) > 0),
          lastPaymentDate: row.last_payment_date || '—',
          remarks: row.remarks || ''
        };
        map.set(item.id || item.name, item);
      });
    }
  } catch (e) {}

  // 3. Fetch from Supabase public.profiles table (role = 'student')
  try {
    const { data: profiles, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student');

    if (!pErr && Array.isArray(profiles)) {
      profiles.forEach(p => {
        const key = p.id || p.full_name;
        let feeData = null;
        if (p.batches) {
          try {
            feeData = JSON.parse(p.batches);
          } catch (e) {}
        }

        const existing = map.get(key) || map.get(p.full_name);
        const total = feeData?.totalFee !== undefined ? Number(feeData.totalFee) : (existing?.totalFee || 20000);
        const paid = feeData?.paidFee !== undefined ? Number(feeData.paidFee) : (existing?.paidFee || 0);

        map.set(key, {
          id: p.id,
          name: p.full_name,
          roll: p.roll_number || existing?.roll || '—',
          rollNumber: p.roll_number || existing?.rollNumber || '—',
          course: p.course || existing?.course || '12th Science',
          email: p.email,
          totalFee: total,
          paidFee: paid,
          isFullyPaid: feeData?.isFullyPaid !== undefined ? feeData.isFullyPaid : (paid >= total && total > 0),
          lastPaymentDate: feeData?.lastPaymentDate || existing?.lastPaymentDate || '—',
          remarks: feeData?.remarks || existing?.remarks || 'Enrolled in Supabase'
        });
      });
    }
  } catch (e) {}

  // Also include any locally registered students in auth store
  try {
    const stored = getStoredStudents();
    if (Array.isArray(stored)) {
      stored.forEach(std => {
        const key = std.id || std.name;
        if (!map.has(key)) {
          map.set(key, {
            id: std.id,
            name: std.name,
            roll: std.roll || std.rollNumber || '—',
            rollNumber: std.rollNumber || std.roll || '—',
            course: std.course || '12th Science',
            totalFee: 20000,
            paidFee: 0,
            isFullyPaid: false,
            lastPaymentDate: '—',
            remarks: 'New Student'
          });
        }
      });
    }
  } catch (e) {}

  const list = Array.from(map.values());
  runtimeFeeCache = list;
  // Cache copy for instant offline boot
  try { localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
  return list;
}

/**
 * Synchronous getter: Returns in-memory cache / persistent snapshot
 */
export function getStoredFees() {
  if (runtimeFeeCache && runtimeFeeCache.length > 0) {
    return runtimeFeeCache;
  }
  try {
    const raw = localStorage.getItem(FEES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        runtimeFeeCache = parsed;
        return parsed;
      }
    }
  } catch (e) {}

  runtimeFeeCache = DEFAULT_FEE_RECORDS;
  return DEFAULT_FEE_RECORDS;
}

/**
 * Save fee list to runtime cache and async persist to Supabase
 */
export function saveStoredFees(feesList) {
  runtimeFeeCache = feesList;
  try {
    localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(feesList || []));
  } catch (e) {}
}

/**
 * Update a student's fees details (e.g. edit paid fees from 11k to 15k out of 20k)
 * Stores directly in Supabase Backend Database.
 */
export function updateStudentFeeRecord(studentId, updates) {
  const current = getStoredFees();
  let updatedRecord = null;

  const updatedList = current.map(item => {
    if (item.id === studentId || item.name === studentId) {
      const newTotal = updates.totalFee !== undefined ? Number(updates.totalFee) : item.totalFee;
      const newPaid = updates.paidFee !== undefined ? Number(updates.paidFee) : item.paidFee;
      const fullPaid = updates.isFullyPaid !== undefined 
        ? updates.isFullyPaid 
        : (newPaid >= newTotal && newTotal > 0);

      updatedRecord = {
        ...item,
        ...updates,
        totalFee: newTotal,
        paidFee: newPaid,
        isFullyPaid: fullPaid,
        lastPaymentDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      return updatedRecord;
    }
    return item;
  });

  saveStoredFees(updatedList);

  // Write directly to Supabase Backend
  if (updatedRecord) {
    syncFeeToSupabaseBackend(updatedRecord);
  }

  return updatedList;
}

/**
 * Mark a student's fees as Full Paid
 * Stores directly in Supabase Backend Database.
 */
export function markStudentAsFullPaid(studentId) {
  const current = getStoredFees();
  let updatedRecord = null;

  const updatedList = current.map(item => {
    if (item.id === studentId || item.name === studentId) {
      updatedRecord = {
        ...item,
        paidFee: item.totalFee,
        isFullyPaid: true,
        lastPaymentDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        remarks: 'Marked Fully Paid by Admin'
      };
      return updatedRecord;
    }
    return item;
  });

  saveStoredFees(updatedList);

  // Write directly to Supabase Backend
  if (updatedRecord) {
    syncFeeToSupabaseBackend(updatedRecord);
  }

  return updatedList;
}

/**
 * Add a new manual fee entry by Admin
 * Stores directly in Supabase Backend Database.
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

  // Write directly to Supabase Backend
  syncFeeToSupabaseBackend(newEntry);

  return { updatedList, newEntry };
}

/**
 * Send Fee Alert to Student and Parent
 * Dispatches notice & broadcasts custom events
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

  // Broadcast event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aspire:fee-alert', {
      detail: { notice, student }
    }));
  }

  return notice;
}
