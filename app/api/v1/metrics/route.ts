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
  const siteId = searchParams.get("site_id");
  const hours = parseInt(searchParams.get("hours") || "24", 10);

  let query = supabase
    .from("energy_metrics")
    .select("*, sites(name, slug)")
    .order("recorded_at", { ascending: false })
    .limit(hours * 3);

  if (siteId) query = query.eq("site_id", siteId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ metrics: data });
}
