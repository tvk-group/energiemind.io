import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/panel/StatCard";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: users },
    { count: pendingRequests },
    { count: sites },
    { count: miners },
    { count: activeAlerts },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("access_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("sites").select("*", { count: "exact", head: true }),
    supabase.from("miners").select("*", { count: "exact", head: true }),
    supabase.from("alerts").select("*", { count: "exact", head: true }).eq("is_resolved", false),
  ]);

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Admin Console</h1>
        <p>Platform management and infrastructure administration</p>
      </header>

      <div className="panel-stats-grid">
        <StatCard label="Total Users" value={String(users ?? 0)} icon="👥" />
        <StatCard label="Pending Requests" value={String(pendingRequests ?? 0)} icon="📋" />
        <StatCard label="Sites" value={String(sites ?? 0)} icon="🏢" />
        <StatCard label="Miners" value={String(miners ?? 0)} icon="⛏️" />
        <StatCard label="Active Alerts" value={String(activeAlerts ?? 0)} icon="🔔" />
      </div>

      <div className="panel-grid-2">
        <div className="panel-card">
          <h3>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href="/admin/access-requests/" className="btn btn-secondary">Review Access Requests</Link>
            <Link href="/admin/users/" className="btn btn-secondary">Manage Users</Link>
            <Link href="/admin/sites/" className="btn btn-secondary">Manage Sites</Link>
            <Link href="/admin/miners/" className="btn btn-secondary">Manage Miners</Link>
          </div>
        </div>
        <div className="panel-card">
          <h3>Supabase Integration</h3>
          <p className="panel-text-muted">
            Database, authentication, and API are powered by Supabase. Run the migration SQL in your Supabase project to initialize tables and seed demo data.
          </p>
          <dl className="panel-dl">
            <dt>Auth</dt>
            <dd>Supabase Auth (email/password)</dd>
            <dt>Database</dt>
            <dd>PostgreSQL with RLS</dd>
            <dt>API</dt>
            <dd>/api/v1/* REST endpoints</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
