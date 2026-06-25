import { requireAuth, getProfile } from "@/lib/auth";
import PanelSidebar from "@/components/panel/PanelSidebar";
import "../globals.css";
import "./panel.css";

export const metadata = {
  title: "EnergieMIND Panel",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const profile = await getProfile();

  if (!profile || !profile.is_active) {
    return (
      <div className="panel-inactive">
        <h1>Account Inactive</h1>
        <p>Your platform access has not been activated yet. Please contact support.</p>
        <a href="/en/request-access/" className="btn btn-primary">Request Access</a>
      </div>
    );
  }

  return (
    <html lang="en">
      <body className="panel-body">
        <div className="panel-layout">
          <PanelSidebar profile={profile} />
          <main className="panel-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
