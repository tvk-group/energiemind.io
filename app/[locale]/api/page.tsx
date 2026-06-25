import { createSectionPage } from "@/lib/section-page";

const { generateMetadata, Page } = createSectionPage({
  pageKey: "api",
  slug: "api",
  icons: ["🔗", "📨", "📦", "🧪"],
  iconClasses: ["api", "dashboard", "analytics", "ai"],
  featureKeys: ["rest", "webhooks", "sdk", "sandbox"],
  faqKeys: ["q1", "a1", "q2", "a2"],
  heroCta: true,
});

export { generateMetadata };
export default Page;
