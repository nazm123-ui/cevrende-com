import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGuide,
  GUIDE_SLUGS,
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

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const related = g.relatedCategorySlugs
    .map((s) => CATEGORY_PAGES[s])
    .filter(Boolean);

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
              <span aria-hidden className="text-ink-400">
                /
              </span>
              <Link href="/rehber" className="hover:text-ink-900 transition">
                Rehber
              </Link>
            </nav>

            <h1 className="mt-4 text-[28px] sm:text-[38px] font-semibold tracking-[-0.025em] leading-[1.14]">
              {g.title}
            </h1>
            <div className="mt-3 font-mono text-[12.5px] text-ink-500">
              {formatGuideDate(g.publishedAt)} · {SITE_NAME}
            </div>
            <p className="mt-5 text-[16px] sm:text-[17px] text-ink-700 leading-[1.65]">
              {g.intro}
            </p>
          </div>
        </section>

        {/* Bölümler */}
        <section className="pt-8 pb-4">
          <div className="mx-auto max-w-[760px] px-5 sm:px-6 flex flex-col gap-8">
            {g.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.015em] mb-3">
                  {s.heading}
                </h2>
                {s.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="text-[15.5px] text-ink-700 leading-[1.7] mb-3 last:mb-0"
                  >
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-2 flex flex-col gap-2.5 list-none p-0 m-0">
                    {s.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="text-[15px] text-ink-700 leading-[1.6] pl-4 border-l-2 border-ink-100"
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
        </section>

        {/* SSS */}
        <section className="pt-6 pb-4">
          <div className="mx-auto max-w-[760px] px-5 sm:px-6">
            <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.015em] mb-4">
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
        <section className="pt-6 pb-24">
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

            <div className="mt-6 rounded-[16px] border border-ink-100 bg-ink-50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.01em]">
                  Pendik&apos;te hizmet mi veriyorsun?
                </h2>
                <p className="mt-1 text-[14.5px] text-ink-700 leading-relaxed max-w-[460px]">
                  Ücretsiz profil oluştur, çevrendeki insanlar sana doğrudan
                  ulaşsın. Komisyon yok, aracı yok.
                </p>
              </div>
              <Link
                href="/kayit"
                className="btn-ink h-12 px-6 rounded-full text-[15px] shrink-0 whitespace-nowrap"
              >
                Ücretsiz profil oluştur
              </Link>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
