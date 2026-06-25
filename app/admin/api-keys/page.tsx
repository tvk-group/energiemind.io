import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/panel/DataTable";
import type { ApiKey } from "@/lib/supabase/types";

export const metadata = { title: "API Keys | Admin" };

export default async function AdminApiKeysPage() {
  const supabase = await createClient();
  const { data: keys } = await supabase
    .from("api_keys")
    .select("*, profiles(email, full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>API Keys</h1>
        <p>Manage developer API credentials</p>
      </header>

      <div className="panel-card">
        <DataTable<ApiKey>
          data={(keys || []) as ApiKey[]}
          emptyMessage="No API keys created yet"
          columns={[
            { key: "name", label: "Name" },
            { key: "key_prefix", label: "Key Prefix", render: (r) => `${r.key_prefix}...` },
            { key: "profiles", label: "Owner", render: (r) => (r as ApiKey & { profiles: { email: string } }).profiles?.email ?? "—" },
            { key: "scopes", label: "Scopes", render: (r) => r.scopes?.join(", ") ?? "read" },
            { key: "is_active", label: "Status", render: (r) => (
              <span className={`status-badge ${r.is_active ? "status-online" : "status-offline"}`}>
                {r.is_active ? "Active" : "Revoked"}
              </span>
            )},
            { key: "last_used_at", label: "Last Used", render: (r) =>
              r.last_used_at ? new Date(r.last_used_at).toLocaleString() : "Never"
            },
            { key: "created_at", label: "Created", render: (r) => new Date(r.created_at).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  );
}
