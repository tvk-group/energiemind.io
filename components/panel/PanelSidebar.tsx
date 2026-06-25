"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";

const navItems = [
  { href: "/panel/", label: "Overview", icon: "📊" },
  { href: "/panel/miners/", label: "Miners", icon: "⛏️" },
  { href: "/panel/energy/", label: "Energy", icon: "⚡" },
  { href: "/panel/heat/", label: "Heat Recovery", icon: "🔥" },
  { href: "/panel/alerts/", label: "Alerts", icon: "🔔" },
  { href: "/panel/settings/", label: "Settings", icon: "⚙️" },
];

export default function PanelSidebar({ profile }: { profile: Profile }) {
  const currentPath = usePathname() || "/panel/";
  return (
    <aside className="panel-sidebar">
      <div className="panel-sidebar-brand">
        <Link href="/panel/" className="logo">
          <div className="logo-icon">⚡</div>
          <span>EnergieMIND</span>
        </Link>
        <span className="panel-badge">Panel</span>
      </div>

      <nav className="panel-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`panel-nav-link ${
              currentPath === item.href ||
              (item.href !== "/panel/" && currentPath.startsWith(item.href))
                ? "active"
                : ""
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {profile.role === "admin" && (
        <div className="panel-admin-link">
          <Link href="/admin/" className="btn btn-secondary" style={{ width: "100%" }}>
            Admin Console
          </Link>
        </div>
      )}

      <div className="panel-sidebar-footer">
        <div className="panel-user">
          <div className="panel-user-avatar">
            {(profile.full_name || profile.email)[0].toUpperCase()}
          </div>
          <div>
            <div className="panel-user-name">{profile.full_name || "User"}</div>
            <div className="panel-user-role">{profile.role}</div>
          </div>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }}>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
