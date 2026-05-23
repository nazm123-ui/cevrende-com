import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-ink-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
        <p className="text-xs sm:text-sm font-semibold text-accent-600 uppercase tracking-wider">
          İstanbul · Pendik ve mahalleleri
        </p>

        <h1 className="mt-4 text-3xl sm:text-5xl font-bold text-ink-900 leading-tight tracking-tight">
          Çevrendeki yardımı bul,
          <br className="hidden sm:block" /> profilini aç, hızlıca iletişime geç.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-ink-700 max-w-2xl mx-auto leading-relaxed">
          Pendik ve mahallelerinde meslek sahibi kişilerle tanış. Sen de
          mesleğini profiline ekleyerek çevrendekilerin seni bulmasını sağla.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/iscilar"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition"
          >
            Çevrendekileri Gör
          </Link>
          <Link
            href="/panel/profil"
            className="inline-flex items-center justify-center rounded-lg border-2 border-accent-500 bg-white px-6 py-3 text-base font-semibold text-accent-600 hover:bg-accent-500 hover:text-white transition"
          >
            Profilini Aç
          </Link>
        </div>
      </div>
    </section>
  );
}
