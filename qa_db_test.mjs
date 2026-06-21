import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function runDatabaseAudit() {
  console.log("=== Phase 5: Database Audit ===");
  const tables = ['site_content', 'featured_items', 'categories', 'locations', 'testimonials'];
  
  for (const table of tables) {
    console.log(`\nTesting table: ${table}`);
    
    // Test SELECT
    console.log(`Testing SELECT on ${table}...`);
    const { data: selectData, error: selectError } = await supabase
      .from(table)
      .select('*')
      .limit(1);
      
    if (selectError) {
      console.error(`[FAIL] SELECT error: ${selectError.message}`);
    } else {
      console.log(`[PASS] SELECT succeeded. Returned ${selectData.length} rows.`);
    }

    // Test INSERT (should fail if RLS works and we are anonymous)
    console.log(`Testing INSERT (RLS check) on ${table}...`);
    const { error: insertError } = await supabase
      .from(table)
      .insert([{ id: 'test-id' }]); // Dummy data
      
    if (insertError) {
      if (insertError.code === '42501') {
        console.log(`[PASS] INSERT rejected by RLS (Expected). Error: ${insertError.message}`);
      } else {
        console.warn(`[WARN] INSERT failed, but not strictly RLS 42501. Error: ${insertError.message} (Code: ${insertError.code})`);
      }
    } else {
      console.error(`[CRITICAL FAIL] INSERT succeeded! RLS is not properly enforcing public writes.`);
    }
  }
}

runDatabaseAudit().catch(console.error);
