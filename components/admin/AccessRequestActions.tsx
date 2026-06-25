"use client";

import { useState } from "react";
import type { AccessRequest } from "@/lib/supabase/types";

export default function AccessRequestActions({ request }: { request: AccessRequest }) {
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: "approved" | "rejected") {
    setLoading(true);
    await fetch("/api/admin/access-requests/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: request.id, status }),
    });
    window.location.reload();
  }

  if (request.status !== "pending") {
    return <span className={`status-badge status-${request.status === "approved" ? "online" : "offline"}`}>{request.status}</span>;
  }

  return (
    <div className="admin-actions">
      <button className="btn-approve" disabled={loading} onClick={() => updateStatus("approved")}>Approve</button>
      <button className="btn-reject" disabled={loading} onClick={() => updateStatus("rejected")}>Reject</button>
    </div>
  );
}
