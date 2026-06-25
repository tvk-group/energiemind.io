#!/usr/bin/env node
/**
 * Generates language-specific sitemap files and sitemap index.
 * Run after build: node scripts/generate-sitemaps.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "out", "sitemaps");
const SITE_URL = "https://energiemind.io";

const locales = [
  "en", "tr", "de", "fr", "es", "it", "pt", "nl", "ar", "ru",
  "zh-cn", "zh-tw", "ja", "ko", "hi", "ur", "pl", "ro", "el",
  "sv", "no", "da", "fi", "he", "id",
];

const pages = [
  { slug: "", priority: "1.0", changefreq: "weekly" },
  { slug: "dashboard", priority: "0.8", changefreq: "monthly" },
  { slug: "miner-monitoring", priority: "0.8", changefreq: "monthly" },
  { slug: "energy-analytics", priority: "0.8", changefreq: "monthly" },
  { slug: "heat-recovery", priority: "0.8", changefreq: "monthly" },
  { slug: "ai-optimization", priority: "0.8", changefreq: "monthly" },
  { slug: "api", priority: "0.8", changefreq: "monthly" },
  { slug: "login", priority: "0.6", changefreq: "monthly" },
  { slug: "request-access", priority: "0.9", changefreq: "monthly" },
];

const lastmod = "2026-06-25";

function url(locale, slug) {
  return slug
    ? `${SITE_URL}/${locale}/${slug}/`
    : `${SITE_URL}/${locale}/`;
}

function hreflangLinks(slug) {
  return locales
    .map(
      (loc) =>
        `    <xhtml:link rel="alternate" hreflang="${loc}" href="${url(loc, slug)}" />`
    )
    .concat(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${url("en", slug)}" />`
    )
    .join("\n");
}

mkdirSync(outDir, { recursive: true });

const sitemapIndexEntries = [];

for (const locale of locales) {
  const urls = pages
    .map((page) => {
      const loc = url(locale, page.slug);
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflangLinks(page.slug)}
  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  const filename = `sitemap-${locale}.xml`;
  writeFileSync(join(outDir, filename), sitemap);
  sitemapIndexEntries.push(
    `  <sitemap>\n    <loc>${SITE_URL}/sitemaps/${filename}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`
  );
}

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapIndexEntries.join("\n")}
</sitemapindex>`;

writeFileSync(join(outDir, "sitemap-index.xml"), sitemapIndex);

console.log(`Generated ${locales.length} language sitemaps + sitemap index in out/sitemaps/`);
