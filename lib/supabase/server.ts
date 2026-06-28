import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/utils/supabase/server";

export async function createClient() {
  return createServerClient(await cookies());
}

export async function createServiceClient() {
  const { createClient: createSupabaseClient } = await import(
    "@supabase/supabase-js"
  );
  const { resolveSupabaseEnv } = await import("./env");
  const env = resolveSupabaseEnv();

  return createSupabaseClient(
    env.url!,
    env.secretKeys?.default ?? process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
