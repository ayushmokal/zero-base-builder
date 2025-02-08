import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://46.202.163.183:8000/';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4OTUzMDAwLAogICJleHAiOiAxODk2NzE5NDAwCn0.JuaouKMNgs7SS7Z-9Y68shzOI5CEsdQXBfZJESPqXUY';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment configuration.');
  throw new Error('Supabase configuration is incomplete');
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