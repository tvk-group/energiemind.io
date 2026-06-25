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
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero, {
  FaqSection,
  Breadcrumb,
  InternalLinks,
} from "@/components/PageSections";
import RequestAccessForm from "@/components/RequestAccessForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const dict = await getDictionary(localeParam);
  return buildMetadata(localeParam, "requestAccess", dict, "request-access");
}

export default async function RequestAccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const page = dict.requestAccess;

  const faqs = [
    { question: page.faq.q1, answer: page.faq.a1 },
    { question: page.faq.q2, answer: page.faq.a2 },
  ];

  const breadcrumbItems = [
    { label: dict.common.home, href: getPagePath(locale, "") },
    { label: page.hero.title },
  ];

  return (
    <>
      <JsonLd
        data={[
          buildOrganizationSchema(dict, locale),
          buildArticleSchema(dict, locale, "requestAccess", "request-access"),
          buildBreadcrumbSchema(
            dict,
            locale,
            breadcrumbItems.map((b) => ({
              name: b.label,
              slug: "request-access",
            }))
          ),
          buildFaqSchema(faqs),
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      <PageHero title={page.hero.title} subtitle={page.hero.subtitle} />

      <section className="section">
        <div className="container">
          <RequestAccessForm dict={dict} />
        </div>
      </section>

      <FaqSection title={dict.common.faq} faqs={faqs} />
      <InternalLinks
        locale={locale}
        dict={dict}
        currentSlug="request-access"
      />
    </>
  );
}
