import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";

export async function PATCH(request: Request) {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { id, status, notes } = await request.json();

  const { error } = await supabase
    .from("access_requests")
    .update({
      status,
      notes: notes ?? null,
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
