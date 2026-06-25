import { withSupabase } from "@/lib/supabase/with-supabase";

export const PATCH = withSupabase({ auth: "user" }, async (req, ctx) => {
  const userId = ctx.userClaims?.id;
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await ctx.supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status, notes } = await req.json();

  const { error } = await ctx.supabase
    .from("access_requests")
    .update({
      status,
      notes: notes ?? null,
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
});
