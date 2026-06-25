import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  verifyCredentials,
  createContextClient,
  createAdminClient,
} from "@supabase/server/core";
import type {
  AuthModeWithKey,
  SupabaseContext,
  WithSupabaseConfig,
} from "@supabase/server";
import { resolveSupabaseEnv } from "./env";
import type { Database } from "./types";

/**
 * Cookie-based Supabase context for Next.js.
 * Composes @supabase/ssr (session cookies) with @supabase/server/core (JWT verify + RLS clients).
 *
 * @see https://github.com/supabase/server/blob/main/docs/ssr-frameworks.md
 */
export async function createSupabaseContext(
  options: Pick<WithSupabaseConfig, "auth"> = { auth: "user" }
): Promise<
  | { data: SupabaseContext<Database>; error: null }
  | { data: null; error: Error }
> {
  const nextEnv = resolveSupabaseEnv();

  if (!nextEnv.url || !nextEnv.publishableKeys?.default) {
    return {
      data: null,
      error: new Error(
        "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY environment variables"
      ),
    };
  }

  const cookieStore = await cookies();
  const ssrClient = createServerClient(
    nextEnv.url,
    nextEnv.publishableKeys.default,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components cannot write cookies — middleware handles refresh.
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await ssrClient.auth.getSession();
  const token = session?.access_token ?? null;

  const { data: auth, error } = await verifyCredentials(
    { token, apikey: null },
    { auth: options.auth ?? "user", env: nextEnv }
  );

  if (error) {
    return { data: null, error };
  }

  const supabase = createContextClient<Database>({
    auth: { token: auth!.token },
    env: nextEnv,
  });
  const supabaseAdmin = createAdminClient<Database>({ env: nextEnv });

  return {
    data: {
      supabase,
      supabaseAdmin,
      userClaims: auth!.userClaims,
      jwtClaims: auth!.jwtClaims,
      authMode: auth!.authMode,
    },
    error: null,
  };
}

export type { SupabaseContext, AuthModeWithKey };
