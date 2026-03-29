import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

// Safely initialize the client. If keys are missing, we don't call createClient yet.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn("⚠️ Reicrew AI: Supabase environment variables are missing! Registration and Login will be disabled.");
  console.log("Check Vercel Project Settings for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}
