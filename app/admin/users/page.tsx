import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/panel/DataTable";
import type { Profile } from "@/lib/supabase/types";

export const metadata = { title: "Users | Admin" };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Users</h1>
        <p>Manage platform user accounts and roles</p>
      </header>

      <div className="panel-card">
        <DataTable<Profile>
          data={(users || []) as Profile[]}
          columns={[
            { key: "full_name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "company", label: "Company" },
            { key: "role", label: "Role", render: (r) => (
              <span className="status-badge status-online">{r.role}</span>
            )},
            { key: "is_active", label: "Active", render: (r) => (
              <span className={`status-badge ${r.is_active ? "status-online" : "status-offline"}`}>
                {r.is_active ? "Active" : "Inactive"}
              </span>
            )},
            { key: "created_at", label: "Joined", render: (r) => new Date(r.created_at).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  );
}
