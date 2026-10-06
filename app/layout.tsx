import type { Metadata } from "next";
import { StoreProvider } from "./store/redux/StoreProvider";
import "./globals.css";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chill - Temukan Tontonan Favoritmu",
    template: "%s | Chill",
  },
  description:
    "Aplikasi Chill dengan CRUD film dinamis melalui REST API, custom hook, dan Redux Toolkit.",
  icons: { icon: "/assets/img/Logo.png" },
  openGraph: {
    title: "Chill - Film dan Series, Tanpa Jeda",
    description: "Kelola koleksi film melalui REST API dan jelajahi katalog Chill.",
    type: "website",
    images: [{ url: "/og-series-v2.png", width: 1536, height: 1024, alt: "Chill - Film dan Series, Tanpa Jeda" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chill - Film dan Series, Tanpa Jeda",
    description: "Kelola koleksi film melalui REST API dan jelajahi katalog Chill.",
    images: ["/og-series-v2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
