import { withSupabase } from "@/lib/supabase/with-supabase";

export const GET = withSupabase({ auth: "user" }, async (req, ctx) => {
  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("site_id");
  const hours = parseInt(searchParams.get("hours") || "24", 10);

  let query = ctx.supabase
    .from("energy_metrics")
    .select("*, sites(name, slug)")
    .order("recorded_at", { ascending: false })
    .limit(hours * 3);

  if (siteId) query = query.eq("site_id", siteId);

  const { data, error } = await query;
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ metrics: data });
});
