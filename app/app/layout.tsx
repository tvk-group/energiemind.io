import "../globals.css";
import "./app.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { getAppUrl } from "@/lib/app-url";

export const metadata: Metadata = {
  title: "EnergieMIND App",
  description:
    "Operations app for energy dashboards, miner monitoring, and infrastructure intelligence.",
  applicationName: "EnergieMIND",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EnergieMIND",
  },
  formatDetection: {
    telephone: false,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#00d4aa",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const appUrl = getAppUrl();

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="app-body">
        <div className="app-shell">
          <header className="app-header">
            <div className="container app-header-inner">
              <Link href="/" className="logo">
                <div className="logo-icon">⚡</div>
                <span>EnergieMIND</span>
              </Link>
              <span className="app-badge">Operations App</span>
            </div>
          </header>
          {children}
          <footer className="footer" style={{ marginTop: "auto" }}>
            <div className="container" style={{ padding: "24px 0", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                <a href={appUrl} style={{ color: "var(--accent)" }}>
                  {appUrl.replace("https://", "")}
                </a>
                {" · "}
                <a href="https://energiemind.io/en/" style={{ color: "var(--text-secondary)" }}>
                  Marketing site
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
