import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) {
    env[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
  }
});

// Since we cannot run raw DDL queries using standard Supabase client anon key, 
// we have to check if we can. Usually anon key cannot do `ALTER TABLE`.
// Let's see if there is a service role key.
console.log("Keys available:", Object.keys(env).filter(k => k.includes('SUPABASE')));
