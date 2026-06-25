import type { Locale } from "./i18n";

export const pages = [
  { slug: "", key: "home" },
  { slug: "dashboard", key: "dashboard" },
  { slug: "miner-monitoring", key: "minerMonitoring" },
  { slug: "energy-analytics", key: "energyAnalytics" },
  { slug: "heat-recovery", key: "heatRecovery" },
  { slug: "ai-optimization", key: "aiOptimization" },
  { slug: "api", key: "api" },
  { slug: "login", key: "login" },
  { slug: "request-access", key: "requestAccess" },
] as const;

export type PageKey = (typeof pages)[number]["key"];

export function getPagePath(locale: Locale, slug: string): string {
  return slug ? `/${locale}/${slug}/` : `/${locale}/`;
}

export function getCanonicalUrl(locale: Locale, slug: string): string {
  return `https://energiemind.io${getPagePath(locale, slug)}`;
}

export function getPageKeyFromSlug(slug: string): PageKey {
  const page = pages.find((p) => p.slug === slug);
  return page?.key ?? "home";
}
