export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL!;
}

/** Supports Supabase publishable key (new) and anon key (legacy). */
export function getSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
