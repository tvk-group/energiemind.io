import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { getLoginPath, isAppHost } from "@/lib/app-url";

const PANEL_SHORT_ROUTES = [
  "miners",
  "energy",
  "heat",
  "alerts",
  "settings",
] as const;

export async function updateSession(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isApp = isAppHost(host);
  const { supabase, supabaseResponse } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let path = request.nextUrl.pathname;

  if (isApp) {
    if (path === "/" || path === "") {
      const target = user ? "/panel/" : "/app/";
      return NextResponse.rewrite(new URL(target, request.url));
    }

    if (path === "/dashboard" || path === "/dashboard/") {
      return NextResponse.rewrite(new URL("/panel/", request.url));
    }

    if (path === "/login" || path === "/login/") {
      if (user) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.rewrite(new URL("/app/login/", request.url));
    }

    for (const route of PANEL_SHORT_ROUTES) {
      if (path === `/${route}` || path === `/${route}/`) {
        return NextResponse.rewrite(new URL(`/panel/${route}/`, request.url));
      }
    }
  }

  if (path.startsWith("/panel") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = getLoginPath(host);
    url.searchParams.set("redirect", isApp ? "/" : path);
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = getLoginPath(host);
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
      url.pathname = isApp ? "/" : "/panel/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
