import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/panel/DataTable";
import type { Alert } from "@/lib/supabase/types";

export const metadata = { title: "Alerts | EnergieMIND Panel" };

export default async function PanelAlertsPage() {
  const supabase = await createClient();
  const { data: alerts } = await supabase
    .from("alerts")
    .select("*, sites(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  const active = alerts?.filter((a) => !a.is_resolved).length ?? 0;
  const critical = alerts?.filter((a) => a.severity === "critical" && !a.is_resolved).length ?? 0;

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Alerts</h1>
        <p>{active} active alerts · {critical} critical</p>
      </header>

      <div className="panel-card">
        <DataTable<Alert>
          data={(alerts || []) as Alert[]}
          columns={[
            { key: "severity", label: "Severity", render: (r) => (
              <span className={`status-badge severity-${r.severity}`}>{r.severity}</span>
            )},
            { key: "title", label: "Title" },
            { key: "message", label: "Message" },
            { key: "sites", label: "Site", render: (r) => (r.sites as { name: string })?.name ?? "—" },
            { key: "is_resolved", label: "Status", render: (r) => (
              <span className={`status-badge ${r.is_resolved ? "status-online" : "status-degraded"}`}>
                {r.is_resolved ? "Resolved" : "Active"}
              </span>
            )},
            { key: "created_at", label: "Created", render: (r) => new Date(r.created_at).toLocaleString() },
          ]}
        />
      </div>
    </div>
  );
}
