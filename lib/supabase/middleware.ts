import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function updateSession(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  // Refresh session — required for Server Components and route handlers.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (path.startsWith("/panel") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/en/login/";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/en/login/";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin" || !profile.is_active) {
      const url = request.nextUrl.clone();
      url.pathname = "/panel/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
