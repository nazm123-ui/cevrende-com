import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getActiveWorkers } from "@/lib/workers";
import WorkerCard from "@/components/workers/WorkerCard";
import {
  getCategoryPage,
  CATEGORY_PAGES,
  CATEGORY_PAGE_SLUGS,
  soruEki,
} from "@/lib/category-pages";
import { getGuidesForCategory } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-url";

// Dinamik render: hizmet veren listesi her istekte canlı veriden gelir.
// Geçerli slug'lar config (getCategoryPage) ile sınırlanır; gerisi notFound.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ meslek: string }>;
}) {
  const { meslek } = await params;
  const cfg = getCategoryPage(meslek);
  if (!cfg) {
    return { title: "Sayfa bulunamadı", robots: { index: false, follow: false } };
  }
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: { canonical: `/pendik/${cfg.slug}` },
    openGraph: {
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      url: `/pendik/${cfg.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Promise<{ meslek: string }>;
}) {
  const { meslek } = await params;
  const cfg = getCategoryPage(meslek);
  if (!cfg) notFound();

  const [user, result, categories] = await Promise.all([
    getCurrentUser(),
    getActiveWorkers({ profession: cfg.categorySlug }),
    prisma.jobCategory.findMany({
      where: { isActive: true },
      select: { slug: true, name: true },
    }),
  ]);
  const { workers } = result;
  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));
  const canContact = !!user && user.isEmailVerified;

  const others = CATEGORY_PAGE_SLUGS.filter((s) => s !== cfg.slug).map(
    (s) => CATEGORY_PAGES[s],
  );
  const relatedGuides = getGuidesForCategory(cfg.categorySlug);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cfg.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana sayfa", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Çevrendekiler",
        item: absoluteUrl("/cevrendekiler"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cfg.h1,
        item: absoluteUrl(`/pendik/${cfg.slug}`),
      },
    ],
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb + başlık */}
      <section className="pt-8">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <nav className="text-[13px] text-ink-500 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-ink-900 transition">
              Ana sayfa
            </Link>
            <span aria-hidden className="text-ink-400">
              /
            </span>
            <Link href="/cevrendekiler" className="hover:text-ink-900 transition">
              Çevrendekiler
            </Link>
            <span aria-hidden className="text-ink-400">
              /
            </span>
            <span className="text-ink-700">{cfg.name}</span>
          </nav>

          <h1 className="mt-4 text-[28px] sm:text-[38px] font-semibold tracking-[-0.025em] leading-[1.12]">
            {cfg.h1}
          </h1>
          <p className="mt-3 text-[15px] sm:text-[16px] text-ink-700 leading-relaxed max-w-[680px]">
            {cfg.intro}
          </p>
        </div>
      </section>

      {/* Hizmet veren listesi */}
      <section className="pt-10 pb-4">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
              Pendik&apos;te {cfg.name.toLocaleLowerCase("tr")} ilanları
            </h2>
            <Link
              href={`/cevrendekiler?meslek=${cfg.categorySlug}`}
              className="text-[13.5px] text-ink-500 hover:text-ink-900 transition whitespace-nowrap"
            >
              Tümünü filtrele →
            </Link>
          </div>

          {workers.length === 0 ? (
            <div className="px-6 py-12 text-center border border-dashed border-ink-200 rounded-[14px] flex flex-col items-center gap-3">
              <p className="text-ink-700 text-[15px] max-w-md leading-relaxed">
                {cfg.emptyState}
              </p>
              <Link
                href="/kayit"
                className="btn-ink h-11 px-6 rounded-full text-[14px] mt-1"
              >
                Ücretsiz profil oluştur
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {workers.map((w) => (
                <li key={w.id}>
                  <WorkerCard
                    worker={w}
                    categoryNameBySlug={categoryNameBySlug}
                    canContact={canContact}
                    isSelf={user?.id === w.id}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Rehber */}
      <section className="pt-8 pb-4">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <h2 className="text-[22px] font-semibold tracking-[-0.015em] mb-5">
            {cfg.guideTitle}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {cfg.guidePoints.map((p) => (
              <div
                key={p.title}
                className="rounded-[14px] border border-ink-100 bg-white p-5"
              >
                <h3 className="text-[15px] font-semibold mb-1.5">{p.title}</h3>
                <p className="text-[14px] text-ink-700 leading-relaxed m-0">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="pt-8 pb-4">
        <div className="mx-auto max-w-[760px] px-5 sm:px-6">
          <h2 className="text-[22px] font-semibold tracking-[-0.015em] mb-5">
            Sık sorulan sorular
          </h2>
          <div className="flex flex-col gap-3">
            {cfg.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-[14px] border border-ink-100 bg-white px-5 py-4"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-[15px] font-medium text-ink-900">
                  {f.q}
                  <span
                    aria-hidden
                    className="text-ink-400 transition group-open:rotate-45 text-[20px] leading-none"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[14px] text-ink-700 leading-relaxed m-0">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + diğer hizmetler */}
      <section className="pt-8 pb-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="rounded-[16px] border border-ink-100 bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-[19px] font-semibold tracking-[-0.01em]">
                {cfg.name} {soruEki(cfg.name)}?
              </h2>
              <p className="mt-1 text-[14.5px] text-ink-700 leading-relaxed max-w-[480px]">
                Ücretsiz profil oluştur, Pendik&apos;te seni arayan insanlar
                doğrudan sana ulaşsın. Komisyon yok, aracı yok.
              </p>
            </div>
            <Link
              href="/kayit"
              className="btn-ink h-12 px-6 rounded-full text-[15px] shrink-0 whitespace-nowrap"
            >
              Ücretsiz profil oluştur
            </Link>
          </div>

          {relatedGuides.length > 0 && (
            <div className="mt-8">
              <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-500 mb-3">
                İlgili rehber
              </p>
              <div className="flex flex-col gap-2">
                {relatedGuides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/rehber/${g.slug}`}
                    className="inline-flex items-center gap-2 text-[15px] text-accent-600 hover:text-accent-700 transition"
                  >
                    <span aria-hidden>→</span> {g.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-500 mb-3">
              Diğer hizmetler
            </p>
            <div className="flex flex-wrap gap-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/pendik/${o.slug}`}
                  className="inline-flex items-center h-10 px-4 rounded-full border border-ink-200 bg-white text-[14px] text-ink-700 hover:border-ink-900 hover:text-ink-900 transition"
                >
                  {o.h1}
                </Link>
              ))}
              <Link
                href="/cevrendekiler"
                className="inline-flex items-center h-10 px-4 rounded-full border border-ink-200 bg-white text-[14px] text-ink-700 hover:border-ink-900 hover:text-ink-900 transition"
              >
                Tüm hizmet verenler
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
