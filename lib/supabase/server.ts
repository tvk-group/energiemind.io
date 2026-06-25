import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/utils/supabase/server";

export async function createClient() {
  return createServerClient(await cookies());
}

export async function createServiceClient() {
  const { createClient: createSupabaseClient } = await import(
    "@supabase/supabase-js"
  );
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
