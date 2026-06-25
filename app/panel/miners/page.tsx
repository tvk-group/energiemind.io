import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/panel/DataTable";
import StatCard from "@/components/panel/StatCard";
import type { Miner } from "@/lib/supabase/types";

export const metadata = { title: "Miner Monitoring | EnergieMIND Panel" };

export default async function PanelMinersPage() {
  const supabase = await createClient();
  const { data: miners } = await supabase
    .from("miners")
    .select("*, sites(name, slug)")
    .order("name");

  const online = miners?.filter((m) => m.status === "online").length ?? 0;
  const degraded = miners?.filter((m) => m.status === "degraded").length ?? 0;
  const offline = miners?.filter((m) => m.status === "offline").length ?? 0;
  const avgTemp = miners?.length
    ? miners.reduce((s, m) => s + Number(m.temperature_c), 0) / miners.length
    : 0;

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Miner Monitoring</h1>
        <p>ASIC fleet intelligence and performance tracking</p>
      </header>

      <div className="panel-stats-grid panel-stats-grid-4">
        <StatCard label="Online" value={String(online)} trend="up" />
        <StatCard label="Degraded" value={String(degraded)} trend="neutral" />
        <StatCard label="Offline" value={String(offline)} trend="down" />
        <StatCard label="Avg Temperature" value={`${avgTemp.toFixed(1)}°C`} />
      </div>

      <div className="panel-card">
        <DataTable<Miner>
          data={(miners || []) as Miner[]}
          columns={[
            { key: "name", label: "Name" },
            { key: "sites", label: "Site", render: (r) => (r.sites as { name: string })?.name ?? "—" },
            { key: "model", label: "Model" },
            { key: "status", label: "Status", render: (r) => (
              <span className={`status-badge status-${r.status}`}>{r.status}</span>
            )},
            { key: "hash_rate_th", label: "Hash Rate", render: (r) => `${r.hash_rate_th} TH/s` },
            { key: "power_watts", label: "Power", render: (r) => `${(Number(r.power_watts) / 1000).toFixed(2)} kW` },
            { key: "temperature_c", label: "Temp", render: (r) => `${r.temperature_c}°C` },
            { key: "efficiency_jth", label: "Efficiency", render: (r) => `${r.efficiency_jth} J/TH` },
            { key: "firmware_version", label: "Firmware" },
            { key: "pool_name", label: "Pool" },
            { key: "uptime_percent", label: "Uptime", render: (r) => `${r.uptime_percent}%` },
            { key: "last_seen_at", label: "Last Seen", render: (r) =>
              r.last_seen_at ? new Date(r.last_seen_at).toLocaleString() : "—"
            },
          ]}
        />
      </div>
    </div>
  );
}
