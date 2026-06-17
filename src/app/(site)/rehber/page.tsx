import { formatGuideDate, GUIDE_TOPICS } from "@/lib/guides";
import {
  getAllGuideArticles,
  getTopicsWithCountsDb,
} from "@/lib/guides-db";
import { absoluteUrl } from "@/lib/site-url";
import GuideExplorer, {
  type GuideCard,
} from "@/components/rehber/GuideExplorer";

export const metadata = {
  title: "Rehber — Pendik'te Usta ve Hizmet Almak İçin İpuçları",
  description:
    "Pendik'te boyacı, elektrikçi ve diğer ustalardan hizmet alırken işine yarayacak pratik rehberler: doğru ustayı seçme, fiyat ve dikkat edilecekler.",
  alternates: { canonical: "/rehber" },
};

export const dynamic = "force-dynamic";

export default async function RehberIndexPage() {
  const guides = await getAllGuideArticles();
  const topics = (await getTopicsWithCountsDb()).map((t) => ({
    slug: t.topic.slug,
    label: t.topic.label,
    count: t.count,
  }));

  const cards: GuideCard[] = guides.map((g) => {
    const topic = GUIDE_TOPICS[g.topic];
    return {
      slug: g.slug,
      title: g.title,
      excerpt: g.excerpt,
      dateLabel: formatGuideDate(g.publishedAt),
      topicSlug: topic.slug,
      topicLabel: topic.label,
      from: topic.from,
      to: topic.to,
      coverImage: g.coverImage ?? null,
    };
  });

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: guides.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/rehber/${g.slug}`),
      name: g.title,
    })),
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />

      {/* Hero */}
      <section className="pt-10 sm:pt-14 pb-2">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <span className="inline-flex items-center gap-2 h-8 pl-2.5 pr-3.5 rounded-full bg-accent-50 text-accent-700 text-[12.5px] font-medium">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            </svg>
            Pendik&apos;te sahadan derlenen bilgiler
          </span>
          <h1 className="u-balance mt-4 text-[30px] sm:text-[42px] font-semibold tracking-[-0.03em] leading-[1.08] max-w-[760px]">
            Pendik&apos;te hizmet alırken işine yarayacak rehberler
          </h1>
          <p className="mt-4 text-[15px] sm:text-[17px] text-ink-700 leading-relaxed max-w-[620px]">
            Güvenilir usta seçimi, gerçekçi fiyat araştırması ve sorunsuz bir iş
            için bilmen gerekenleri sade bir dille topladık.
          </p>
        </div>
      </section>

      <GuideExplorer guides={cards} topics={topics} />
    </div>
  );
}
