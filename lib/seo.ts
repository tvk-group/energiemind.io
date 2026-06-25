import type { Metadata } from "next";
import {
  locales,
  defaultLocale,
  ogLocales,
  type Locale,
  type Dictionary,
} from "./i18n";
import { getCanonicalUrl, type PageKey } from "./routes";

const SITE_URL = "https://energiemind.io";

export function buildMetadata(
  locale: Locale,
  pageKey: PageKey,
  dict: Dictionary,
  slug: string
): Metadata {
  const meta = dict.meta[pageKey];
  const canonical = getCanonicalUrl(locale, slug);

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = getCanonicalUrl(loc, slug);
  }
  languages["x-default"] = getCanonicalUrl(defaultLocale, slug);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: canonical,
      siteName: dict.meta.siteName,
      locale: ogLocales[locale],
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: meta.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: [`${SITE_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "baidu-site-verification": "energiemind-baidu",
      "yandex-verification": "energiemind-yandex",
    },
  };
}

export function buildOrganizationSchema(dict: Dictionary, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dict.schema.organization.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: dict.schema.organization.description,
    foundingDate: "2024",
    parentOrganization: {
      "@type": "Organization",
      name: "TVK Infrastructure & Energy Systems LTD",
      url: "https://tvk.group",
    },
    sameAs: [
      "https://tvk.group",
      "https://entelekron.io",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: dict.schema.organization.contactType,
      email: "platform@energiemind.io",
      availableLanguage: locales.map((l) => l.toUpperCase()),
    },
    inLanguage: locale,
  };
}

export function buildWebsiteSchema(dict: Dictionary, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.meta.siteName,
    url: SITE_URL,
    description: dict.schema.website.description,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: dict.schema.organization.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/${locale}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(
  dict: Dictionary,
  locale: Locale,
  items: { name: string; slug: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(locale, item.slug),
    })),
  };
}

export function buildArticleSchema(
  dict: Dictionary,
  locale: Locale,
  pageKey: PageKey,
  slug: string
) {
  const meta = dict.meta[pageKey];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    url: getCanonicalUrl(locale, slug),
    datePublished: "2026-01-01",
    dateModified: "2026-06-25",
    author: {
      "@type": "Organization",
      name: dict.schema.organization.name,
    },
    publisher: {
      "@type": "Organization",
      name: dict.schema.organization.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    inLanguage: locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getCanonicalUrl(locale, slug),
    },
  };
}

export function buildFaqSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
