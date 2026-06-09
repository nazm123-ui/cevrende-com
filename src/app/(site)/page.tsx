import Hero from "@/components/home/Hero";
import CountStrip from "@/components/home/CountStrip";
import HowItWorks from "@/components/home/HowItWorks";
import TrustMessage from "@/components/home/TrustMessage";
import PreviewListings from "@/components/home/PreviewListings";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import { HOME_FAQS, HOW_TO_STEPS } from "@/lib/home-faqs";
import { SITE_URL } from "@/lib/site-url";

export const metadata = {
  title: "Cevrende — Pendik'te Mahallenden Usta ve Hizmet",
  description:
    "Pendik'te güvenilir temizlikçi, çilingir, tadilat ustası ve daha fazlasını mahallenden bul. Aracısız, ücretsiz iletişim.",
  keywords:
    "Pendik, mahalle, temizlikçi, çilingir, tadilat, kurye, boyacı, yerel hizmet",
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: HOME_FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Pendik'te hizmet veren nasıl bulunur?",
            description:
              "Cevrende.com üzerinden Pendik bölgesinde güvenilir hizmet veren (usta, temizlikçi, çilingir vb.) bulmanın adım adım yöntemi.",
            totalTime: "PT5M",
            estimatedCost: {
              "@type": "MonetaryAmount",
              currency: "TRY",
              value: "0",
            },
            inLanguage: "tr-TR",
            step: HOW_TO_STEPS.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.name,
              text: s.text,
              url: `${SITE_URL}/#step-${i + 1}`,
            })),
          }),
        }}
      />
      <Hero />
      <CountStrip />
      <HowItWorks />
      <TrustMessage />
      <PreviewListings />
      <FAQ faqs={HOME_FAQS} />
      <FinalCTA />
    </>
  );
}
