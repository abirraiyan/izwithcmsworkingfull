import fetch from 'node-fetch'; // or use built-in fetch in newer Node versions
import dotenv from 'dotenv';
dotenv.config();

async function fetchSchema() {
  const url = process.env.VITE_SUPABASE_URL! + '/rest/v1/';
  const key = process.env.VITE_SUPABASE_ANON_KEY!;
  
  console.log("Fetching OpenAPI schema from Supabase:", url);
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    
    const spec: any = await res.json();
    console.log("Tables found:", Object.keys(spec.definitions || {}));
    
    const siteContentDef = spec.definitions?.site_content;
    if (siteContentDef) {
      console.log("\n--- site_content Definition ---");
      console.log(JSON.stringify(siteContentDef, null, 2));
    } else {
      console.log("site_content definition not found.");
    }
  } catch (err: any) {
    console.error("Error fetching schema:", err.message);
  }
}

fetchSchema();
