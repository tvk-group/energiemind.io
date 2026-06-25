import type { SupabaseEnv } from "@supabase/server";

/**
 * Bridges Next.js public env vars and @supabase/server standard names.
 * Server routes should prefer SUPABASE_*; NEXT_PUBLIC_* remains for browser clients.
 */
export function resolveSupabaseEnv(): Partial<SupabaseEnv> {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const secretKey = process.env.SUPABASE_SECRET_KEY;

  let jwks: SupabaseEnv["jwks"] = null;

  if (process.env.SUPABASE_JWKS) {
    try {
      const parsed = JSON.parse(process.env.SUPABASE_JWKS);
      jwks = Array.isArray(parsed) ? { keys: parsed } : parsed;
    } catch {
      jwks = null;
    }
  } else if (process.env.SUPABASE_JWKS_URL) {
    jwks = new URL(process.env.SUPABASE_JWKS_URL);
  } else if (url) {
    jwks = new URL(`${url}/auth/v1/.well-known/jwks.json`);
  }

  return {
    url: url ?? undefined,
    publishableKeys: publishableKey ? { default: publishableKey } : {},
    secretKeys: secretKey ? { default: secretKey } : {},
    jwks,
  };
}

/** @deprecated Use resolveSupabaseEnv — kept for browser client helpers */
export function getSupabaseUrl() {
  return resolveSupabaseEnv().url!;
}

/** @deprecated Use resolveSupabaseEnv — kept for browser client helpers */
export function getSupabaseKey() {
  const env = resolveSupabaseEnv();
  return env.publishableKeys?.default ?? "";
}
