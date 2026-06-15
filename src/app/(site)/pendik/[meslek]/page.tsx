import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getActiveWorkers } from "@/lib/workers";
import WorkerCard from "@/components/workers/WorkerCard";
import { soruEki } from "@/lib/category-pages";
import {
  getCategoryPageBySlug,
  getPublishedCategoryPages,
} from "@/lib/category-pages-db";
import { getGuidesForCategory, GUIDE_TOPICS } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-url";
import { getPublicUrl } from "@/lib/r2";

// Dinamik render: hizmet veren listesi her istekte canlı veriden gelir.
// Geçerli slug'lar config (getCategoryPage) ile sınırlanır; gerisi notFound.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ meslek: string }>;
}) {
  const { meslek } = await params;
  const cfg = await getCategoryPageBySlug(meslek);
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
      ...(cfg.coverImageKey
        ? { images: [{ url: getPublicUrl(cfg.coverImageKey) }] }
        : {}),
    },
  };
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Promise<{ meslek: string }>;
}) {
  const { meslek } = await params;
  const cfg = await getCategoryPageBySlug(meslek);
  if (!cfg) notFound();

  const [user, result, categories, allPages] = await Promise.all([
    getCurrentUser(),
    getActiveWorkers({ profession: cfg.categorySlug }),
    prisma.jobCategory.findMany({
      where: { isActive: true },
      select: { slug: true, name: true },
    }),
    getPublishedCategoryPages(),
  ]);
  const { workers } = result;
  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));
  const canContact = !!user && user.isEmailVerified;

  const others = allPages.filter((p) => p.slug !== cfg.slug);
  const relatedGuides = getGuidesForCategory(cfg.slug);
  const nameLower = cfg.name.toLocaleLowerCase("tr");

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section className="pt-8">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <nav className="text-[13px] text-ink-500 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-ink-900 transition">Ana sayfa</Link>
            <span aria-hidden className="text-ink-400">/</span>
            <Link href="/cevrendekiler" className="hover:text-ink-900 transition">Çevrendekiler</Link>
            <span aria-hidden className="text-ink-400">/</span>
            <span className="text-ink-700">{cfg.name}</span>
          </nav>

          <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
            <div className="max-w-[680px]">
              <h1 className="u-balance text-[28px] sm:text-[40px] font-semibold tracking-[-0.03em] leading-[1.1]">
                {cfg.h1}
              </h1>
              <p className="u-pretty mt-3 text-[15px] sm:text-[16px] text-ink-700 leading-relaxed">
                {cfg.intro}
              </p>
            </div>
            {workers.length > 0 && (
              <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-accent-50 text-accent-700 text-[13px] font-medium whitespace-nowrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                {workers.length} kayıtlı usta
              </span>
            )}
          </div>

          {cfg.coverImageKey && (
            <div className="mt-6 rounded-[18px] overflow-hidden border border-ink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPublicUrl(cfg.coverImageKey)}
                alt={cfg.h1}
                className="w-full h-48 sm:h-64 object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Hizmet veren listesi */}
      <section className="pt-10 pb-4">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
              Pendik&apos;te {nameLower} ilanları
            </h2>
            <Link
              href={`/cevrendekiler?meslek=${cfg.categorySlug}`}
              className="inline-flex items-center gap-1.5 text-[13.5px] text-ink-500 hover:text-ink-900 transition whitespace-nowrap"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <path d="M3 5h18M6 12h12M10 19h4" />
              </svg>
              Filtrele
            </Link>
          </div>

          {workers.length === 0 ? (
            <div className="px-6 py-14 text-center border border-dashed border-ink-200 rounded-[16px] flex flex-col items-center gap-3">
              <p className="text-ink-700 text-[15px] max-w-md leading-relaxed">
                {cfg.emptyState}
              </p>
              <Link href="/kayit" className="btn-ink h-11 px-6 rounded-full text-[14px] mt-1">
                Ücretsiz profil oluştur
              </Link>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
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

      {/* Rehber — nelere dikkat etmeli (vurgulu kutu) */}
      <section className="pt-8 pb-4">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="rounded-[22px] bg-accent-50 p-6 sm:p-10">
            <h2 className="u-balance text-center text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] max-w-[640px] mx-auto">
              {cfg.guideTitle}
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cfg.guidePoints.map((p, i) => (
                <div key={p.title} className="card-lift rounded-[16px] bg-white border border-ink-100 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-accent-50 text-accent-700">
                    <GuidePointIcon index={i} />
                  </span>
                  <h3 className="mt-3.5 text-[16px] font-semibold tracking-[-0.01em] text-ink-900">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] text-ink-700 leading-[1.55] m-0">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="pt-10 pb-4">
        <div className="mx-auto max-w-[760px] px-5 sm:px-6">
          <h2 className="text-center text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] mb-6">
            Sıkça sorulan sorular
          </h2>
          <div className="flex flex-col gap-3">
            {cfg.faqs.map((f) => (
              <details key={f.q} className="faq-item group rounded-[14px] border border-ink-100 bg-white px-5 py-4">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-[15px] font-medium text-ink-900">
                  {f.q}
                  <span aria-hidden className="text-ink-400 transition group-open:rotate-45 text-[20px] leading-none">+</span>
                </summary>
                <p className="mt-3 text-[14.5px] text-ink-700 leading-relaxed m-0">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-8 pb-4">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="rounded-[18px] bg-accent-700 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.015em]">
                {cfg.name} {soruEki(cfg.name)}?
              </h2>
              <p className="mt-1.5 text-[14.5px] text-white/80 leading-relaxed max-w-[480px]">
                Ücretsiz profil oluştur, Pendik&apos;te seni arayan insanlar
                doğrudan sana ulaşsın. Komisyon yok, aracı yok.
              </p>
            </div>
            <Link
              href="/kayit"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-accent-700 text-[15px] font-medium hover:bg-white/90 transition shrink-0 whitespace-nowrap"
            >
              Ücretsiz profil oluştur
            </Link>
          </div>
        </div>
      </section>

      {/* İlgili rehber + diğer hizmetler */}
      <section className="pt-8 pb-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          {relatedGuides.length > 0 && (
            <div className="mb-8">
              <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-500 mb-3">
                İlgili rehber
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {relatedGuides.map((g) => {
                  const gt = GUIDE_TOPICS[g.topic];
                  return (
                    <Link
                      key={g.slug}
                      href={`/rehber/${g.slug}`}
                      className="card-lift group flex flex-col rounded-[14px] border border-ink-100 bg-white overflow-hidden hover:border-ink-300"
                    >
                      <div className="h-20 w-full" style={{ backgroundImage: `linear-gradient(135deg, ${gt.from}, ${gt.to})` }} />
                      <div className="p-3.5">
                        <h3 className="text-[14px] font-semibold leading-snug text-ink-900 line-clamp-3">
                          {g.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

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
      </section>
    </div>
  );
}

/* ---- Rehber maddesi ikonu (index'e göre döner) ---- */
function GuidePointIcon({ index }: { index: number }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const icons = [
    // rozet-tik (referans/güven)
    <svg key="0" {...common}><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>,
    // kontrol listesi (malzeme/kalite)
    <svg key="1" {...common}><path d="M9 5h11M9 12h11M9 19h11" /><path d="M4 5h.01M4 12h.01M4 19h.01" /></svg>,
    // saat (süre/teslim)
    <svg key="2" {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
    // konum (mahalle/yakınlık)
    <svg key="3" {...common}><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z" /><circle cx="12" cy="9" r="2.4" /></svg>,
    // sohbet (iletişim)
    <svg key="4" {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    // kalkan (güvenlik)
    <svg key="5" {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>,
  ];
  return icons[index % icons.length];
}
