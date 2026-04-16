import { createClient } from '@supabase/supabase-js';

console.log('All env:', import.meta.env);
console.log('URL raw:', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY raw:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('MODE:', import.meta.env.MODE);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);