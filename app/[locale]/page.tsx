import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getDictionary,
  isValidLocale,
  type Locale,
} from "@/lib/i18n";
import { getPagePath } from "@/lib/routes";
import {
  buildMetadata,
  buildOrganizationSchema,
  buildWebsiteSchema,
  buildArticleSchema,
  buildFaqSchema,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero, {
  FeatureGrid,
  FaqSection,
  InternalLinks,
} from "@/components/PageSections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const dict = await getDictionary(localeParam);
  return buildMetadata(localeParam, "home", dict, "");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const h = dict.home;

  const features = [
    {
      icon: "📊",
      iconClass: "dashboard",
      title: h.features.dashboard.title,
      description: h.features.dashboard.description,
      href: getPagePath(locale, "dashboard"),
      linkLabel: dict.common.learnMore,
    },
    {
      icon: "⛏️",
      iconClass: "miner",
      title: h.features.miner.title,
      description: h.features.miner.description,
      href: getPagePath(locale, "miner-monitoring"),
      linkLabel: dict.common.learnMore,
    },
    {
      icon: "📈",
      iconClass: "analytics",
      title: h.features.analytics.title,
      description: h.features.analytics.description,
      href: getPagePath(locale, "energy-analytics"),
      linkLabel: dict.common.learnMore,
    },
    {
      icon: "🔥",
      iconClass: "heat",
      title: h.features.heat.title,
      description: h.features.heat.description,
      href: getPagePath(locale, "heat-recovery"),
      linkLabel: dict.common.learnMore,
    },
    {
      icon: "🤖",
      iconClass: "ai",
      title: h.features.ai.title,
      description: h.features.ai.description,
      href: getPagePath(locale, "ai-optimization"),
      linkLabel: dict.common.learnMore,
    },
    {
      icon: "🔌",
      iconClass: "api",
      title: h.features.api.title,
      description: h.features.api.description,
      href: getPagePath(locale, "api"),
      linkLabel: dict.common.learnMore,
    },
  ];

  const faqs = [
    { question: h.faq.q1, answer: h.faq.a1 },
    { question: h.faq.q2, answer: h.faq.a2 },
    { question: h.faq.q3, answer: h.faq.a3 },
    { question: h.faq.q4, answer: h.faq.a4 },
  ];

  return (
    <>
      <JsonLd
        data={[
          buildOrganizationSchema(dict, locale),
          buildWebsiteSchema(dict, locale),
          buildArticleSchema(dict, locale, "home", ""),
          buildFaqSchema(faqs),
        ]}
      />

      <PageHero
        badge={dict.common.platformBadge}
        title={h.hero.title}
        subtitle={h.hero.subtitle}
        cta={{
          label: h.hero.cta,
          href: getPagePath(locale, "request-access"),
        }}
        secondary={{
          label: h.hero.secondary,
          href: getPagePath(locale, "dashboard"),
        }}
      />

      <section className="section">
        <div className="container">
          <div className="notice-banner">{dict.common.underDevelopment}</div>
          <div className="section-header">
            <h2>{h.intro.title}</h2>
            <p>{h.intro.description}</p>
          </div>
        </div>
      </section>

      <FeatureGrid title={h.features.title} features={features} />

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>{h.stats.title}</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{h.stats.sitesValue}</div>
              <div className="stat-label">{h.stats.sites}</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{h.stats.powerValue}</div>
              <div className="stat-label">{h.stats.power}</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{h.stats.languagesValue}</div>
              <div className="stat-label">{h.stats.languages}</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{h.stats.uptimeValue}</div>
              <div className="stat-label">{h.stats.uptime}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>{h.cta.title}</h2>
          <p>{h.cta.description}</p>
          <a
            href={getPagePath(locale, "request-access")}
            className="btn btn-primary"
          >
            {h.cta.button}
          </a>
        </div>
      </section>

      <FaqSection title={dict.common.faq} faqs={faqs} />
      <InternalLinks locale={locale} dict={dict} currentSlug="" />
    </>
  );
}
