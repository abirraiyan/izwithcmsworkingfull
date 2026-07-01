import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

interface MigrationReportEntry {
  table: string;
  column: string;
  recordId: string;
  oldUrl: string;
  newUrl: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  error?: string;
}

const reportList: MigrationReportEntry[] = [];

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'djnv9soqm';
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'iz-cafe';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function generateSignature(params: Record<string, any>, apiSecret: string): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto
    .createHash('sha1')
    .update(paramString + apiSecret)
    .digest('hex');
}

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: Supabase URL or Key missing. Check .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function isSupabaseUrl(url: any): boolean {
  return typeof url === 'string' && url.includes('/storage/v1/object/public/');
}

function isCloudinaryUrl(url: any): boolean {
  return typeof url === 'string' && url.includes('res.cloudinary.com');
}

/**
 * Downloads a file from Supabase and uploads it to Cloudinary.
 */
async function migrateFile(oldUrl: string, contextInfo: string): Promise<string> {
  // Check if already migrated
  if (isCloudinaryUrl(oldUrl)) {
    return oldUrl;
  }

  console.log(`[MIGRATE] Downloading: ${oldUrl} (${contextInfo})`);

  try {
    // 1. Download
    const res = await fetch(oldUrl);
    if (!res.ok) {
      throw new Error(`Failed to download file. Status: ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const buffer = await res.arrayBuffer();

    // Determine filename
    const urlParts = oldUrl.split('/');
    const filename = urlParts[urlParts.length - 1] || 'media_file';

    // 2. Determine resource type
    const resourceType = contentType.startsWith('video/') ? 'video' : 'image';

    // 3. Upload to Cloudinary
    const blob = new Blob([buffer], { type: contentType });
    const formData = new FormData();
    formData.append('file', blob, filename);

    if (API_KEY && API_SECRET) {
      console.log(`[MIGRATE] Using SIGNED upload to Cloudinary (${resourceType})...`);
      const timestamp = Math.round(Date.now() / 1000).toString();
      
      const paramsToSign: Record<string, string> = {
        timestamp,
        upload_preset: UPLOAD_PRESET,
      };
      
      const signature = generateSignature(paramsToSign, API_SECRET);
      
      formData.append('api_key', API_KEY);
      formData.append('timestamp', timestamp);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('signature', signature);
    } else {
      console.log(`[MIGRATE] Using UNSIGNED upload to Cloudinary (${resourceType})...`);
      formData.append('upload_preset', UPLOAD_PRESET);
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

    const uploadRes = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const uploadData = await uploadRes.json();
    const newUrl = uploadData.secure_url || uploadData.url;

    console.log(`[SUCCESS] Migrated to: ${newUrl}`);
    return newUrl;
  } catch (err: any) {
    console.error(`[ERROR] Failed to migrate ${oldUrl}:`, err.message);
    throw err;
  }
}

/**
 * Recursively scans and migrates nested URLs inside JSON objects.
 */
async function processJsonObject(
  obj: any,
  contextInfo: string,
  table: string,
  recordId: string
): Promise<any> {
  if (!obj) return obj;

  if (typeof obj === 'string') {
    if (isSupabaseUrl(obj)) {
      try {
        const newUrl = await migrateFile(obj, contextInfo);
        reportList.push({
          table,
          column: 'value',
          recordId,
          oldUrl: obj,
          newUrl,
          status: 'SUCCESS',
        });
        return newUrl;
      } catch (err: any) {
        reportList.push({
          table,
          column: 'value',
          recordId,
          oldUrl: obj,
          newUrl: '',
          status: 'FAILED',
          error: err.message,
        });
        return obj; // Return original url on failure to avoid breaking content
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const nextArr = [];
    for (let i = 0; i < obj.length; i++) {
      nextArr.push(await processJsonObject(obj[i], `${contextInfo}[${i}]`, table, recordId));
    }
    return nextArr;
  }

  if (typeof obj === 'object') {
    // If it's a MediaAsset object: { url, type, mimeType, ... }
    if (obj.url && typeof obj.url === 'string' && isSupabaseUrl(obj.url)) {
      try {
        const newUrl = await migrateFile(obj.url, `${contextInfo}.url`);
        reportList.push({
          table,
          column: 'value',
          recordId,
          oldUrl: obj.url,
          newUrl,
          status: 'SUCCESS',
        });
        return {
          ...obj,
          url: newUrl,
        };
      } catch (err: any) {
        reportList.push({
          table,
          column: 'value',
          recordId,
          oldUrl: obj.url,
          newUrl: '',
          status: 'FAILED',
          error: err.message,
        });
        return obj;
      }
    }

    const nextObj: any = {};
    for (const key of Object.keys(obj)) {
      nextObj[key] = await processJsonObject(obj[key], `${contextInfo}.${key}`, table, recordId);
    }
    return nextObj;
  }

  return obj;
}

async function runMigration() {
  console.log('=== Starting Supabase to Cloudinary Media Migration ===');

  // Handle Authentication if service role is not used
  const args = process.argv.slice(2);
  const cliEmail = args[0] || process.env.SUPABASE_ADMIN_EMAIL;
  const cliPassword = args[1] || process.env.SUPABASE_ADMIN_PASSWORD;

  const isServiceRole = supabaseKey !== process.env.VITE_SUPABASE_ANON_KEY;
  if (!isServiceRole) {
    if (cliEmail && cliPassword) {
      console.log(`Authenticating with Supabase as ${cliEmail}...`);
      const { error } = await supabase.auth.signInWithPassword({
        email: cliEmail,
        password: cliPassword,
      });
      if (error) {
        console.error('Authentication failed:', error.message);
        process.exit(1);
      }
      console.log('Authenticated successfully.');
    } else {
      console.warn(
        'WARNING: Running in anonymous mode. Write operations might fail due to database RLS policies. Set SUPABASE_SERVICE_ROLE_KEY or pass admin credentials as arguments.'
      );
    }
  } else {
    console.log('Using Service Role Key (RLS bypass enabled).');
  }

  // 1. Menu Items Table
  console.log('\n--- Migrating menu_items Table ---');
  try {
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('id, name, image_url');

    if (error) throw error;

    console.log(`Found ${menuItems?.length || 0} menu items.`);
    for (const item of menuItems || []) {
      if (isSupabaseUrl(item.image_url)) {
        try {
          const newUrl = await migrateFile(item.image_url, `menu_items:${item.name}`);
          const { error: updateError } = await supabase
            .from('menu_items')
            .update({ image_url: newUrl })
            .eq('id', item.id);

          if (updateError) throw updateError;

          reportList.push({
            table: 'menu_items',
            column: 'image_url',
            recordId: item.id,
            oldUrl: item.image_url,
            newUrl,
            status: 'SUCCESS',
          });
        } catch (err: any) {
          reportList.push({
            table: 'menu_items',
            column: 'image_url',
            recordId: item.id,
            oldUrl: item.image_url,
            newUrl: '',
            status: 'FAILED',
            error: err.message,
          });
        }
      } else if (item.image_url) {
        reportList.push({
          table: 'menu_items',
          column: 'image_url',
          recordId: item.id,
          oldUrl: item.image_url,
          newUrl: item.image_url,
          status: 'SKIPPED',
        });
      }
    }
  } catch (err: any) {
    console.error('Failed to migrate menu_items table:', err.message);
  }

  // 2. Gallery Table
  console.log('\n--- Migrating gallery Table ---');
  try {
    const { data: galleryItems, error } = await supabase
      .from('gallery')
      .select('id, title, media_url');

    if (error) throw error;

    console.log(`Found ${galleryItems?.length || 0} gallery items.`);
    for (const item of galleryItems || []) {
      if (isSupabaseUrl(item.media_url)) {
        try {
          const newUrl = await migrateFile(item.media_url, `gallery:${item.title || item.id}`);
          const { error: updateError } = await supabase
            .from('gallery')
            .update({ media_url: newUrl })
            .eq('id', item.id);

          if (updateError) throw updateError;

          reportList.push({
            table: 'gallery',
            column: 'media_url',
            recordId: item.id,
            oldUrl: item.media_url,
            newUrl,
            status: 'SUCCESS',
          });
        } catch (err: any) {
          reportList.push({
            table: 'gallery',
            column: 'media_url',
            recordId: item.id,
            oldUrl: item.media_url,
            newUrl: '',
            status: 'FAILED',
            error: err.message,
          });
        }
      } else if (item.media_url) {
        reportList.push({
          table: 'gallery',
          column: 'media_url',
          recordId: item.id,
          oldUrl: item.media_url,
          newUrl: item.media_url,
          status: 'SKIPPED',
        });
      }
    }
  } catch (err: any) {
    console.error('Failed to migrate gallery table:', err.message);
  }

  // 3. Locations Table (cover_image)
  console.log('\n--- Migrating locations Table ---');
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select('id, name, cover_image');

    if (error) throw error;

    console.log(`Found ${locations?.length || 0} locations.`);
    for (const loc of locations || []) {
      if (isSupabaseUrl(loc.cover_image)) {
        try {
          const newUrl = await migrateFile(loc.cover_image, `locations:${loc.name}`);
          const { error: updateError } = await supabase
            .from('locations')
            .update({ cover_image: newUrl })
            .eq('id', loc.id);

          if (updateError) throw updateError;

          reportList.push({
            table: 'locations',
            column: 'cover_image',
            recordId: loc.id,
            oldUrl: loc.cover_image,
            newUrl,
            status: 'SUCCESS',
          });
        } catch (err: any) {
          reportList.push({
            table: 'locations',
            column: 'cover_image',
            recordId: loc.id,
            oldUrl: loc.cover_image,
            newUrl: '',
            status: 'FAILED',
            error: err.message,
          });
        }
      } else if (loc.cover_image) {
        reportList.push({
          table: 'locations',
          column: 'cover_image',
          recordId: loc.id,
          oldUrl: loc.cover_image,
          newUrl: loc.cover_image,
          status: 'SKIPPED',
        });
      }
    }
  } catch (err: any) {
    console.error('Failed to migrate locations table:', err.message);
  }

  // 4. Location Gallery Table
  console.log('\n--- Migrating location_gallery Table ---');
  try {
    const { data: galleryImages, error } = await supabase
      .from('location_gallery')
      .select('id, image_url, location_id');

    if (error) throw error;

    console.log(`Found ${galleryImages?.length || 0} location gallery images.`);
    for (const img of galleryImages || []) {
      if (isSupabaseUrl(img.image_url)) {
        try {
          const newUrl = await migrateFile(img.image_url, `location_gallery:${img.id}`);
          const { error: updateError } = await supabase
            .from('location_gallery')
            .update({ image_url: newUrl })
            .eq('id', img.id);

          if (updateError) throw updateError;

          reportList.push({
            table: 'location_gallery',
            column: 'image_url',
            recordId: img.id,
            oldUrl: img.image_url,
            newUrl,
            status: 'SUCCESS',
          });
        } catch (err: any) {
          reportList.push({
            table: 'location_gallery',
            column: 'image_url',
            recordId: img.id,
            oldUrl: img.image_url,
            newUrl: '',
            status: 'FAILED',
            error: err.message,
          });
        }
      } else if (img.image_url) {
        reportList.push({
          table: 'location_gallery',
          column: 'image_url',
          recordId: img.id,
          oldUrl: img.image_url,
          newUrl: img.image_url,
          status: 'SKIPPED',
        });
      }
    }
  } catch (err: any) {
    console.error('Failed to migrate location_gallery table:', err.message);
  }

  // 5. Site Content Table
  console.log('\n--- Migrating site_content Table ---');
  try {
    const { data: contentRows, error } = await supabase.from('site_content').select('key, value');

    if (error) throw error;

    const keysToMigrate = ['home_hero', 'get_to_know_us', 'our_story'];
    console.log(`Found ${contentRows?.length || 0} content rows.`);

    for (const row of contentRows || []) {
      if (!keysToMigrate.includes(row.key)) {
        console.log(`Skipping site_content row with key: ${row.key}`);
        continue;
      }

      console.log(`Processing site_content JSON structure for key: ${row.key}`);
      const updatedValue = await processJsonObject(row.value, row.key, 'site_content', row.key);

      const { error: updateError } = await supabase
        .from('site_content')
        .update({ value: updatedValue })
        .eq('key', row.key);

      if (updateError) {
        console.error(`Failed to update site_content key "${row.key}":`, updateError.message);
      } else {
        console.log(`Successfully updated site_content key "${row.key}".`);
      }
    }
  } catch (err: any) {
    console.error('Failed to migrate site_content table:', err.message);
  }

  // 6. Generate migration-report.json
  console.log('\n--- Writing Migration Report ---');
  try {
    const reportPath = path.resolve('migration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportList, null, 2), 'utf8');
    console.log(`Migration report successfully saved to: ${reportPath}`);
  } catch (err: any) {
    console.error('Failed to save migration-report.json:', err.message);
  }

  console.log('\n=== Migration Finished ===');
}

runMigration().catch((err) => {
  console.error('Unhandled fatal migration error:', err);
});
