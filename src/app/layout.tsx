import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cevrende — Pendik'te Mahallenden Usta ve Hizmet",
  description:
    "Pendik'te güvenilir temizlikçi, çilingir, tadilat ustası ve daha fazlasını mahallenden bul. Aracısız, ücretsiz iletişim.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#fafaf7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Cevrende",
              url: "https://cevrende.com",
              description:
                "Pendik'te mahallenden usta ve hizmet bulma platformu",
              areaServed: ["Pendik", "Tuzla", "Kartal", "Istanbul"],
              sameAs: [
                "https://twitter.com/cevrende",
                "https://instagram.com/cevrende",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://cevrende.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://cevrende.com/cevrendekiler?q={search_term_string}",
                },
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ink-50 text-ink-900 overflow-x-hidden">
        <Header />
        <main className="flex-1 min-w-0 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
