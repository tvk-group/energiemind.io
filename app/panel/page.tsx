import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/panel/StatCard";
import DataTable from "@/components/panel/DataTable";
import SimpleBarChart from "@/components/panel/SimpleBarChart";
import Link from "next/link";
import type { Miner, Alert } from "@/lib/supabase/types";

export default async function PanelOverviewPage() {
  const supabase = await createClient();

  const [
    { data: sites },
    { data: miners },
    { data: alerts },
    { data: energyMetrics },
    { data: heatMetrics },
  ] = await Promise.all([
    supabase.from("sites").select("*").eq("is_active", true),
    supabase.from("miners").select("*, sites(name)"),
    supabase.from("alerts").select("*").eq("is_resolved", false).order("created_at", { ascending: false }).limit(5),
    supabase.from("energy_metrics").select("*").order("recorded_at", { ascending: false }).limit(24),
    supabase.from("heat_metrics").select("*").order("recorded_at", { ascending: false }).limit(1),
  ]);

  const onlineMiners = miners?.filter((m) => m.status === "online").length ?? 0;
  const totalHash = miners?.reduce((s, m) => s + (m.status === "online" ? Number(m.hash_rate_th) : 0), 0) ?? 0;
  const totalPower = miners?.reduce((s, m) => s + (m.status === "online" ? Number(m.power_watts) : 0), 0) ?? 0;
  const latestEnergy = energyMetrics?.[0];
  const latestHeat = heatMetrics?.[0];

  const chartData = (energyMetrics || [])
    .slice(0, 12)
    .reverse()
    .map((m, i) => ({
      label: new Date(m.recorded_at).getHours() + "h",
      value: Number(m.power_kw),
    }));

  return (
    <div className="panel-page">
      <header className="panel-header">
        <div>
          <h1>Operations Dashboard</h1>
          <p>Real-time infrastructure monitoring across {sites?.length ?? 0} sites</p>
        </div>
        <div className="panel-header-actions">
          <span className="panel-live-badge">● Live</span>
        </div>
      </header>

      <div className="panel-stats-grid">
        <StatCard label="Active Sites" value={String(sites?.length ?? 0)} icon="🏢" />
        <StatCard label="Online Miners" value={`${onlineMiners}/${miners?.length ?? 0}`} icon="⛏️" trend="up" change="+2 today" />
        <StatCard label="Total Hash Rate" value={`${totalHash.toFixed(1)} TH/s`} icon="⚡" />
        <StatCard label="Power Draw" value={`${(totalPower / 1000).toFixed(1)} MW`} icon="🔋" />
        <StatCard label="Energy Efficiency" value={`${latestEnergy?.efficiency_percent ?? 0}%`} icon="📈" trend="up" change="+1.2%" />
        <StatCard label="Thermal Efficiency" value={`${latestHeat?.thermal_efficiency_percent ?? 0}%`} icon="🔥" />
        <StatCard label="Active Alerts" value={String(alerts?.length ?? 0)} icon="🔔" trend={alerts?.length ? "down" : "neutral"} />
        <StatCard label="Carbon Intensity" value={`${latestEnergy?.carbon_intensity_g ?? 0} g/kWh`} icon="🌱" />
      </div>

      <div className="panel-grid-2">
        <SimpleBarChart data={chartData} label="Power Consumption (24h)" unit=" kW" />
        <div className="panel-card">
          <h3>Active Alerts</h3>
          {alerts && alerts.length > 0 ? (
            <ul className="panel-alert-list">
              {alerts.map((a: Alert) => (
                <li key={a.id} className={`alert-severity-${a.severity}`}>
                  <strong>{a.title}</strong>
                  <span>{a.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="panel-empty">No active alerts</p>
          )}
          <Link href="/panel/alerts/" className="panel-link">View all alerts →</Link>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card-header">
          <h3>Miner Fleet Status</h3>
          <Link href="/panel/miners/" className="panel-link">View all →</Link>
        </div>
        <DataTable<Miner>
          data={(miners || []).slice(0, 8) as Miner[]}
          columns={[
            { key: "name", label: "Miner" },
            { key: "sites", label: "Site", render: (r) => (r.sites as { name: string })?.name ?? "—" },
            { key: "status", label: "Status", render: (r) => (
              <span className={`status-badge status-${r.status}`}>{r.status}</span>
            )},
            { key: "hash_rate_th", label: "Hash Rate", render: (r) => `${r.hash_rate_th} TH/s` },
            { key: "temperature_c", label: "Temp", render: (r) => `${r.temperature_c}°C` },
            { key: "uptime_percent", label: "Uptime", render: (r) => `${r.uptime_percent}%` },
          ]}
        />
      </div>
    </div>
  );
}
