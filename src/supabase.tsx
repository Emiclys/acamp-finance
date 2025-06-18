import { createClient } from "@supabase/supabase-js";

const VITE_SUPABASE_URL = "https://rtqoiybkadeuzqqvvwrt.supabase.co";
const VITE_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0cW9peWJrYWRldXpxcXZ2d3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDgxNjQsImV4cCI6MjA2NTU4NDE2NH0.a2oNTy3BZJ0JeN19gMfvJPcXYIVBQ8o8oa0G_kOsg9M";

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

export default supabase;
