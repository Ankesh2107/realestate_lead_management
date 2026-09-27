// import { createClient } from '@supabase/supabase-js';

// const url = process.env.SUPABASE_URL;
// const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!url || !key || url.includes('YOUR_PROJECT')) {
//   console.warn(
//     '[supabase] WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing/placeholder. ' +
//     'DB reads and writes will fail until valid credentials are added to .env'
//   );
// }

// export const supabase = createClient(
//   url || 'https://placeholder.supabase.co',
//   key || 'placeholder-key',
//   { auth: { persistSession: false } }
// );


import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
}

// Service-role client — RLS ko bypass karta hai. ONLY server-side code
// (API routes, services) me use karo, kabhi client-side/browser bundle me nahi.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});