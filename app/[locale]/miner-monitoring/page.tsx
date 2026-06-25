import { createSectionPage } from "@/lib/section-page";

const { generateMetadata, Page } = createSectionPage({
  pageKey: "minerMonitoring",
  slug: "miner-monitoring",
  icons: ["⚡", "🌡️", "🔋", "💾"],
  iconClasses: ["miner", "heat", "analytics", "api"],
  featureKeys: ["hashrate", "thermal", "power", "firmware"],
  faqKeys: ["q1", "a1", "q2", "a2"],
  heroCta: true,
});

export { generateMetadata };
export default Page;
