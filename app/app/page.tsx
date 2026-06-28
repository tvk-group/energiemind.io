import Link from "next/link";
import { getAppUrl } from "@/lib/app-url";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppWelcomePage() {
  const user = await getSessionUser();
  if (user) redirect("/panel/");

  const appUrl = getAppUrl();

  return (
    <main>
      <section className="app-hero">
        <div className="container">
          <p className="app-badge" style={{ marginBottom: 16 }}>
            Installable operations app
          </p>
          <h1>Energy intelligence on your phone and desktop</h1>
          <p>
            Monitor miners, energy metrics, heat recovery, and alerts from a
            home-screen app — the same operations dashboard trusted by facility
            operators on energiemind.io.
          </p>
          <div className="app-actions">
            <Link href="/login/" className="btn btn-primary">
              Sign in to dashboard
            </Link>
            <a href="https://energiemind.io/en/request-access/" className="btn btn-secondary">
              Request access
            </a>
          </div>

          <div className="app-features">
            <div className="app-feature">
              <strong>Live operations</strong>
              <span>Real-time KPIs across sites, miners, and alerts</span>
            </div>
            <div className="app-feature">
              <strong>Secure access</strong>
              <span>Authenticated sessions with role-based permissions</span>
            </div>
            <div className="app-feature">
              <strong>Install anywhere</strong>
              <span>Add to home screen on iOS, Android, or desktop</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>How to install</h2>
            <p>
              Open <strong>{appUrl.replace("https://", "")}</strong> on your device
              and add it to your home screen — same pattern as EnteleKRON and
              SOVRA Protocol investor apps.
            </p>
          </div>
          <div className="app-install-grid">
            <div className="app-install-card">
              <h3>iPhone / iPad</h3>
              <p>
                Safari → {appUrl.replace("https://", "")} → Share → Add to Home
                Screen
              </p>
            </div>
            <div className="app-install-card">
              <h3>Android</h3>
              <p>
                Chrome → {appUrl.replace("https://", "")} → menu → Install app
                or Add to Home screen
              </p>
            </div>
            <div className="app-install-card">
              <h3>Desktop</h3>
              <p>
                Chrome or Edge → install icon in the address bar, or bookmark{" "}
                {appUrl.replace("https://", "")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
