import Hero from "@/components/home/Hero";
import CountStrip from "@/components/home/CountStrip";
import HowItWorks from "@/components/home/HowItWorks";
import TrustMessage from "@/components/home/TrustMessage";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata = {
  title: "çevrende — Mahallendeki yardımı bul",
  description:
    "Pendik ve mahallelerinde meslek sahibi kişilerle tanış. Sen de mesleğini profiline ekleyerek başkalarının seni bulmasını sağla.",
  keywords:
    "Pendik, mahalle, garson, temizlikçi, kurye, boyacı, yerel hizmet",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CountStrip />
      <HowItWorks />
      <TrustMessage />
      <FinalCTA />
    </>
  );
}
