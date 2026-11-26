import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "GRK Varaždin – službena web stranica", template: "%s | GRK Varaždin" },
  description:
    "Službena web stranica Gradskog rukometnog kluba Varaždin 1930 – vijesti, utakmice, rezultati, ljestvica, momčad i škola rukometa.",
  openGraph: { type: "website", locale: "hr_HR", siteName: "GRK Varaždin" },
  icons: { icon: "/favicon-32.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#D71918" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
