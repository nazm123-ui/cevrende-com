import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PwaRegister from "@/components/PwaRegister";
import PwaInstallBanner from "@/components/PwaInstallBanner";
import { SITE_URL, SITE_NAME } from "@/lib/site-url";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cevrende — Pendik'te Mahallenden Usta ve Hizmet",
    template: "%s — Cevrende",
  },
  description:
    "Pendik'te güvenilir temizlikçi, çilingir, tadilat ustası ve daha fazlasını mahallenden bul. Aracısız, ücretsiz iletişim.",
  applicationName: SITE_NAME,
  authors: [{ name: "Çevrende Ekibi" }],
  generator: "Next.js",
  keywords: [
    "Pendik usta",
    "Pendik temizlikçi",
    "Pendik çilingir",
    "Pendik tadilat",
    "Pendik kurye",
    "Pendik iş ilanları",
    "mahallenden usta",
    "iş arama Pendik",
    "yerel hizmet Pendik",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Cevrende — Pendik'te Mahallenden Usta ve Hizmet",
    description:
      "Pendik'te güvenilir temizlikçi, çilingir, tadilat ustası ve daha fazlasını mahallenden bul. Aracısız, ücretsiz iletişim.",
    // OG image opengraph-image.tsx üzerinden otomatik enjekte edilir
  },
  twitter: {
    card: "summary_large_image",
    title: "Cevrende — Pendik'te Mahallenden Usta ve Hizmet",
    description:
      "Pendik'te güvenilir usta, kurye, bakıcı ve daha fazlasını mahallenden bul. Aracı yok, komisyon yok.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Çevrende",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/icon-512.png`,
              description:
                "Pendik'te mahallenden usta ve hizmet bulma platformu",
              areaServed: {
                "@type": "AdministrativeArea",
                name: "Pendik",
                containedInPlace: {
                  "@type": "City",
                  name: "İstanbul",
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "TR",
                  },
                },
              },
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
              name: SITE_NAME,
              url: SITE_URL,
              inLanguage: "tr-TR",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/cevrendekiler?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}#localbusiness`,
              name: "Cevrende — Pendik İş Eşleştirme",
              description:
                "Pendik ve çevre mahallelerde işçi-işveren eşleştirme platformu. Temizlik, tadilat, çilingir, kurye, garson ve daha fazlası.",
              url: SITE_URL,
              image: `${SITE_URL}/og-default.png`,
              priceRange: "Ücretsiz",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pendik",
                addressRegion: "İstanbul",
                addressCountry: "TR",
              },
              areaServed: {
                "@type": "AdministrativeArea",
                name: "Pendik, İstanbul",
              },
              telephone: "",
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
            }),
          }}
        />
        {/* Apple PWA splash screens — uygulama açılırken siyah ekran yerine logo */}
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1170-2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1179-2556.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1284-2778.png"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        />
      </head>
      <body className="min-h-screen bg-ink-50 text-ink-900 overflow-x-hidden">
        {children}
        <PwaRegister />
        <PwaInstallBanner />
      </body>
    </html>
  );
}
