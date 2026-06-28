import { requireAuth, getProfile } from "@/lib/auth";
import PanelSidebar from "@/components/panel/PanelSidebar";
import type { Metadata, Viewport } from "next";
import "../globals.css";
import "./panel.css";

export const metadata: Metadata = {
  title: "EnergieMIND Panel",
  description: "Operations dashboard for energy intelligence and miner monitoring.",
  applicationName: "EnergieMIND",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EnergieMIND",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#00d4aa",
  width: "device-width",
  initialScale: 1,
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
      <html lang="en">
        <body className="panel-body">
          <div className="panel-inactive">
            <h1>Account Inactive</h1>
            <p>Your platform access has not been activated yet. Please contact support.</p>
            <a href="https://energiemind.io/en/request-access/" className="btn btn-primary">
              Request Access
            </a>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="panel-body">
        <div className="panel-layout">
          <PanelSidebar profile={profile} />
          <main className="panel-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
