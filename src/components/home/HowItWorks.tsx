const steps = [
  {
    n: "01",
    title: "Profilini aç",
    body: "Hesap aç, e-postanı doğrula. Mahalleni ekle, çevrendeki kişilerle eşleş.",
  },
  {
    n: "02",
    title: "Çevrendekileri keşfet",
    body: "Mesleğe ve mahalleye göre filtrele. Profilini açarsan sen de bulun.",
  },
  {
    n: "03",
    title: "Mesajlaş, tanış",
    body: "Platform üzerinden mesajla. Onay sonrası telefonla aracısız iletişim.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="max-w-[600px] mb-14">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
            Nasıl çalışır
          </p>
          <h2 className="mt-3 text-[32px] sm:text-[40px] font-semibold tracking-[-0.025em] leading-[1.08] text-balance">
            Üç Adım: Pendik'te Usta Bul, Mesajla, Aracısız İletişim
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 border-t border-ink-100">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`py-10 ${
                i > 0 ? "sm:pl-8 sm:border-l sm:border-ink-100" : "sm:pr-8"
              } ${i < 2 ? "sm:pr-8" : ""}`}
            >
              <p className="font-mono text-[13px] text-accent-600 tracking-[0.04em] mb-4">
                {s.n}
              </p>
              <h3 className="text-[22px] font-semibold tracking-[-0.012em] mb-2">
                {s.title}
              </h3>
              <p className="text-[15px] text-ink-500 max-w-[280px] leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
