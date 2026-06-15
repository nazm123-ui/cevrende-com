import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGuide,
  getAllGuides,
  GUIDE_SLUGS,
  GUIDE_TOPICS,
  formatGuideDate,
} from "@/lib/guides";
import { CATEGORY_PAGES } from "@/lib/category-pages";
import { absoluteUrl, SITE_NAME } from "@/lib/site-url";

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

// Yaklaşık okuma süresi (dürüst, metinden hesaplanır).
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
  const otherGuides = getAllGuides()
    .filter((x) => x.slug !== g.slug)
    .slice(0, 3);

  const fullText = [
    g.intro,
    ...g.sections.flatMap((s) => [
      s.heading,
      ...(s.paragraphs ?? []),
      ...(s.bullets?.map((b) => `${b.title ?? ""} ${b.body}`) ?? []),
    ]),
  ].join(" ");
  const minutes = readingMinutes(fullText);
  const updated = g.updatedAt && g.updatedAt !== g.publishedAt;

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article>
        {/* Breadcrumb + başlık */}
        <section className="pt-8">
          <div className="mx-auto max-w-[760px] px-5 sm:px-6">
            <nav className="text-[13px] text-ink-500 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-ink-900 transition">
                Ana sayfa
              </Link>
              <span aria-hidden className="text-ink-400">/</span>
              <Link href="/rehber" className="hover:text-ink-900 transition">
                Rehber
              </Link>
              <span aria-hidden className="text-ink-400">/</span>
              <span className="text-ink-700">{topic.label}</span>
            </nav>

            <span
              className="mt-5 inline-flex items-center h-7 px-3 rounded-full text-[12.5px] font-medium text-white"
              style={{ backgroundColor: topic.to }}
            >
              {topic.label}
            </span>

            <h1 className="mt-3 text-[28px] sm:text-[40px] font-semibold tracking-[-0.03em] leading-[1.12]">
              {g.title}
            </h1>
            <div className="mt-3.5 flex items-center gap-2.5 flex-wrap font-mono text-[12.5px] text-ink-500">
              <span>{formatGuideDate(g.publishedAt)}</span>
              {updated && (
                <>
                  <span aria-hidden className="text-ink-300">·</span>
                  <span>Güncellendi {formatGuideDate(g.updatedAt)}</span>
                </>
              )}
              <span aria-hidden className="text-ink-300">·</span>
              <span>{minutes} dk okuma</span>
            </div>
          </div>
        </section>

        {/* Kapak bandı (görsel yoksa konuya göre degrade) */}
        <section className="pt-6">
          <div className="mx-auto max-w-[760px] px-5 sm:px-6">
            <div
              className="relative h-40 sm:h-56 w-full rounded-[18px] overflow-hidden"
              style={
                g.coverImage
                  ? undefined
                  : { backgroundImage: `linear-gradient(135deg, ${topic.from}, ${topic.to})` }
              }
            >
              {g.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.coverImage}
                  alt={g.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </section>

        {/* Giriş + bölümler */}
        <section className="pt-8 pb-4">
          <div className="mx-auto max-w-[760px] px-5 sm:px-6">
            <p className="text-[16px] sm:text-[17.5px] text-ink-800 leading-[1.7] font-[450]">
              {g.intro}
            </p>

            <div className="mt-8 flex flex-col gap-8">
              {g.sections.map((s) => (
                <div key={s.heading}>
                  <h2 className="text-[20px] sm:text-[23px] font-semibold tracking-[-0.015em] mb-3">
                    {s.heading}
                  </h2>
                  {s.paragraphs?.map((p, i) => (
                    <p
                      key={i}
                      className="text-[15.5px] text-ink-700 leading-[1.72] mb-3 last:mb-0"
                    >
                      {p}
                    </p>
                  ))}
                  {s.bullets && (
                    <ul className="mt-3 flex flex-col gap-3 list-none p-0 m-0">
                      {s.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="rounded-[12px] border border-ink-100 bg-white px-4 py-3 text-[15px] text-ink-700 leading-[1.6]"
                        >
                          {b.title && (
                            <span className="font-semibold text-ink-900">
                              {b.title}:{" "}
                            </span>
                          )}
                          {b.body}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SSS */}
        <section className="pt-6 pb-4">
          <div className="mx-auto max-w-[760px] px-5 sm:px-6">
            <h2 className="text-[20px] sm:text-[23px] font-semibold tracking-[-0.015em] mb-4">
              Sık sorulan sorular
            </h2>
            <div className="flex flex-col gap-3">
              {g.faqs.map((f) => (
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
                  <p className="mt-3 text-[14.5px] text-ink-700 leading-relaxed m-0">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* İlgili hizmetler + CTA */}
        <section className="pt-6 pb-4">
          <div className="mx-auto max-w-[760px] px-5 sm:px-6">
            {related.length > 0 && (
              <div className="rounded-[16px] border border-ink-100 bg-white p-6">
                <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-500 mb-3">
                  İlgili hizmetler
                </p>
                <div className="flex flex-wrap gap-2">
                  {related.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/pendik/${c.slug}`}
                      className="inline-flex items-center h-10 px-4 rounded-full border border-ink-200 bg-white text-[14px] text-ink-700 hover:border-ink-900 hover:text-ink-900 transition"
                    >
                      {c.h1}
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
            )}

            <div className="mt-6 rounded-[16px] bg-accent-700 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.01em]">
                  Pendik&apos;te hizmet mi veriyorsun?
                </h2>
                <p className="mt-1 text-[14.5px] text-white/80 leading-relaxed max-w-[460px]">
                  Ücretsiz profil oluştur, çevrendeki insanlar sana doğrudan
                  ulaşsın. Komisyon yok, aracı yok.
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

        {/* Diğer rehberler */}
        {otherGuides.length > 0 && (
          <section className="pt-6 pb-24">
            <div className="mx-auto max-w-[760px] px-5 sm:px-6">
              <h2 className="text-[18px] font-semibold tracking-[-0.01em] mb-4">
                Diğer rehberler
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {otherGuides.map((o) => {
                  const ot = GUIDE_TOPICS[o.topic];
                  return (
                    <Link
                      key={o.slug}
                      href={`/rehber/${o.slug}`}
                      className="group flex flex-col rounded-[14px] border border-ink-100 bg-white overflow-hidden hover:border-ink-300 transition"
                    >
                      <div
                        className="h-20 w-full"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${ot.from}, ${ot.to})`,
                        }}
                      />
                      <div className="p-3.5">
                        <h3 className="text-[14px] font-semibold leading-snug text-ink-900 line-clamp-3">
                          {o.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
