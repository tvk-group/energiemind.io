import { createSectionPage } from "@/lib/section-page";

const { generateMetadata, Page } = createSectionPage({
  pageKey: "dashboard",
  slug: "dashboard",
  icons: ["📡", "🔔", "🏢", "📋"],
  iconClasses: ["dashboard", "miner", "analytics", "api"],
  featureKeys: ["realtime", "alerts", "multisite", "reports"],
  faqKeys: ["q1", "a1", "q2", "a2"],
  heroCta: true,
});

export { generateMetadata };
export default Page;
