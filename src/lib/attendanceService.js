import { supabase } from './supabaseClient';

/**
 * SQL Schema for Supabase SQL Editor:
 * 
 * CREATE TABLE IF NOT EXISTS attendance_records (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   batch_id TEXT NOT NULL,
 *   batch_name TEXT NOT NULL,
 *   subject TEXT NOT NULL,
 *   date DATE NOT NULL DEFAULT CURRENT_DATE,
 *   time TEXT,
 *   teacher_name TEXT,
 *   student_id TEXT NOT NULL,
 *   student_name TEXT NOT NULL,
 *   roll TEXT,
 *   status TEXT NOT NULL CHECK (status IN ('Present', 'Absent')),
 *   locked BOOLEAN DEFAULT TRUE,
 *   updated_by TEXT DEFAULT 'teacher', -- 'teacher' or 'admin'
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE (batch_id, student_id, date)
 * );
 */

const STORAGE_KEY = 'aspire_attendance_records_v1';
const LOCKED_KEY = 'aspire_attendance_locked_batches_v1';

// Helper: Format today's date as YYYY-MM-DD
export const getTodayDateKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Read local attendance cache
const getLocalRecords = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read attendance from localStorage', err);
    return [];
  }
};

// Helper: Save local attendance cache
const saveLocalRecords = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to write attendance to localStorage', err);
  }
};

// Helper: Read locked batches
const getLockedBatches = () => {
  try {
    const raw = localStorage.getItem(LOCKED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to read locked batches from localStorage', err);
    return {};
  }
};

// Helper: Save locked batch
const setBatchLocked = (batchId, dateStr, meta = {}) => {
  try {
    const locked = getLockedBatches();
    const key = `${dateStr}_${batchId}`;
    locked[key] = {
      isLocked: true,
      lockedAt: meta.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      teacherName: meta.teacherName || 'Teacher',
      ...meta
    };
    localStorage.setItem(LOCKED_KEY, JSON.stringify(locked));
  } catch (err) {
    console.error('Failed to set batch locked in localStorage', err);
  }
};

/**
 * Check if a batch is locked for a given date
 */
export const isBatchAttendanceLocked = (batchId, dateStr = getTodayDateKey()) => {
  const locked = getLockedBatches();
  const key = `${dateStr}_${batchId}`;
  return locked[key] || null;
};

/**
 * Get attendance records for a batch on a given date
 */
export const getBatchAttendance = async (batchId, dateStr = getTodayDateKey()) => {
  // 1. Try fetching from Supabase
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('batch_id', String(batchId))
        .eq('date', dateStr);

      if (!error && data && data.length > 0) {
        // Sync to local cache
        const local = getLocalRecords();
        const otherRecords = local.filter(r => !(String(r.batch_id) === String(batchId) && r.date === dateStr));
        saveLocalRecords([...otherRecords, ...data]);
        
        // Update locked status if any records are marked locked
        const isAnyLocked = data.some(r => r.locked);
        if (isAnyLocked) {
          setBatchLocked(batchId, dateStr, {
            time: data[0].time,
            teacherName: data[0].teacher_name
          });
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Supabase fetch failed or table not created yet; falling back to local cache', err);
  }

  // 2. Fallback to local cache
  const local = getLocalRecords();
  return local.filter(r => String(r.batch_id) === String(batchId) && r.date === dateStr);
};

/**
 * Save & Lock batch attendance (Teacher Submission)
 * Writes to Supabase and persistent local storage
 */
export const saveBatchAttendance = async ({
  batchId,
  batchName,
  subject,
  teacherName = 'Faculty',
  students, // Array of { id, name, roll, status }
  time
}) => {
  const dateStr = getTodayDateKey();
  const formattedTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const recordsToSave = students.map(s => ({
    id: `att_${batchId}_${s.id}_${dateStr}`,
    batch_id: String(batchId),
    batch_name: batchName,
    subject: subject,
    teacher_name: teacherName,
    student_id: String(s.id),
    student_name: s.name,
    roll: s.roll || '',
    status: s.status, // 'Present' or 'Absent'
    date: dateStr,
    time: formattedTime,
    locked: true,
    updated_by: 'teacher',
    updated_at: new Date().toISOString()
  }));

  // 1. Save to local storage cache immediately
  const local = getLocalRecords();
  const filtered = local.filter(r => !(String(r.batch_id) === String(batchId) && r.date === dateStr));
  saveLocalRecords([...filtered, ...recordsToSave]);

  // Mark batch as locked locally
  setBatchLocked(batchId, dateStr, {
    time: formattedTime,
    teacherName,
    batchName,
    subject
  });

  // 2. Persist to Supabase if available
  try {
    if (supabase) {
      const { error } = await supabase
        .from('attendance_records')
        .upsert(recordsToSave, { onConflict: 'batch_id,student_id,date' });

      if (error) {
        console.warn('Supabase upsert warning (table might need creation in SQL editor):', error.message);
      }
    }
  } catch (err) {
    console.warn('Could not sync attendance to Supabase (offline or unconfigured table):', err);
  }

  // Broadcast real-time update event
  window.dispatchEvent(new CustomEvent('aspire:attendance-updated', {
    detail: {
      batchId,
      batchName,
      subject,
      date: dateStr,
      time: formattedTime,
      records: recordsToSave
    }
  }));

  return recordsToSave;
};

/**
 * Admin Edit / Override student attendance
 */
export const updateAttendanceByAdmin = async ({
  batchId,
  studentId,
  newStatus, // 'Present' | 'Absent'
  dateStr = getTodayDateKey(),
  adminName = 'Institute Admin'
}) => {
  const local = getLocalRecords();
  let updatedRecord = null;

  const newRecords = local.map(r => {
    if (
      (!batchId || String(r.batch_id) === String(batchId)) &&
      String(r.student_id) === String(studentId) &&
      r.date === dateStr
    ) {
      updatedRecord = {
        ...r,
        status: newStatus,
        updated_by: 'admin',
        admin_editor: adminName,
        updated_at: new Date().toISOString()
      };
      return updatedRecord;
    }
    return r;
  });

  if (updatedRecord) {
    saveLocalRecords(newRecords);

    // Update in Supabase
    try {
      if (supabase) {
        await supabase
          .from('attendance_records')
          .update({
            status: newStatus,
            updated_by: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('student_id', String(studentId))
          .eq('date', dateStr);
      }
    } catch (err) {
      console.warn('Could not update Supabase record from admin:', err);
    }

    // Broadcast change
    window.dispatchEvent(new CustomEvent('aspire:attendance-updated', {
      detail: {
        studentId,
        newStatus,
        date: dateStr,
        updatedBy: 'admin'
      }
    }));
  }

  return updatedRecord;
};

/**
 * Get single student's attendance record for today
 */
export const getStudentTodayAttendance = (studentId, dateStr = getTodayDateKey()) => {
  const local = getLocalRecords();
  return local.find(r => String(r.student_id) === String(studentId) && r.date === dateStr) || null;
};
