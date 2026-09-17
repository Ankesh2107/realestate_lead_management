const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key || url.includes('YOUR_PROJECT') || key.includes('YOUR_SERVICE')) {
  console.warn(
    '[supabase] WARNING: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set (or still placeholders) in .env. ' +
    'Database calls will fail until you add real Supabase credentials.'
  );
}

const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder', {
  auth: { persistSession: false }
});

module.exports = { supabase };
