import Link from "next/link";
import { prisma } from "@/lib/db";
import { getProfessionCounts } from "@/lib/workers";
import { getCurrentUser } from "@/lib/auth";
import { getEnabledDistricts, formatDistrictListTr } from "@/lib/districts";
import QuickSearchCard from "@/components/home/QuickSearchCard";

export default async function Hero() {
  const [withCounts, allCategories, user, districts] = await Promise.all([
    getProfessionCounts(),
    prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { slug: true, name: true },
    }),
    getCurrentUser(),
    getEnabledDistricts(),
  ]);
  const districtLabel = formatDistrictListTr(districts.map((d) => d.name));
  const popular =
    withCounts.length > 0
      ? withCounts.sort((a, b) => b.count - a.count).slice(0, 8)
      : allCategories.slice(0, 8).map((c) => ({ ...c, count: 0 }));
  const total = withCounts.reduce((sum, p) => sum + p.count, 0);

  return (
    <section className="pt-10 sm:pt-20 pb-12 sm:pb-16 overflow-hidden">
      <div className="hero-split mx-auto max-w-[1200px] px-5 sm:px-6 grid items-center gap-10 lg:gap-16 lg:grid-cols-[1.15fr_0.95fr]">
        <div className="min-w-0">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
            {districtLabel}
          </p>

          <h1 className="mt-4 text-[26px] sm:text-[44px] lg:text-[60px] font-semibold tracking-[-0.025em] leading-[1.12] sm:leading-[1.05] lg:max-w-[560px] text-balance">
            Çevrendekiler{" "}
            <span className="text-accent-600">seni bulsun.</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-[15px] sm:text-lg text-ink-700 lg:max-w-[480px] leading-relaxed">
            Profilini aç, mesleğini ve mahalleni yaz — {districtLabel} çevresindeki insanlar sana doğrudan ulaşsın. Ücretsiz, komisyonsuz ve aracısız.
          </p>

          {!user && (
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <Link
                href="/kayit"
                className="btn-ink h-12 px-6 rounded-full text-[15px] w-full sm:w-auto"
              >
                Ücretsiz profil oluştur
                <ArrowRight />
              </Link>
              <Link
                href="/cevrendekiler"
                className="inline-flex items-center gap-1.5 text-[14px] text-ink-700 hover:text-ink-900 transition self-start sm:self-auto group"
              >
                <span className="underline underline-offset-[6px] decoration-ink-300 group-hover:decoration-ink-900 transition">
                  Çevrendeki hizmet verenleri gör
                </span>
                <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          )}

          <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-500">
            <Trait>Ücretsiz</Trait>
            <Trait>Komisyonsuz</Trait>
            <Trait>Doğrudan iletişim</Trait>
          </div>
        </div>

        <div className="min-w-0">
          <QuickSearchCard
            popular={popular}
            totalCount={total}
            allCategories={allCategories}
            districts={districts.map((d) => ({
              slug: d.slug,
              name: d.name,
              neighborhoods: d.neighborhoods,
            }))}
          />
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
