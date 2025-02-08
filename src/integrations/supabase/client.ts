import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'http://46.202.163.183:8000/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4OTUzMDAwLAogICJleHAiOiAxODk2NzE5NDAwCn0.JuaouKMNgs7SS7Z-9Y68shzOI5CEsdQXBfZJESPqXUY';

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