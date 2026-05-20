import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import TrustMessage from "@/components/home/TrustMessage";

export const metadata = {
  title: "Cevrende.com — Pendik'te İş Bulma Platformu",
  description:
    "Pendik'te hızlı ve kolay iş bulun. Garson, muhasebeci, temizlik, kurye ve daha pek çok kategoride şimdi iş ilanları.",
  keywords: "iş, işçi, garson, temizlik, kurye, Pendik, iş ilanları",
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
