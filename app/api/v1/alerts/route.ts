import { withSupabase } from "@/lib/supabase/with-supabase";

export const GET = withSupabase({ auth: "user" }, async (req, ctx) => {
  const { searchParams } = new URL(req.url);
  const resolved = searchParams.get("resolved");

  let query = ctx.supabase
    .from("alerts")
    .select("*, sites(name, slug)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (resolved === "false") query = query.eq("is_resolved", false);
  if (resolved === "true") query = query.eq("is_resolved", true);

  const { data, error } = await query;
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ alerts: data });
});
