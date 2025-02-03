import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fkthvcaehstlbkgztspt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdGh2Y2FlaHN0bGJrZ3p0c3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MTQ5MDIsImV4cCI6MjA1MjI5MDkwMn0.zGH_oafA9YceNZSeReblH98OUyS28TG7r537ycgkZnY';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration values');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage
    },
    global: {
      headers: {
        'x-my-custom-header': 'my-app-name',
      },
    },
    db: {
      schema: 'public'
    }
  }
);

// Add error handler
supabase.handleError = (error: any) => {
  console.error('Supabase error:', error);
  return error;
};