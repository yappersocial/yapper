import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = 'https://fcnahusuafrxppxwrfau.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmFodXN1YWZyeHBweHdyZmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MDU1MDMsImV4cCI6MjA5NDE4MTUwM30.64OocHwwuNRWw5k0IrkY9aq7KKaCBiI5_PqoQGc4n2k';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: typeof window !== 'undefined',
  },
});
