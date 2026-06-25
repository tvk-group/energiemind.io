import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EnergieMIND — Redirecting",
  robots: { index: false, follow: false },
};

export default function RootPage() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="0;url=/en/" />
        <link rel="canonical" href="https://energiemind.io/en/" />
      </head>
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#0a0e17",
          color: "#e8edf5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <p>
          Redirecting to{" "}
          <a href="/en/" style={{ color: "#00d4aa" }}>
            EnergieMIND
          </a>
          ...
        </p>
        <script
          dangerouslySetInnerHTML={{
            __html: 'window.location.replace("/en/");',
          }}
        />
      </body>
    </html>
  );
}
