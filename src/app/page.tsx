import Hero from "@/components/home/Hero";
import CountStrip from "@/components/home/CountStrip";
import HowItWorks from "@/components/home/HowItWorks";
import TrustMessage from "@/components/home/TrustMessage";
import PreviewListings from "@/components/home/PreviewListings";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata = {
  title: "Cevrende — Pendik'te Mahallenden Usta ve Hizmet",
  description:
    "Pendik'te güvenilir temizlikçi, çilingir, tadilat ustası ve daha fazlasını mahallenden bul. Aracısız, ücretsiz iletişim.",
  keywords:
    "Pendik, mahalle, temizlikçi, çilingir, tadilat, kurye, boyacı, yerel hizmet",
};

export const revalidate = 60;

export default function HomePage() {
  const faqs = [
    {
      q: "Pendik'te güvenilir temizlikçi nasıl bulurum?",
      a: "Cevrende'ye giriş yapıp 'Temizlik' kategorisine filtrele. Her işçinin profili, yapılan işler ve kullanıcı değerlendirmeleri görürsün. Direkt mesaj yazabilir, telefonla iletişime geçebilirsin.",
    },
    {
      q: "Pendik'te çilingir nasıl çabuk bulabilirim?",
      a: "Mahallendekiler sayfasında 'Çilingir' ya da 'Kilit' yazdığında, Pendik ve çevresindeki tüm usta listelenecek. Profiline bakıp mesaj gönderebilir, ücret hakkında anlaşabilirsin.",
    },
    {
      q: "İşçiye telefon vermeden mesajlaşabilir miyim?",
      a: "Evet. Platform içinden mesajla başlayabilirsin. İşçi onay verince ve mesajlaştıktan sonra isteğe bağlı olarak WhatsApp/telefona geçebilirsin.",
    },
    {
      q: "Pendik'te işçi profili açmak kaç para tutuyor?",
      a: "Tamamen ücretsiz. Profil aç, mesleğini seç, mahalleni ekle. Hiçbir ücret, hiçbir komisyon yok. Müşteriler seni direkt arayacak.",
    },
    {
      q: "Çevrendekiler listesine nasıl eklenebilirim?",
      a: "Ücretsiz hesap aç, e-postanı doğrula. Profil ayarlarında mesleğini seç (Temizlik, Tadilat, Çilingir, vb.) ve mahalleni belirle. Hemen listelenmeye başlarsın.",
    },
    {
      q: "Pendik'te işçi ararken hangi bilgilerim paylaşılır?",
      a: "Sana gösterilen profilde, işçinin istediği bilgiler görünür. Mesajlaştıktan sonra, işçi kendi güvenlik ayarlarına göre adını, telefonu, adresi seçerek paylaşabilir.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
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
      <Hero />
      <CountStrip />
      <HowItWorks />
      <TrustMessage />
      <PreviewListings />
      <FAQ />
      <FinalCTA />
    </>
  );
}
