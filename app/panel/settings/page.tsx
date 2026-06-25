import { getProfile } from "@/lib/auth";

export const metadata = { title: "Settings | EnergieMIND Panel" };

export default async function PanelSettingsPage() {
  const profile = await getProfile();

  return (
    <div className="panel-page">
      <header className="panel-header">
        <h1>Settings</h1>
        <p>Account and platform preferences</p>
      </header>

      <div className="panel-card">
        <h3>Profile</h3>
        <dl className="panel-dl">
          <dt>Full Name</dt>
          <dd>{profile?.full_name || "—"}</dd>
          <dt>Email</dt>
          <dd>{profile?.email}</dd>
          <dt>Company</dt>
          <dd>{profile?.company || "—"}</dd>
          <dt>Role</dt>
          <dd><span className="status-badge status-online">{profile?.role}</span></dd>
          <dt>Phone</dt>
          <dd>{profile?.phone || "—"}</dd>
          <dt>Member Since</dt>
          <dd>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}</dd>
        </dl>
      </div>

      <div className="panel-card">
        <h3>API Access</h3>
        <p className="panel-text-muted">
          Generate API keys from the Admin Console or contact your administrator for developer access.
        </p>
        <a href="/en/api/" className="btn btn-secondary" target="_blank">View API Documentation</a>
      </div>
    </div>
  );
}
