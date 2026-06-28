"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale, Dictionary } from "@/lib/i18n";
import { getPagePath } from "@/lib/routes";
import LanguageSwitcher from "./LanguageSwitcher";
import { getAppUrl } from "@/lib/app-url";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

const navItems = [
  { key: "platform", slug: "" },
  { key: "dashboard", slug: "dashboard" },
  { key: "minerMonitoring", slug: "miner-monitoring" },
  { key: "energyAnalytics", slug: "energy-analytics" },
  { key: "heatRecovery", slug: "heat-recovery" },
  { key: "aiOptimization", slug: "ai-optimization" },
  { key: "api", slug: "api" },
] as const;

export default function Header({ locale, dict }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const currentSlug = pathname
    ? pathname.replace(`/${locale}`, "").replace(/^\/|\/$/g, "")
    : "";

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href={getPagePath(locale, "")} className="logo">
          <div className="logo-icon">⚡</div>
          <span>EnergieMIND</span>
        </Link>

        <nav className="nav-desktop" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.slug}
              href={getPagePath(locale, item.slug)}
              className={`nav-link ${currentSlug === item.slug ? "active" : ""}`}
            >
              {dict.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher locale={locale} />
          <a
            href={getAppUrl()}
            className="btn btn-ghost app-nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {dict.nav.openApp ?? "Open App"}
          </a>
          <Link
            href={getPagePath(locale, "login")}
            className="btn btn-ghost"
          >
            {dict.nav.login}
          </Link>
          <Link
            href={getPagePath(locale, "request-access")}
            className="btn btn-primary"
          >
            {dict.nav.requestAccess}
          </Link>
          <button
            className="menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? dict.nav.close : dict.nav.menu}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <nav
        className={`mobile-nav ${mobileOpen ? "open" : ""}`}
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => (
          <Link
            key={item.slug}
            href={getPagePath(locale, item.slug)}
            className="nav-link"
            onClick={() => setMobileOpen(false)}
          >
            {dict.nav[item.key]}
          </Link>
        ))}
        <a
          href={getAppUrl()}
          className="nav-link"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
        >
          {dict.nav.openApp ?? "Open App"}
        </a>
        <Link
          href={getPagePath(locale, "login")}
          className="nav-link"
          onClick={() => setMobileOpen(false)}
        >
          {dict.nav.login}
        </Link>
        <Link
          href={getPagePath(locale, "request-access")}
          className="btn btn-primary"
          style={{ marginTop: 16, width: "100%" }}
          onClick={() => setMobileOpen(false)}
        >
          {dict.nav.requestAccess}
        </Link>
      </nav>
    </header>
  );
}
