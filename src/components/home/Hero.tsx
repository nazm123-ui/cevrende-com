import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-16 sm:pt-20 pb-12 sm:pb-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 grid items-center gap-10 lg:gap-16 lg:grid-cols-[1.15fr_0.95fr]">
        <div>
          <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
            Pendik · Tuzla · Kartal
          </p>

          <h1 className="mt-4 text-[42px] sm:text-[56px] lg:text-[64px] font-semibold tracking-[-0.035em] leading-[1.02] text-balance max-w-[560px]">
            Mahallendeki yardım,
            <br />
            <span className="text-accent-600">tek profil ötende.</span>
          </h1>

          <p className="mt-6 text-[17px] sm:text-lg text-ink-700 max-w-[480px] leading-relaxed">
            Pendik ve çevresinde meslek sahibi kişilerle aracısız tanış.
            Profilini aç, çevrendekilerin seni bulmasını sağla.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/iscilar"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-ink-900 text-white text-[15px] font-medium hover:bg-accent-600 transition"
            >
              Çevrendekileri gör
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/kayit"
              className="inline-flex items-center h-12 px-6 rounded-full border border-ink-200 text-ink-900 text-[15px] font-medium hover:border-ink-900 transition"
            >
              Profilini aç
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-ink-500">
            <Trait>Ücretsiz</Trait>
            <Trait>Komisyonsuz</Trait>
            <Trait>Aracısız iletişim</Trait>
          </div>
        </div>

        {/* Right side: minimal info card */}
        <div className="hidden lg:block">
          <div className="bg-white border border-ink-100 rounded-[14px] shadow-[0_8px_24px_-12px_rgba(15,17,16,0.10)] p-7">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
              Nasıl çalışır
            </p>

            <ol className="mt-5 space-y-4">
              <Step n="01" title="Profilini aç" desc="E-postanı doğrula, başlamaya hazırsın." />
              <Step n="02" title="Mesleğini ekle" desc="Çevrendekiler seni bulsun istersen." />
              <Step n="03" title="Tanış, mesajlaş" desc="Onay sonrası telefonla iletişim." />
            </ol>

            <div className="mt-6 pt-5 border-t border-ink-100 flex items-center justify-between text-[13px]">
              <span className="text-ink-500">Ücretsiz hesap</span>
              <Link
                href="/kayit"
                className="text-ink-900 font-medium hover:text-accent-600 transition"
              >
                Başla →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trait({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent-600"
      >
        <path d="M5 12.5 10 17 19 7.5" />
      </svg>
      {children}
    </span>
  );
}

function Step({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="font-mono text-[12px] text-accent-600 tracking-wider pt-1 shrink-0 w-7">
        {n}
      </span>
      <div>
        <p className="text-[15px] font-medium text-ink-900 tracking-tight">
          {title}
        </p>
        <p className="text-[13.5px] text-ink-500 mt-0.5 leading-snug">{desc}</p>
      </div>
    </li>
  );
}
