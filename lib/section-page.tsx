import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getDictionary,
  isValidLocale,
  type Locale,
} from "@/lib/i18n";
import { getPagePath, type PageKey } from "@/lib/routes";
import {
  buildMetadata,
  buildOrganizationSchema,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero, {
  FeatureGrid,
  FaqSection,
  Breadcrumb,
  InternalLinks,
} from "@/components/PageSections";

interface SectionPageConfig {
  pageKey: PageKey;
  slug: string;
  icons: string[];
  iconClasses: string[];
  featureKeys: string[];
  faqKeys?: string[];
  heroCta?: boolean;
}

export function createSectionPage(config: SectionPageConfig) {
  const {
    pageKey,
    slug,
    icons,
    iconClasses,
    featureKeys,
    faqKeys,
    heroCta,
  } = config;

  async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale: localeParam } = await params;
    if (!isValidLocale(localeParam)) return {};
    const dict = await getDictionary(localeParam);
    return buildMetadata(localeParam, pageKey, dict, slug);
  }

  async function Page({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale: localeParam } = await params;
    if (!isValidLocale(localeParam)) notFound();
    const locale = localeParam as Locale;
    const dict = await getDictionary(locale);
    const page = dict[pageKey] as {
      hero: { title: string; subtitle: string };
      features: { title: string; [key: string]: { title: string; description: string } | string };
      faq?: { [key: string]: string };
      endpoints?: { title: string; [key: string]: string };
    };

    const features = featureKeys.map((key, i) => ({
      icon: icons[i] || "⚡",
      iconClass: iconClasses[i] || "dashboard",
      title: (page.features[key] as { title: string }).title,
      description: (page.features[key] as { description: string }).description,
    }));

    const faqs: { question: string; answer: string }[] = [];
    if (faqKeys && page.faq) {
      for (let i = 0; i < faqKeys.length; i += 2) {
        const qKey = faqKeys[i];
        const aKey = faqKeys[i + 1];
        if (page.faq[qKey] && page.faq[aKey]) {
          faqs.push({
            question: page.faq[qKey],
            answer: page.faq[aKey],
          });
        }
      }
    }

    const breadcrumbItems = [
      { label: dict.common.home, href: getPagePath(locale, "") },
      { label: page.hero.title },
    ];

    const navKey = pageKey === "minerMonitoring"
      ? "minerMonitoring"
      : pageKey === "energyAnalytics"
        ? "energyAnalytics"
        : pageKey === "heatRecovery"
          ? "heatRecovery"
          : pageKey === "aiOptimization"
            ? "aiOptimization"
            : pageKey;

    return (
      <>
        <JsonLd
          data={[
            buildOrganizationSchema(dict, locale),
            buildArticleSchema(dict, locale, pageKey, slug),
            buildBreadcrumbSchema(
              dict,
              locale,
              breadcrumbItems.map((b) => ({
                name: b.label,
                slug: b.href ? slug : slug,
              }))
            ),
            ...(faqs.length > 0 ? [buildFaqSchema(faqs)] : []),
          ]}
        />

        <Breadcrumb items={breadcrumbItems} />

        <PageHero
          title={page.hero.title}
          subtitle={page.hero.subtitle}
          {...(heroCta
            ? {
                cta: {
                  label: dict.common.requestAccess,
                  href: getPagePath(locale, "request-access"),
                },
              }
            : {})}
        />

        <FeatureGrid title={page.features.title} features={features} />

        {page.endpoints && (
          <section className="section section-alt">
            <div className="container">
              <div className="section-header">
                <h2>{page.endpoints.title}</h2>
              </div>
              <div className="endpoint-list">
                {["metrics", "sites", "alerts", "control"].map((key) => (
                  <div key={key} className="endpoint-item">
                    <span
                      className={`endpoint-method ${key === "control" ? "post" : "get"}`}
                    >
                      {key === "control" ? "POST" : "GET"}
                    </span>
                    <span>{page.endpoints![key]}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <FaqSection title={dict.common.faq} faqs={faqs} />
        )}

        <InternalLinks locale={locale} dict={dict} currentSlug={slug} />
      </>
    );
  }

  return { generateMetadata, Page };
}
