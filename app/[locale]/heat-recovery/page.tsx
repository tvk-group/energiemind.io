import { createSectionPage } from "@/lib/section-page";

const { generateMetadata, Page } = createSectionPage({
  pageKey: "heatRecovery",
  slug: "heat-recovery",
  icons: ["♨️", "♻️", "🏘️", "💚"],
  iconClasses: ["heat", "miner", "dashboard", "analytics"],
  featureKeys: ["efficiency", "waste", "district", "savings"],
  faqKeys: ["q1", "a1", "q2", "a2"],
  heroCta: true,
});

export { generateMetadata };
export default Page;
