import { getAppUrl } from "@/lib/app-url";
import type { Dictionary } from "@/lib/i18n";

const fallback = {
  badge: "Operations App",
  title: "Get the EnergieMIND app at app.energiemind.io",
  description:
    "Install the operations portal on your phone — sign in, monitor miners, and access your dashboard from a home-screen icon. Works today via Add to Home Screen.",
  openApp: "Open app.energiemind.io",
  howToInstall: "How to install",
  signIn: "Sign in to dashboard",
  iphoneTitle: "iPhone / iPad",
  iphoneSteps: "Safari → app.energiemind.io → Share → Add to Home Screen",
  androidTitle: "Android",
  androidSteps: "Chrome → app.energiemind.io → menu → Install app or Add to Home screen",
  desktopTitle: "Desktop",
  desktopSteps:
    "Chrome or Edge → install icon in the address bar, or bookmark app.energiemind.io",
};

export default function AppPromo({ dict }: { dict: Dictionary }) {
  const copy = dict.home.app ?? fallback;
  const appUrl = getAppUrl();
  const appHost = appUrl.replace("https://", "");

  return (
    <section className="section section-alt" id="app">
      <div className="container">
        <div className="section-header">
          <p className="app-badge">{copy.badge}</p>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>

        <div className="app-actions" style={{ marginBottom: 32 }}>
          <a href={appUrl} className="btn btn-primary">
            {copy.openApp}
          </a>
          <a href={`${appUrl}/login/`} className="btn btn-secondary">
            {copy.signIn}
          </a>
        </div>

        <h3 style={{ textAlign: "center", marginBottom: 20 }}>{copy.howToInstall}</h3>
        <div className="app-install-grid">
          <div className="app-install-card">
            <h3>{copy.iphoneTitle}</h3>
            <p>{copy.iphoneSteps.replace("app.energiemind.io", appHost)}</p>
          </div>
          <div className="app-install-card">
            <h3>{copy.androidTitle}</h3>
            <p>{copy.androidSteps.replace("app.energiemind.io", appHost)}</p>
          </div>
          <div className="app-install-card">
            <h3>{copy.desktopTitle}</h3>
            <p>{copy.desktopSteps.replace("app.energiemind.io", appHost)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
