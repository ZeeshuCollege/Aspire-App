/**
 * ASPIRE Auth Store — Simple & Reliable
 * Single source of truth: flat email→password map in localStorage
 * Secondary: Supabase Auth (when network available)
 */

import { supabase, supabaseAdmin } from './supabaseClient';

const CREDS_KEY = 'aspire_creds_v1';        // email → password map
const USERS_KEY = 'aspire_users_v1';        // email → full user object
const STUDENTS_LIST_KEY = 'aspire_students_list';
const TEACHERS_LIST_KEY = 'aspire_teachers_list';
const PARENTS_LIST_KEY = 'aspire_parents_list';

// ----- Credential Helpers -----

const getCredMap = () => {
  try { return JSON.parse(localStorage.getItem(CREDS_KEY) || '{}'); } catch { return {}; }
};
const getUserMap = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch { return {}; }
};
const saveCredMap = (m) => { try { localStorage.setItem(CREDS_KEY, JSON.stringify(m)); } catch {} };
const saveUserMap = (m) => { try { localStorage.setItem(USERS_KEY, JSON.stringify(m)); } catch {} };

// ----- Security Sanitizer -----
// Strips executable tags and control characters (#13 Sanitize before storing)
const sanitizeText = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

// ----- Public API -----

/**
 * Called by Admin when adding a student/teacher/parent.
 * Saves locally immediately. Also creates in Supabase (no email sent).
 */
