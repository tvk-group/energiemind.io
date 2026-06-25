import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      {
        userAgent: "Yandex",
        allow: "/",
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
      },
    ],
    sitemap: [
      "https://energiemind.io/sitemap.xml",
      ...[
        "en", "tr", "de", "fr", "es", "it", "pt", "nl", "ar", "ru",
        "zh-cn", "zh-tw", "ja", "ko", "hi", "ur", "pl", "ro", "el",
        "sv", "no", "da", "fi", "he", "id",
      ].map((loc) => `https://energiemind.io/sitemaps/sitemap-${loc}.xml`),
    ],
    host: "https://energiemind.io",
  };
}
