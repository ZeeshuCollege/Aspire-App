import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wandukvjtpvgvqhknqqm.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbmR1a3ZqdHB2Z3ZxaGtucXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDk4MDUsImV4cCI6MjEwNTIyNTgwNX0.Ne7VUpRA8-4bZ10q7l2VPvwLc_ZtPxicuS-4k_ILn0Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
