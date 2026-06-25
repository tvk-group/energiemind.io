import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { pages, getCanonicalUrl } from "@/lib/routes";

const SITE_URL = "https://energiemind.io";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: getCanonicalUrl(locale, page.slug),
        lastModified: new Date("2026-06-25"),
        changeFrequency: page.slug === "" ? "weekly" : "monthly",
        priority: page.slug === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [loc, getCanonicalUrl(loc, page.slug)])
          ),
        },
      });
    }
  }

  return entries;
}
