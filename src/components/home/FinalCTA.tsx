import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="pt-8 pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div
          className="bg-ink-900 rounded-[18px] px-8 sm:px-14 py-12 sm:py-16 grid gap-6 sm:grid-cols-[1.4fr_auto] sm:items-center"
          style={{ color: "#ffffff" }}
        >
          <div>
            <h2
              className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.025em] leading-[1.08] text-balance max-w-[520px]"
              style={{ color: "#ffffff" }}
            >
              Pendik'te acil işçiye mi ihtiyacın var? Üç dakikada bul.
            </h2>
            <p
              className="mt-3 text-[16px] max-w-[460px]"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Üç dakikada hesap aç. Mahallendeki meslek sahibi kişilerle
              tanış, aracısız iletişime geç.
            </p>
          </div>
          <div className="sm:justify-self-end">
            <Link
              href="/kayit"
              className="btn-light h-12 px-7 rounded-full text-[15px]"
            >
              Ücretsiz hesap aç
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
