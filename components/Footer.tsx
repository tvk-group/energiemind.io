import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";
import { getPagePath } from "@/lib/routes";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={getPagePath(locale, "")} className="logo">
              <div className="logo-icon">⚡</div>
              <span>EnergieMIND</span>
            </Link>
            <p>{dict.footer.description}</p>
          </div>

          <div className="footer-col">
            <h4>{dict.footer.platform}</h4>
            <Link href={getPagePath(locale, "")}>{dict.nav.platform}</Link>
            <Link href={getPagePath(locale, "dashboard")}>{dict.nav.dashboard}</Link>
            <Link href={getPagePath(locale, "miner-monitoring")}>{dict.nav.minerMonitoring}</Link>
            <Link href={getPagePath(locale, "energy-analytics")}>{dict.nav.energyAnalytics}</Link>
          </div>

          <div className="footer-col">
            <h4>{dict.footer.solutions}</h4>
            <Link href={getPagePath(locale, "heat-recovery")}>{dict.nav.heatRecovery}</Link>
            <Link href={getPagePath(locale, "ai-optimization")}>{dict.nav.aiOptimization}</Link>
            <Link href={getPagePath(locale, "request-access")}>{dict.nav.requestAccess}</Link>
          </div>

          <div className="footer-col">
            <h4>{dict.footer.developers}</h4>
            <Link href={getPagePath(locale, "api")}>{dict.nav.api}</Link>
            <Link href={getPagePath(locale, "login")}>{dict.nav.login}</Link>
          </div>

          <div className="footer-col">
            <h4>{dict.footer.company}</h4>
            <a href="https://tvk.group" target="_blank" rel="noopener noreferrer">
              {dict.footer.tvkGroup}
            </a>
            <a href="https://entelekron.io" target="_blank" rel="noopener noreferrer">
              {dict.footer.entelekron}
            </a>
            <Link href={getPagePath(locale, "request-access")}>{dict.footer.contact}</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} EnergieMIND. {dict.common.allRightsReserved}
          </span>
          <span>{dict.common.operatedBy}</span>
        </div>
      </div>
    </footer>
  );
}
