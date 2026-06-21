import { supabase } from '../supabase';

let _knownColumns: Set<string> | null = null;

async function getKnownColumns(): Promise<Set<string>> {
  if (_knownColumns) return _knownColumns;

  // We can force PostgREST to return an error by querying a non-existent column,
  // but to check valid columns without an empty table issue, we can try to select them
  // one by one or all together with a limit 0.
  // Actually, selecting limit 0 returns an empty array but the headers might not help.
  // A better way is to probe the new columns.
  const probeColumns = [
    'is_published', 'sort_order', 'reservation_link', 'working_hours',
    'opening_hours', 'reservation_phone', 'corporate_email', 
    'directions_url', 'reservation_url', 'about_title', 'about_content', 
    'updated_at'
  ];
  const validColumns = new Set([
    'id', 'name', 'slug', 'address', 'description', 
    'phone_number', 'cover_image', 'created_at', 'updated_at'
  ]);

  for (const col of probeColumns) {
    const { error } = await supabase.from('locations').select(col).limit(1);
    // If the error is about the column not existing, PostgREST returns a specific error code "42703" or message
    if (!error || !error.message.includes("Could not find the")) {
      validColumns.add(col);
    }
  }

  _knownColumns = validColumns;
  return validColumns;
}

export async function cleanLocationPayload(payload: Record<string, any>) {
  const columns = await getKnownColumns();
  const clean: Record<string, any> = {};

  // Preserve related entity payloads
  if ('tags' in payload) clean.tags = payload.tags;
  if ('gallery' in payload) clean.gallery = payload.gallery;

  for (const [key, value] of Object.entries(payload)) {
    // 1. Remove undefined
    if (value === undefined) continue;

    // 2. Only include known columns
    if (columns.has(key)) {
      clean[key] = value;
    }
  }

  return clean;
}
