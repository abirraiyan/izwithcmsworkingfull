import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testSignup() {
  const email = `qa.test.${Date.now()}@gmail.com`;
  const password = 'QaPassword123!';
  
  console.log(`Attempting to sign up ${email}...`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    console.error('Sign up error:', error.message);
  } else {
    console.log('Sign up successful:', data.user ? 'User created' : 'No user data');
    console.log('Session present?', !!data.session);
    
    // Now try to log in
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (loginError) {
      console.error('Login error:', loginError.message);
    } else {
      console.log('Login successful! We can use this account for QA.');
    }
  }
}

testSignup();
