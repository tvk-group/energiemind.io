import { withSupabase } from "@/lib/supabase/with-supabase";

export const GET = withSupabase({ auth: "user" }, async (_req, ctx) => {
  const { data, error } = await ctx.supabase
    .from("sites")
    .select("*, miners(count)")
    .order("name");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ sites: data });
});
