import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/panel/StatCard";
import SimpleBarChart from "@/components/panel/SimpleBarChart";
import DataTable from "@/components/panel/DataTable";
import type { EnergyMetric } from "@/lib/supabase/types";

export const metadata = { title: "Energy Analytics | EnergieMIND Panel" };

export default async function PanelEnergyPage() {
  const supabase = await createClient();

  const [{ data: metrics }, { data: sites }] = await Promise.all([
    supabase.from("energy_metrics").select("*, sites(name)").order("recorded_at", { ascending: false }).limit(48),
    supabase.from("sites").select("*"),
  ]);

  const latest = metrics?.[0];
  const avgEfficiency = metrics?.length
    ? metrics.reduce((s, m) => s + Number(m.efficiency_percent), 0) / metrics.length
    : 0;

  const powerChart = (metrics || []).slice(0, 24).reverse().map((m) => ({
    label: new Date(m.recorded_at).getHours() + "h",
    value: Number(m.power_kw),
  }));

  const efficiencyChart = (metrics || []).slice(0, 24).reverse().map((m) => ({
    label: new Date(m.recorded_at).getHours() + "h",
    value: Number(m.efficiency_percent),
  }));

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Energy Analytics</h1>
        <p>Consumption, efficiency, and cost intelligence</p>
      </header>

      <div className="panel-stats-grid panel-stats-grid-4">
        <StatCard label="Current Power" value={`${latest?.power_kw ?? 0} kW`} icon="⚡" />
        <StatCard label="Generation" value={`${latest?.generation_kw ?? 0} kW`} icon="☀️" />
        <StatCard label="Avg Efficiency" value={`${avgEfficiency.toFixed(1)}%`} icon="📈" />
        <StatCard label="Cost/kWh" value={`$${latest?.cost_per_kwh ?? 0}`} icon="💰" />
      </div>

      <div className="panel-grid-2">
        <SimpleBarChart data={powerChart} label="Power Consumption" unit=" kW" color="#3b82f6" />
        <SimpleBarChart data={efficiencyChart} label="Efficiency %" unit="%" color="#00d4aa" />
      </div>

      <div className="panel-card">
        <h3>Site Overview</h3>
        <div className="panel-stats-grid panel-stats-grid-3">
          {sites?.map((site) => (
            <div key={site.id} className="panel-site-card">
              <h4>{site.name}</h4>
              <p>{site.location}</p>
              <span className="panel-site-capacity">{site.capacity_mw} MW capacity</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-card">
        <h3>Recent Metrics</h3>
        <DataTable<EnergyMetric>
          data={(metrics || []).slice(0, 20) as EnergyMetric[]}
          columns={[
            { key: "sites", label: "Site", render: (r) => (r as EnergyMetric & { sites: { name: string } }).sites?.name ?? "—" },
            { key: "recorded_at", label: "Time", render: (r) => new Date(r.recorded_at).toLocaleString() },
            { key: "power_kw", label: "Power (kW)" },
            { key: "generation_kw", label: "Generation (kW)" },
            { key: "efficiency_percent", label: "Efficiency %" },
            { key: "cost_per_kwh", label: "Cost/kWh", render: (r) => `$${r.cost_per_kwh}` },
            { key: "carbon_intensity_g", label: "Carbon (g/kWh)" },
          ]}
        />
      </div>
    </div>
  );
}
