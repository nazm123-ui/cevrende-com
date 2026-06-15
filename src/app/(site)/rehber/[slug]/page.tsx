import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGuide,
  GUIDE_SLUGS,
  GUIDE_TOPICS,
  formatGuideDate,
  type GuideSection,
  type GuideIcon,
} from "@/lib/guides";
import { CATEGORY_PAGES, CATEGORY_PAGE_SLUGS } from "@/lib/category-pages";
import { absoluteUrl, SITE_NAME } from "@/lib/site-url";
import { normalizeTr } from "@/lib/normalize-tr";

export const dynamic = "force-static";

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) {
    return { title: "Yazı bulunamadı", robots: { index: false, follow: false } };
  }
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: `/rehber/${g.slug}` },
    openGraph: {
      title: g.metaTitle,
      description: g.metaDescription,
      url: `/rehber/${g.slug}`,
      type: "article",
      publishedTime: g.publishedAt,
      modifiedTime: g.updatedAt,
    },
  };
}

function anchorId(s: string): string {
  return normalizeTr(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const topic = GUIDE_TOPICS[g.topic];
  const related = g.relatedCategorySlugs
    .map((s) => CATEGORY_PAGES[s])
    .filter(Boolean);

  // İlgili hizmetler: önce makalenin ilgili kategorileri, sonra diğerleriyle 4'e tamamla.
  const services = [
    ...related,
    ...CATEGORY_PAGE_SLUGS.filter(
      (s) => !related.some((r) => r.slug === s),
    ).map((s) => CATEGORY_PAGES[s]),
  ].slice(0, 4);

  const toc = [
    ...g.sections.map((s) => ({ id: anchorId(s.heading), label: s.heading })),
    { id: "sss", label: "Sıkça sorulan sorular" },
  ];

  const fullText = [
    g.intro,
    ...g.sections.flatMap((s) => [
      s.heading,
      ...(s.paragraphs ?? []),
      ...(s.bullets?.map((b) => `${b.title ?? ""} ${b.body}`) ?? []),
    ]),
  ].join(" ");
  const minutes = readingMinutes(fullText);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.metaDescription,
    datePublished: g.publishedAt,
    dateModified: g.updatedAt,
    inLanguage: "tr-TR",
    mainEntityOfPage: absoluteUrl(`/rehber/${g.slug}`),
    author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon-512.png") },
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: g.faqs.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Rehber", item: absoluteUrl("/rehber") },
      {
        "@type": "ListItem",
        position: 3,
        name: g.title,
        item: absoluteUrl(`/rehber/${g.slug}`),
      },
    ],
  };

  return (
    <div className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <article>
        {/* Hero */}
        <section className="pt-8 sm:pt-10">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
              <div>
                <nav className="text-[13px] text-ink-500 flex items-center gap-1.5 flex-wrap">
                  <Link href="/" className="hover:text-ink-900 transition">Ana sayfa</Link>
                  <span aria-hidden className="text-ink-400">/</span>
                  <Link href="/rehber" className="hover:text-ink-900 transition">Pendik Rehberi</Link>
                  <span aria-hidden className="text-ink-400">/</span>
                  <span className="text-ink-700">{topic.label}</span>
                </nav>

                <h1 className="u-balance mt-4 text-[30px] sm:text-[42px] font-semibold tracking-[-0.03em] leading-[1.1]">
                  {g.title}
                </h1>
                <p className="u-pretty mt-4 text-[15px] sm:text-[16.5px] text-ink-700 leading-[1.65] max-w-[560px]">
                  {g.intro}
                </p>

                {/* Yazar künyesi */}
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <div className="leading-tight">
                    <div className="text-[14px] font-medium text-ink-900">Cevrende Ekibi</div>
                    <div className="text-[12.5px] text-ink-500">
                      Son güncelleme: {formatGuideDate(g.updatedAt)} · {minutes} dk okuma
                    </div>
                  </div>
                </div>
              </div>

              {/* Kapak (görsel yoksa konuya göre degrade) */}
              <div
                className="relative h-48 sm:h-64 lg:h-72 w-full rounded-[20px] overflow-hidden order-first lg:order-last"
                style={
                  g.coverImage
                    ? undefined
                    : { backgroundImage: `linear-gradient(135deg, ${topic.from}, ${topic.to})` }
                }
              >
                {g.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.coverImage} alt={g.title} className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* İçerik + İçindekiler */}
        <section className="pt-10 pb-4">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
              {/* İçindekiler */}
              <aside className="lg:sticky lg:top-6 self-start">
                <div className="rounded-[14px] bg-ink-50 border border-ink-100 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-500 mb-2.5">
                    İçindekiler
                  </p>
                  <nav className="flex flex-col gap-1.5">
                    {toc.map((t) => (
                      <a
                        key={t.id}
                        href={`#${t.id}`}
                        className="text-[13.5px] text-ink-700 hover:text-accent-700 transition leading-snug"
                      >
                        {t.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Ana içerik */}
              <div className="max-w-[760px]">
                <div className="flex flex-col gap-10">
                  {g.sections.map((s) => (
                    <SectionBlock key={s.heading} section={s} id={anchorId(s.heading)} />
                  ))}
                </div>

                {/* SSS */}
                <div id="sss" className="scroll-mt-24 mt-12">
                  <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] mb-4">
                    Sıkça sorulan sorular
                  </h2>
                  <div className="flex flex-col gap-3">
                    {g.faqs.map((f) => (
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

                {/* CTA */}
                <div className="mt-12 rounded-[18px] bg-accent-700 text-white p-6 sm:p-8 overflow-hidden relative">
                  <div className="relative z-10 max-w-[460px]">
                    <h2 className="text-[22px] font-semibold tracking-[-0.015em]">
                      Pendik&apos;te hizmet mi veriyorsun?
                    </h2>
                    <p className="mt-2 text-[14.5px] text-white/80 leading-relaxed">
                      Kendi işinin sahibi ol, profilini oluştur ve Pendik&apos;teki
                      binlerce komşuna hizmet vererek işini büyüt.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href="/kayit" className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-white text-accent-700 text-[14.5px] font-medium hover:bg-white/90 transition">
                        Usta olarak kaydol
                      </Link>
                      <Link href="/cevrendekiler" className="inline-flex items-center justify-center h-11 px-5 rounded-full border border-white/40 text-white text-[14.5px] font-medium hover:bg-white/10 transition">
                        Hizmet verenlere bak
                      </Link>
                    </div>
                  </div>
                  <svg className="absolute right-4 bottom-2 text-white/15 hidden sm:block" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                    <path d="m21 3 1 11h-2" />
                    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                    <path d="M3 4h8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* İlgili Hizmetler */}
        {services.length > 0 && (
          <section className="pt-8 pb-24">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
              <div className="flex items-end justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-[22px] font-semibold tracking-[-0.015em]">İlgili Hizmetler</h2>
                  <p className="mt-1 text-[14px] text-ink-500">
                    Pendik&apos;te ihtiyacın olabilecek diğer kategoriler
                  </p>
                </div>
                <Link href="/cevrendekiler" className="text-[13.5px] text-accent-600 hover:text-accent-700 transition whitespace-nowrap">
                  Tümünü gör →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {services.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/pendik/${c.slug}`}
                    className="card-lift group flex flex-col items-center text-center rounded-[16px] border border-ink-100 bg-white p-5 hover:border-ink-300"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                      <CategoryIcon slug={c.categorySlug} />
                    </span>
                    <span className="mt-3 text-[14px] font-medium text-ink-900">{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

/* ---- Bölüm bloğu ---- */

function SectionBlock({ section: s, id }: { section: GuideSection; id: string }) {
  if (s.layout === "checklist") {
    return (
      <div id={id} className="scroll-mt-24 rounded-[18px] bg-ink-50 border border-ink-100 p-6 sm:p-7">
        <h2 className="text-[20px] sm:text-[23px] font-semibold tracking-[-0.015em]">{s.heading}</h2>
        {s.paragraphs?.map((p, i) => (
          <p key={i} className="mt-2 text-[14.5px] text-ink-700 leading-[1.65]">{p}</p>
        ))}
        {s.bullets && (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 list-none p-0 m-0">
            {s.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-ink-700 leading-[1.5]">
                <span className="mt-0.5 shrink-0 text-accent-600" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>{b.title && <span className="font-semibold text-ink-900">{b.title}: </span>}{b.body}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (s.layout === "features") {
    return (
      <div id={id} className="scroll-mt-24">
        <h2 className="text-[20px] sm:text-[23px] font-semibold tracking-[-0.015em] mb-3">{s.heading}</h2>
        {s.paragraphs?.map((p, i) => (
          <p key={i} className="text-[15.5px] text-ink-700 leading-[1.7] mb-4 last:mb-4">{p}</p>
        ))}
        {s.bullets && (
          <div className="grid gap-3 sm:grid-cols-3">
            {s.bullets.map((b, i) => (
              <div key={i} className="rounded-[14px] border border-ink-100 bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent-50 text-accent-700">
                  <FeatureIcon name={b.icon} />
                </span>
                {b.title && <h3 className="mt-3 text-[15px] font-semibold text-ink-900">{b.title}</h3>}
                <p className="mt-1.5 text-[13.5px] text-ink-700 leading-[1.55] m-0">{b.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (s.layout === "steps") {
    return (
      <div id={id} className="scroll-mt-24">
        <h2 className="text-[20px] sm:text-[23px] font-semibold tracking-[-0.015em] mb-3">{s.heading}</h2>
        {s.paragraphs?.map((p, i) => (
          <p key={i} className="text-[15.5px] text-ink-700 leading-[1.7] mb-4">{p}</p>
        ))}
        {s.bullets && (
          <ol className="flex flex-col gap-4 list-none p-0 m-0">
            {s.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white text-[13px] font-semibold tabular-nums">
                  {i + 1}
                </span>
                <p className="text-[15px] text-ink-700 leading-[1.6] m-0 pt-0.5">
                  {b.title && <span className="font-semibold text-ink-900">{b.title}. </span>}
                  {b.body}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  // prose (varsayılan)
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="text-[20px] sm:text-[23px] font-semibold tracking-[-0.015em] mb-3">{s.heading}</h2>
      {s.paragraphs?.map((p, i) => (
        <p key={i} className="text-[15.5px] text-ink-700 leading-[1.72] mb-3 last:mb-0">{p}</p>
      ))}
      {s.bullets && (
        <ul className="mt-3 flex flex-col gap-3 list-none p-0 m-0">
          {s.bullets.map((b, i) => (
            <li key={i} className="rounded-[12px] border border-ink-100 bg-white px-4 py-3 text-[15px] text-ink-700 leading-[1.6]">
              {b.title && <span className="font-semibold text-ink-900">{b.title}: </span>}
              {b.body}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---- İkonlar ---- */

function FeatureIcon({ name }: { name?: GuideIcon }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "camera":
      return (
        <svg {...common}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "wave":
      return (
        <svg {...common}>
          <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
          <path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
        </svg>
      );
    case "thermometer":
      return (
        <svg {...common}>
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.4-.6-.6-2.4z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
      );
  }
}

function CategoryIcon({ slug }: { slug: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (slug) {
    case "elektrikci":
      return <svg {...common}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>;
    case "tesisatci":
      return <svg {...common}><path d="M12 2s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z" /></svg>;
    case "boyaci":
      return <svg {...common}><rect x="3" y="4" width="12" height="6" rx="1" /><path d="M15 7h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-7v3" /><rect x="9" y="16" width="4" height="5" rx="1" /></svg>;
    case "insaat-tadilat":
      return <svg {...common}><path d="m15 12-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9" /><path d="M17.6 6.4 14 10l-2-2 3.6-3.6a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8z" /></svg>;
    case "cilingir":
      return <svg {...common}><circle cx="8" cy="9" r="5" /><path d="m11.5 12.5 8 8M16 17l2-2" /></svg>;
    case "marangoz":
      return <svg {...common}><rect x="3" y="7" width="18" height="10" rx="1" /><path d="M7 7v3M11 7v3M15 7v3M19 7v3" /></svg>;
    case "demirci-kaynakci":
      return <svg {...common}><path d="M12 2c1 4 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 2 2 2 0 0-2-2-3-2-5z" /></svg>;
    case "cekici-yol-yardim":
      return <svg {...common}><path d="M1 7h12v9H1z" /><path d="M13 10h4l3 3v3h-7z" /><circle cx="5.5" cy="18" r="1.6" /><circle cx="16.5" cy="18" r="1.6" /></svg>;
    default:
      return <svg {...common}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.4-.6-.6-2.4z" /></svg>;
  }
}
