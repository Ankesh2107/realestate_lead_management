import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key || url.includes('YOUR_PROJECT')) {
  console.warn(
    '[supabase] WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing/placeholder. ' +
    'DB reads and writes will fail until valid credentials are added to .env'
  );
}

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-key',
  { auth: { persistSession: false } }
);
