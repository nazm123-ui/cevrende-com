import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-ink-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
        <p className="text-xs sm:text-sm font-semibold text-accent-600 uppercase tracking-wider">
          İstanbul · Pendik ve mahalleleri
        </p>

        <h1 className="mt-4 text-3xl sm:text-5xl font-bold text-ink-900 leading-tight tracking-tight">
          Yakınındaki işi bul,
          <br className="hidden sm:block" /> ihtiyacın olan çalışanla tanış.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-ink-700 max-w-2xl mx-auto leading-relaxed">
          İlçendeki, mahallendeki ve çevrendeki iş fırsatlarını tek yerde gör.
          İşverenler ücretsiz ilan açsın, iş arayanlar hızlıca iletişime geçsin.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/ilanlar"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition"
          >
            İş İlanlarını Gör
          </Link>
          <Link
            href="/panel/ilan-yeni"
            className="inline-flex items-center justify-center rounded-lg border-2 border-accent-500 bg-white px-6 py-3 text-base font-semibold text-accent-600 hover:bg-accent-500 hover:text-white transition"
          >
            Ücretsiz İlan Oluştur
          </Link>
        </div>
      </div>
    </section>
  );
}
