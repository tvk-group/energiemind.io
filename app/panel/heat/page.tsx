import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/panel/StatCard";
import SimpleBarChart from "@/components/panel/SimpleBarChart";
import DataTable from "@/components/panel/DataTable";
import type { HeatMetric } from "@/lib/supabase/types";

export const metadata = { title: "Heat Recovery | EnergieMIND Panel" };

export default async function PanelHeatPage() {
  const supabase = await createClient();
  const { data: metrics } = await supabase
    .from("heat_metrics")
    .select("*, sites(name)")
    .order("recorded_at", { ascending: false })
    .limit(48);

  const latest = metrics?.[0];
  const avgThermal = metrics?.length
    ? metrics.reduce((s, m) => s + Number(m.thermal_efficiency_percent), 0) / metrics.length
    : 0;

  const thermalChart = (metrics || []).slice(0, 24).reverse().map((m) => ({
    label: new Date(m.recorded_at).getHours() + "h",
    value: Number(m.thermal_efficiency_percent),
  }));

  const recoveryChart = (metrics || []).slice(0, 24).reverse().map((m) => ({
    label: new Date(m.recorded_at).getHours() + "h",
    value: Number(m.heat_recovered_kw),
  }));

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Heat Recovery Metrics</h1>
        <p>Thermal efficiency and waste heat utilization</p>
      </header>

      <div className="panel-stats-grid panel-stats-grid-4">
        <StatCard label="Thermal Efficiency" value={`${latest?.thermal_efficiency_percent ?? 0}%`} icon="♨️" />
        <StatCard label="Heat Recovered" value={`${latest?.heat_recovered_kw ?? 0} kW`} icon="🔥" />
        <StatCard label="Waste Heat Used" value={`${latest?.waste_heat_utilization_percent ?? 0}%`} icon="♻️" />
        <StatCard label="COP Ratio" value={String(latest?.cop_ratio ?? 0)} icon="📊" />
      </div>

      <div className="panel-grid-2">
        <SimpleBarChart data={thermalChart} label="Thermal Efficiency %" unit="%" color="#f59e0b" />
        <SimpleBarChart data={recoveryChart} label="Heat Recovered" unit=" kW" color="#ef4444" />
      </div>

      <div className="panel-card">
        <h3>Heat Recovery History</h3>
        <DataTable<HeatMetric>
          data={(metrics || []).slice(0, 20) as HeatMetric[]}
          columns={[
            { key: "sites", label: "Site", render: (r) => (r as HeatMetric & { sites: { name: string } }).sites?.name ?? "—" },
            { key: "recorded_at", label: "Time", render: (r) => new Date(r.recorded_at).toLocaleString() },
            { key: "thermal_efficiency_percent", label: "Thermal %" },
            { key: "heat_recovered_kw", label: "Recovered (kW)" },
            { key: "waste_heat_utilization_percent", label: "Utilization %" },
            { key: "cop_ratio", label: "COP" },
            { key: "fuel_savings_percent", label: "Fuel Savings %" },
          ]}
        />
      </div>
    </div>
  );
}
