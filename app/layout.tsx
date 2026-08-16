import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://energiemind.io"),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#00d4aa",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script
        id="sovra-ai-advisor-loader"
        src="https://www.sovra.network/assets/sovra-advisor.js"
        data-api="https://www.sovra.network/api/advisor"
        data-site="EnergieMIND Platform"
        data-accent="#00d4aa"
        data-context="metadata"
        data-support="https://energiemind.io/en/request-access/"
        data-privacy="https://www.sovra.network/advisor-privacy/"
        strategy="afterInteractive"
      />
    </>
  );
}
