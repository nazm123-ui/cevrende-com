import Link from "next/link";
import { prisma } from "@/lib/db";
import { getProfessionCounts } from "@/lib/workers";
import QuickSearchCard from "@/components/home/QuickSearchCard";

export default async function Hero() {
  const [withCounts, categories] = await Promise.all([
    getProfessionCounts(),
    prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 8,
      select: { slug: true, name: true },
    }),
  ]);
  const popular =
    withCounts.length > 0
      ? withCounts.sort((a, b) => b.count - a.count).slice(0, 8)
      : categories.map((c) => ({ ...c, count: 0 }));
  const total = withCounts.reduce((sum, p) => sum + p.count, 0);

  return (
    <section className="pt-16 sm:pt-20 pb-12 sm:pb-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 grid items-center gap-10 lg:gap-16 lg:grid-cols-[1.15fr_0.95fr]">
        <div>
          <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
            Pendik · Tuzla · Kartal
          </p>

          <h1 className="mt-4 text-[42px] sm:text-[56px] lg:text-[64px] font-semibold tracking-[-0.035em] leading-[1.02] text-balance max-w-[560px]">
            Pendik'te mahallenden usta bul,
            <br />
            <span className="text-accent-600">aracısız iletişim kur.</span>
          </h1>

          <p className="mt-6 text-[17px] sm:text-lg text-ink-700 max-w-[480px] leading-relaxed">
            Pendik ve çevresinde meslek sahibi kişilerle aracısız tanış.
            Profilini aç, çevrendekilerin seni bulmasını sağla.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/iscilar"
              className="btn-ink h-12 px-6 rounded-full text-[15px]"
            >
              Çevrendekileri gör
              <ArrowRight />
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

        <div>
          <QuickSearchCard popular={popular} totalCount={total} />
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
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
