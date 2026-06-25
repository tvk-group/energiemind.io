import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/panel/DataTable";
import type { Site } from "@/lib/supabase/types";

export const metadata = { title: "Sites | Admin" };

export default async function AdminSitesPage() {
  const supabase = await createClient();
  const { data: sites } = await supabase
    .from("sites")
    .select("*, miners(count)")
    .order("name");

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Infrastructure Sites</h1>
        <p>Manage monitoring sites and facilities</p>
      </header>

      <div className="panel-card">
        <DataTable<Site>
          data={(sites || []) as Site[]}
          columns={[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            { key: "location", label: "Location" },
            { key: "country", label: "Country" },
            { key: "capacity_mw", label: "Capacity", render: (r) => `${r.capacity_mw} MW` },
            { key: "is_active", label: "Status", render: (r) => (
              <span className={`status-badge ${r.is_active ? "status-online" : "status-offline"}`}>
                {r.is_active ? "Active" : "Inactive"}
              </span>
            )},
          ]}
        />
      </div>
    </div>
  );
}
