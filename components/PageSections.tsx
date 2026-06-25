import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getPagePath } from "@/lib/routes";

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export default function PageHero({
  badge,
  title,
  subtitle,
  cta,
  secondary,
}: PageHeroProps) {
  return (
    <section className="hero">
      <div className="container">
        {badge && <span className="hero-badge">{badge}</span>}
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {(cta || secondary) && (
          <div className="hero-actions">
            {cta && (
              <Link href={cta.href} className="btn btn-primary">
                {cta.label}
              </Link>
            )}
            {secondary && (
              <Link href={secondary.href} className="btn btn-secondary">
                {secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface Feature {
  icon: string;
  iconClass: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}

export function FeatureGrid({
  title,
  features,
}: {
  title: string;
  features: Feature[];
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
        </div>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className={`feature-icon ${f.iconClass}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
              {f.href && f.linkLabel && (
                <Link href={f.href}>{f.linkLabel} →</Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({
  title,
  faqs,
}: {
  title: string;
  faqs: { question: string; answer: string }[];
}) {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumb container" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function InternalLinks({
  locale,
  dict,
  currentSlug,
}: {
  locale: Locale;
  dict: Dictionary;
  currentSlug: string;
}) {
  const links = [
    { slug: "", label: dict.nav.platform },
    { slug: "dashboard", label: dict.nav.dashboard },
    { slug: "miner-monitoring", label: dict.nav.minerMonitoring },
    { slug: "energy-analytics", label: dict.nav.energyAnalytics },
    { slug: "heat-recovery", label: dict.nav.heatRecovery },
    { slug: "ai-optimization", label: dict.nav.aiOptimization },
    { slug: "api", label: dict.nav.api },
    { slug: "request-access", label: dict.nav.requestAccess },
  ].filter((l) => l.slug !== currentSlug);

  return (
    <section className="internal-links">
      <div className="container">
        <h3>{dict.common.relatedPages}</h3>
        <div className="link-grid">
          {links.map((link) => (
            <Link
              key={link.slug}
              href={getPagePath(locale, link.slug)}
              className="link-chip"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
