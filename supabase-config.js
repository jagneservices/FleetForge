// Read Supabase project credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client (compatible with supabase-js v2)
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
