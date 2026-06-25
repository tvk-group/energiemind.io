import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseKey, getSupabaseUrl } from "@/lib/supabase/env";

export const createClient = () =>
  createBrowserClient(getSupabaseUrl(), getSupabaseKey());
