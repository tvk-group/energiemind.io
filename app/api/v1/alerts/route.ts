import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const resolved = searchParams.get("resolved");

  let query = supabase
    .from("alerts")
    .select("*, sites(name, slug)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (resolved === "false") query = query.eq("is_resolved", false);
  if (resolved === "true") query = query.eq("is_resolved", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ alerts: data });
}