export const addRegisteredUser = async (user) => {
  const cleanEmail = sanitizeText(user.email || '').toLowerCase();
  const cleanPassword = (user.password || '').trim();
  if (!cleanEmail || !cleanPassword) return null;

  const record = {
    id: user.id || `usr-${Date.now()}`,
    name: sanitizeText(user.name || 'ASPIRE User'),
    email: cleanEmail,
    password: cleanPassword,
    role: user.role || 'student',
    course: sanitizeText(user.course || '12th Science'),
    rollNumber: sanitizeText(user.rollNumber || `ASPIRE-${Date.now().toString().slice(-4)}`),
    phone: sanitizeText(user.phone || ''),
    bloodGroup: sanitizeText(user.bloodGroup || ''),
    batches: user.batches || [],
    subjects: user.subjects || [],
    linkedChildName: sanitizeText(user.linkedChildName || ''),
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  // ── 1. Save locally (always works, instant) ──
  const creds = getCredMap();
  creds[cleanEmail] = cleanPassword;
  saveCredMap(creds);

  const users = getUserMap();
  users[cleanEmail] = record;
  saveUserMap(users);

  // ── 2. Also push to Supabase Admin API (so Supabase login works too) ──
  if (supabaseAdmin) {
    try {
      const { data: { users: allUsers }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (!error) {
        const existingSupaUser = allUsers?.find(u => u.email === cleanEmail);
        if (existingSupaUser) {
          await supabaseAdmin.auth.admin.updateUserById(existingSupaUser.id, {
            password: cleanPassword,
            email_confirm: true,
            user_metadata: { full_name: record.name, role: record.role, course: record.course, rollNumber: record.rollNumber }
          });
        } else {
          await supabaseAdmin.auth.admin.createUser({
            email: cleanEmail,
            password: cleanPassword,
            email_confirm: true,
            user_metadata: { full_name: record.name, role: record.role, course: record.course, rollNumber: record.rollNumber }
          });
        }
      }
    } catch (err) {
      // Network off or key issue — local auth still works perfectly
      console.warn('[ASPIRE] Supabase user sync skipped (local auth still active):', err?.message);
    }
  }

  return record;
};

/**
 * Authenticate a user. Returns user object or null.
 * Checks ALL possible storage formats (new and old) for compatibility.
 */
export const authenticateLocalUser = (email, password) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();
  if (!cleanEmail || !cleanPass) return null;

  // ── 1. New format: flat creds map (aspire_creds_v1) ──
  try {
    const creds = getCredMap();
    if (creds[cleanEmail] !== undefined && creds[cleanEmail] === cleanPass) {
      const users = getUserMap();
      const record = users[cleanEmail];
      if (record) return record;
      return { id: `local-${Date.now()}`, email: cleanEmail, role: 'student', name: cleanEmail.split('@')[0] };
    }
  } catch {}

  // ── 2. Old format: aspire_user_<email> direct key ──
  try {
    const directRaw = localStorage.getItem(`aspire_user_${cleanEmail}`);
    if (directRaw) {
      const u = JSON.parse(directRaw);
      if (u && (u.password || '').trim() === cleanPass) {
        // Migrate to new format
        const creds = getCredMap(); creds[cleanEmail] = cleanPass; saveCredMap(creds);
        const users = getUserMap(); users[cleanEmail] = u; saveUserMap(users);
        return u;
      }
    }
  } catch {}

  // ── 3. Old format: aspire_registered_users array ──
  try {
    const regRaw = localStorage.getItem('aspire_registered_users');
    if (regRaw) {
      const regUsers = JSON.parse(regRaw) || [];
      const found = regUsers.find(u =>
        (u.email || '').trim().toLowerCase() === cleanEmail &&
        (u.password || '').trim() === cleanPass
      );
      if (found) {
        // Migrate to new format
        const creds = getCredMap(); creds[cleanEmail] = cleanPass; saveCredMap(creds);
        const users = getUserMap(); users[cleanEmail] = found; saveUserMap(users);
        return found;
      }
    }
  } catch {}

  // ── 4. Fallback: aspire_students_list (has password field) ──
  try {
    const students = getStoredStudents();
    const s = students.find(x =>
      (x.email || '').trim().toLowerCase() === cleanEmail && x.password && x.password.trim() === cleanPass
    );
    if (s) {
      const record = { id: s.id, name: s.name, email: s.email, role: 'student', course: s.course, rollNumber: s.rollNumber || s.roll, phone: s.phone || '', bloodGroup: s.bloodGroup || '' };
      const creds = getCredMap(); creds[cleanEmail] = cleanPass; saveCredMap(creds);
      const users = getUserMap(); users[cleanEmail] = record; saveUserMap(users);
      return record;
    }
  } catch {}

  // ── 5. Fallback: aspire_teachers_list ──
  try {
    const teachers = getStoredTeachers();
    const t = teachers.find(x =>
      (x.email || '').trim().toLowerCase() === cleanEmail && x.password && x.password.trim() === cleanPass
    );
    if (t) {
      const record = { id: t.id, name: t.name, email: t.email, role: 'teacher', subject: t.subject, batches: t.batches };
      const creds = getCredMap(); creds[cleanEmail] = cleanPass; saveCredMap(creds);
      const users = getUserMap(); users[cleanEmail] = record; saveUserMap(users);
      return record;
    }
  } catch {}

  // ── 6. Fallback: aspire_parents_list ──
  try {
    const parents = getStoredParents();
    const p = parents.find(x =>
      (x.email || '').trim().toLowerCase() === cleanEmail && x.password && x.password.trim() === cleanPass
    );
    if (p) {
      const record = { id: p.id, name: p.name, email: p.email, role: 'parent', phone: p.phone };
      const creds = getCredMap(); creds[cleanEmail] = cleanPass; saveCredMap(creds);
      const users = getUserMap(); users[cleanEmail] = record; saveUserMap(users);
      return record;
    }
  } catch {}

  return null;
};

export const getRegisteredUsers = () => {
  const users = getUserMap();
  return Object.values(users);
};

// ----- Students -----

export const getStoredStudents = () => {
  try { return JSON.parse(localStorage.getItem(STUDENTS_LIST_KEY) || '[]'); } catch { return []; }
};

export const saveStoredStudents = (list) => {
  try { localStorage.setItem(STUDENTS_LIST_KEY, JSON.stringify(list || [])); } catch {}
};

export const deleteStoredStudent = (studentId) => {
  const current = getStoredStudents();
  const toDelete = current.find(s => s.id === studentId);
  if (toDelete?.email) {
    const e = toDelete.email.trim().toLowerCase();
    const creds = getCredMap(); delete creds[e]; saveCredMap(creds);
    const users = getUserMap(); delete users[e]; saveUserMap(users);
    // Delete from Supabase too
    supabaseAdmin.auth.admin.listUsers().then(({ data }) => {
      const u = data?.users?.find(x => x.email === e);
      if (u) supabaseAdmin.auth.admin.deleteUser(u.id).catch(() => {});
    }).catch(() => {});
  }
  const updated = current.filter(s => s.id !== studentId);
  saveStoredStudents(updated);
  return updated;
};

// ----- Teachers -----

export const getStoredTeachers = () => {
  try { return JSON.parse(localStorage.getItem(TEACHERS_LIST_KEY) || '[]'); } catch { return []; }
};

export const saveStoredTeachers = (list) => {
  try { localStorage.setItem(TEACHERS_LIST_KEY, JSON.stringify(list || [])); } catch {}
};

export const deleteStoredTeacher = (teacherId) => {
  const current = getStoredTeachers();
  const toDelete = current.find(t => t.id === teacherId);
  if (toDelete?.email) {
    const e = toDelete.email.trim().toLowerCase();
    const creds = getCredMap(); delete creds[e]; saveCredMap(creds);
    const users = getUserMap(); delete users[e]; saveUserMap(users);
  }
  const updated = current.filter(t => t.id !== teacherId);
  saveStoredTeachers(updated);
  return updated;
};

// ----- Parents -----

export const deduplicateParents = (list) => {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.filter(p => {
    if (!p) return false;
    const key = (p.phone || '').replace(/\D/g, '') || (p.email || '').trim().toLowerCase() || (p.name || '').trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getStoredParents = () => {
  try { return deduplicateParents(JSON.parse(localStorage.getItem(PARENTS_LIST_KEY) || '[]')); } catch { return []; }
};

export const saveStoredParents = (list) => {
  try {
    const deduped = deduplicateParents(list || []);
    localStorage.setItem(PARENTS_LIST_KEY, JSON.stringify(deduped));
    return deduped;
  } catch { return list; }
};

export const deleteStoredParent = (parentId) => {
  const current = getStoredParents();
  const toDelete = current.find(p => p.id === parentId);
  if (toDelete?.email) {
    const e = toDelete.email.trim().toLowerCase();
    const creds = getCredMap(); delete creds[e]; saveCredMap(creds);
    const users = getUserMap(); delete users[e]; saveUserMap(users);
  }
  const updated = current.filter(p => p.id !== parentId);
  saveStoredParents(updated);
  return updated;
};
