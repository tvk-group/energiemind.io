import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/panel/DataTable";
import type { Miner } from "@/lib/supabase/types";

export const metadata = { title: "Miners | Admin" };

export default async function AdminMinersPage() {
  const supabase = await createClient();
  const { data: miners } = await supabase
    .from("miners")
    .select("*, sites(name)")
    .order("name");

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Miner Fleet</h1>
        <p>Manage ASIC miners across all sites</p>
      </header>

      <div className="panel-card">
        <DataTable<Miner>
          data={(miners || []) as Miner[]}
          columns={[
            { key: "name", label: "Name" },
            { key: "sites", label: "Site", render: (r) => (r.sites as { name: string })?.name ?? "—" },
            { key: "model", label: "Model" },
            { key: "serial_number", label: "Serial" },
            { key: "status", label: "Status", render: (r) => (
              <span className={`status-badge status-${r.status}`}>{r.status}</span>
            )},
            { key: "hash_rate_th", label: "Hash Rate", render: (r) => `${r.hash_rate_th} TH/s` },
            { key: "firmware_version", label: "Firmware" },
          ]}
        />
      </div>
    </div>
  );
}
