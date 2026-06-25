"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";

const adminNav = [
  { href: "/admin/", label: "Overview", icon: "📊" },
  { href: "/admin/access-requests/", label: "Access Requests", icon: "📋" },
  { href: "/admin/users/", label: "Users", icon: "👥" },
  { href: "/admin/sites/", label: "Sites", icon: "🏢" },
  { href: "/admin/miners/", label: "Miners", icon: "⛏️" },
  { href: "/admin/api-keys/", label: "API Keys", icon: "🔑" },
];

export default function AdminSidebar({ profile }: { profile: Profile }) {
  const currentPath = usePathname() || "/admin/";

  return (
    <aside className="panel-sidebar">
      <div className="panel-sidebar-brand">
        <Link href="/admin/" className="logo">
          <div className="logo-icon">⚡</div>
          <span>EnergieMIND</span>
        </Link>
        <span className="panel-badge admin-badge">Admin</span>
      </div>

      <nav className="panel-nav">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`panel-nav-link ${
              currentPath === item.href ||
              (item.href !== "/admin/" && currentPath.startsWith(item.href))
                ? "active"
                : ""
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="panel-sidebar-footer">
        <Link href="/panel/" className="btn btn-secondary" style={{ width: "100%", marginBottom: 8 }}>
          ← Back to Panel
        </Link>
        <div className="panel-user">
          <div className="panel-user-avatar">A</div>
          <div>
            <div className="panel-user-name">{profile.full_name}</div>
            <div className="panel-user-role">Administrator</div>
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
