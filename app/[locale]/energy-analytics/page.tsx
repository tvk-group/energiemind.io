import { createSectionPage } from "@/lib/section-page";

const { generateMetadata, Page } = createSectionPage({
  pageKey: "energyAnalytics",
  slug: "energy-analytics",
  icons: ["📊", "💰", "🌱", "🔮"],
  iconClasses: ["analytics", "dashboard", "miner", "ai"],
  featureKeys: ["consumption", "cost", "carbon", "forecast"],
  faqKeys: ["q1", "a1", "q2", "a2"],
  heroCta: true,
});

export { generateMetadata };
export default Page;
