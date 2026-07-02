import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkTables() {
  console.log("Checking tables on new Supabase url:", process.env.VITE_SUPABASE_URL);
  const tables = ['menu_items', 'categories', 'locations', 'gallery', 'site_content'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.error(`- Table "${table}" error:`, error.message);
      } else {
        console.log(`- Table "${table}" is accessible. Records count:`, data?.length);
      }
    } catch (err: any) {
      console.error(`- Table "${table}" exception:`, err.message);
    }
  }
}

checkTables();
