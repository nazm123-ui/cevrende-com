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

export default function FAQ() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="max-w-[600px] mb-14">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
            Sorular & Cevaplar
          </p>
          <h2 className="mt-3 text-[32px] sm:text-[40px] font-semibold tracking-[-0.025em] leading-[1.08] text-balance">
            Pendik'te işçi bulma hakkında sık sorulanlar
          </h2>
        </div>

        <div className="grid gap-6 max-w-[800px]">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-ink-100 rounded-[12px] p-5 sm:p-6 cursor-pointer hover:border-ink-200 transition"
            >
              <summary className="font-medium text-[16px] text-ink-900 flex items-center justify-between select-none">
                {faq.q}
                <span className="ml-4 text-ink-500 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-[15px] text-ink-500 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
