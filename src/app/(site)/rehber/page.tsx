import Link from "next/link";
import { getAllGuides, formatGuideDate } from "@/lib/guides";

export const metadata = {
  title: "Rehber — Pendik'te Usta ve Hizmet Almak İçin İpuçları",
  description:
    "Pendik'te boyacı, elektrikçi ve diğer ustalardan hizmet alırken işine yarayacak pratik rehberler: doğru ustayı seçme, fiyat ve dikkat edilecekler.",
  alternates: { canonical: "/rehber" },
};

export const dynamic = "force-static";

export default function RehberIndexPage() {
  const guides = getAllGuides();

  return (
    <div className="page">
      <section className="pt-10 pb-4">
        <div className="mx-auto max-w-[760px] px-5 sm:px-6">
          <div className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium mb-2.5">
            Rehber
          </div>
          <h1 className="text-[28px] sm:text-[38px] font-semibold tracking-[-0.025em] leading-[1.12]">
            Pendik&apos;te hizmet alırken işine yarayacak rehberler
          </h1>
          <p className="mt-3 text-[15px] sm:text-[16px] text-ink-700 leading-relaxed">
            Doğru ustayı seçmek, gerçekçi fiyat almak ve sorunsuz bir iş için
            bilmen gerekenleri sade bir dille topladık.
          </p>
        </div>
      </section>

      <section className="pt-6 pb-24">
        <div className="mx-auto max-w-[760px] px-5 sm:px-6 flex flex-col gap-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/rehber/${g.slug}`}
              className="block rounded-[14px] border border-ink-100 bg-white p-5 sm:p-6 hover:border-ink-700 transition"
            >
              <div className="font-mono text-[12px] text-ink-500 mb-2">
                {formatGuideDate(g.publishedAt)}
              </div>
              <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.01em] leading-snug">
                {g.title}
              </h2>
              <p className="mt-2 text-[14.5px] text-ink-700 leading-relaxed">
                {g.excerpt}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[14px] text-accent-600">
                Oku
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
