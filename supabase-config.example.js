// Replace with your Supabase project credentials
const SUPABASE_URL = 'https://qszdzpuzvdbioqtrigqo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzemR6cHV6dmRiaW9xdHJpZ3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODk0NDYsImV4cCI6MjA2ODM2NTQ0Nn0.N52yVljc8rwQ4k0rNAej1AbfBoH0hickKpsIQjQz9Og';

// Initialize Supabase client (compatible with supabase-js v2)
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
