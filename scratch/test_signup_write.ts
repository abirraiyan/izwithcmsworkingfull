import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function testSignupAndWrite() {
  const email = `admin_migrate_${Math.floor(Math.random() * 100000)}@izpatisserie.com`;
  const password = "TemporaryPassword123!";
  
  console.log(`Trying to sign up user: ${email}...`);
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError) {
      console.error("Signup failed:", signUpError.message);
      return;
    }
    
    console.log("Signup succeeded! User ID:", signUpData.user?.id);
    
    // Attempt write
    console.log("Testing write to categories with authenticated session...");
    const { data: writeData, error: writeError } = await supabase
      .from('categories')
      .insert([{ name: 'Test Authenticated Category', slug: 'test-auth-category' }])
      .select();
      
    if (writeError) {
      console.error("Authenticated write failed:", writeError.message);
    } else {
      console.log("Authenticated write succeeded! Inserted:", writeData);
      // Clean up
      if (writeData && writeData.length > 0) {
        await supabase.from('categories').delete().eq('id', writeData[0].id);
        console.log("Cleanup succeeded.");
      }
    }
  } catch (err: any) {
    console.error("Exception caught:", err.message);
  }
}

testSignupAndWrite();
