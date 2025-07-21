// Replace with your Supabase project credentials
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Initialize Supabase client (compatible with supabase-js v2)
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
