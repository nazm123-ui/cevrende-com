import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cevrende.com — Pendik ve çevresinde yerel iş ilanları",
  description:
    "İstanbul Pendik ve mahallelerinde günlük, yarı zamanlı ve kısa süreli iş ilanlarını keşfedin. İşverenler ücretsiz ilan yayınlasın, iş arayanlar hızlıca iletişime geçsin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
