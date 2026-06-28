import type { SupabaseContext, WithSupabaseConfig } from "@supabase/server";
import { createSupabaseContext } from "./context";
import type { Database } from "./types";

type RouteHandler = (
  req: Request,
  ctx: SupabaseContext<Database>
) => Promise<Response>;

/**
 * Next.js App Router adapter for @supabase/server.
 *
 * The package's built-in `withSupabase` expects Authorization headers (Edge Functions).
 * In Next.js, sessions live in cookies — this wrapper composes @supabase/ssr + @supabase/server/core
 * and exposes the same handler signature: `(req, ctx) => Response`.
 *
 * Auth modes: "user" | "publishable" | "secret" | "none"
 */
export function withSupabase(
  config: Pick<WithSupabaseConfig, "auth">,
  handler: RouteHandler
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    const { data: ctx, error } = await createSupabaseContext(config);

    if (error || !ctx) {
      const status =
        "status" in error && typeof error.status === "number"
          ? error.status
          : 401;
      return Response.json(
        { message: error?.message ?? "Unauthorized" },
        { status }
      );
    }

    return handler(req, ctx);
  };
}
