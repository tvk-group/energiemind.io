import { createSectionPage } from "@/lib/section-page";

const { generateMetadata, Page } = createSectionPage({
  pageKey: "aiOptimization",
  slug: "ai-optimization",
  icons: ["⚖️", "🔧", "🎯", "💡"],
  iconClasses: ["ai", "miner", "analytics", "dashboard"],
  featureKeys: ["load", "predictive", "autonomous", "insights"],
  faqKeys: ["q1", "a1", "q2", "a2"],
  heroCta: true,
});

export { generateMetadata };
export default Page;
