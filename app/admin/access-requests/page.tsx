import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/panel/DataTable";
import AccessRequestActions from "@/components/admin/AccessRequestActions";
import type { AccessRequest } from "@/lib/supabase/types";

export const metadata = { title: "Access Requests | Admin" };

export default async function AdminAccessRequestsPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("access_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Access Requests</h1>
        <p>Review and approve platform access applications</p>
      </header>

      <div className="panel-card">
        <DataTable<AccessRequest>
          data={(requests || []) as AccessRequest[]}
          columns={[
            { key: "full_name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "company", label: "Company" },
            { key: "use_case", label: "Use Case" },
            { key: "status", label: "Status", render: (r) => (
              <AccessRequestActions request={r} />
            )},
            { key: "created_at", label: "Submitted", render: (r) => new Date(r.created_at).toLocaleString() },
            { key: "message", label: "Message", render: (r) => (
              <span title={r.message}>{r.message.slice(0, 60)}...</span>
            )},
          ]}
        />
      </div>
    </div>
  );
}
