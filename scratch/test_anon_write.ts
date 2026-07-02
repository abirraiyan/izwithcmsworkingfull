import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function testWrite() {
  console.log("Testing write to categories table on new Supabase...");
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: 'Test Category', slug: 'test-category' }])
      .select();
    
    if (error) {
      console.error("Write failed:", error.message, error);
    } else {
      console.log("Write succeeded! Row inserted:", data);
      // Clean up if succeeded
      if (data && data.length > 0) {
        await supabase.from('categories').delete().eq('id', data[0].id);
        console.log("Cleanup succeeded.");
      }
    }
  } catch (err: any) {
    console.error("Exception caught:", err.message);
  }
}

testWrite();
