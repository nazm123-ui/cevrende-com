import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import TrustMessage from "@/components/home/TrustMessage";

export const metadata = {
  title: "Cevrende.com — Pendik'te Çevrendekileri Bul",
  description:
    "Pendik'te meslek sahibi kişilerle tanış, kendi mesleğini profiline ekle. Garson, temizlikçi, kurye, boyacı ve daha fazlası.",
  keywords: "işçi, garson, temizlikçi, kurye, boyacı, Pendik",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <TrustMessage />
    </>
  );
}
