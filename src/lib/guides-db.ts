// Rehber yazıları için DB erişim katmanı (GuideArticle tablosu).
// İçerik artık koddan (guides.ts) değil admin panelinden yönetilen DB'den gelir.
// GUIDE_TOPICS (renkler), formatGuideDate ve tipler hâlâ guides.ts'te kalır.
import { prisma } from "@/lib/db";
import { getPublicUrl } from "@/lib/r2";
import {
  GUIDE_TOPICS,
  type Guide,
  type GuideSection,
  type GuideFaq,
  type GuideTopic,
  type GuideTopicSlug,
} from "@/lib/guides";

type Row = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  intro: string;
  topic: string;
  sections: unknown;
  faqs: unknown;
  relatedCategorySlugs: string[];
  coverImageKey: string | null;
  publishedAt: Date;
  updatedAt: Date;
};

function toGuide(r: Row): Guide {
  return {
    slug: r.slug,
    title: r.title,
    metaTitle: r.metaTitle,
    metaDescription: r.metaDescription,
    excerpt: r.excerpt,
    publishedAt: r.publishedAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    intro: r.intro,
    sections: Array.isArray(r.sections) ? (r.sections as GuideSection[]) : [],
    faqs: Array.isArray(r.faqs) ? (r.faqs as GuideFaq[]) : [],
    relatedCategorySlugs: r.relatedCategorySlugs,
    topic: (GUIDE_TOPICS[r.topic as GuideTopicSlug] ? r.topic : "genel") as GuideTopicSlug,
    coverImage: r.coverImageKey ? getPublicUrl(r.coverImageKey) : null,
  };
}

export async function getGuideArticleBySlug(slug: string): Promise<Guide | null> {
  const row = await prisma.guideArticle.findFirst({
    where: { slug, isPublished: true },
  });
  return row ? toGuide(row as Row) : null;
}

/** Yayınlanmış tüm rehberler, en yeni önce. */
export async function getAllGuideArticles(): Promise<Guide[]> {
  const rows = await prisma.guideArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((r) => toGuide(r as Row));
}

/** Belirli bir kategori sayfasıyla (/pendik/[slug]) ilgili rehberler. */
export async function getGuidesForCategoryDb(pageSlug: string): Promise<Guide[]> {
  const rows = await prisma.guideArticle.findMany({
    where: { isPublished: true, relatedCategorySlugs: { has: pageSlug } },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((r) => toGuide(r as Row));
}

/** Liste sayfası sol menüsü için: yalnızca rehberi olan konular + gerçek sayıları. */
export async function getTopicsWithCountsDb(): Promise<
  { topic: GuideTopic; count: number }[]
> {
  const rows = await prisma.guideArticle.findMany({
    where: { isPublished: true },
    select: { topic: true },
  });
  const counts = new Map<GuideTopicSlug, number>();
  for (const r of rows) {
    const t = (GUIDE_TOPICS[r.topic as GuideTopicSlug] ? r.topic : "genel") as GuideTopicSlug;
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return (Object.keys(GUIDE_TOPICS) as GuideTopicSlug[])
    .filter((slug) => counts.has(slug))
    .map((slug) => ({ topic: GUIDE_TOPICS[slug], count: counts.get(slug)! }));
}

/** Sitemap için yayınlanmış slug + güncelleme tarihi. */
export async function getPublishedGuideMetaDb(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  return prisma.guideArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, updatedAt: true },
  });
}
