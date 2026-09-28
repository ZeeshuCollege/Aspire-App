import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wandukvjtpvgvqhknqqm.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Regular client for standard operations (login, queries, real-time sync with RLS)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// In client-side bundle, all DB operations use Row Level Security via the anonymous key.
// Privileged administrative operations must only run via secure backend functions.
export const supabaseAdmin = null;


