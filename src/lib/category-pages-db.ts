// Kategori landing sayfaları için DB erişim katmanı (CategoryPage tablosu).
// İçerik artık koddan (category-pages.ts) değil admin panelinden yönetilen DB'den gelir.
// `soruEki` gibi saf yardımcılar hâlâ category-pages.ts'te kalır.
import { prisma } from "@/lib/db";
import type { CategoryFaq, CategoryGuidePoint } from "@/lib/category-pages";

export type DbCategoryPage = {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  bodyContent: string | null;
  guideTitle: string;
  guidePoints: CategoryGuidePoint[];
  emptyState: string;
  faqs: CategoryFaq[];
  coverImageKey: string | null;
};

type Row = {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  bodyContent: string | null;
  guideTitle: string;
  guidePoints: unknown;
  emptyState: string;
  faqs: unknown;
  coverImageKey: string | null;
};

function toModel(r: Row): DbCategoryPage {
  return {
    id: r.id,
    slug: r.slug,
    categorySlug: r.categorySlug,
    name: r.name,
    h1: r.h1,
    metaTitle: r.metaTitle,
    metaDescription: r.metaDescription,
    intro: r.intro,
    bodyContent: r.bodyContent,
    guideTitle: r.guideTitle,
    guidePoints: Array.isArray(r.guidePoints)
      ? (r.guidePoints as CategoryGuidePoint[])
      : [],
    emptyState: r.emptyState,
    faqs: Array.isArray(r.faqs) ? (r.faqs as CategoryFaq[]) : [],
    coverImageKey: r.coverImageKey,
  };
}

/** Tek yayınlanmış kategori sayfası (slug ile). Yoksa null. */
export async function getCategoryPageBySlug(
  slug: string,
): Promise<DbCategoryPage | null> {
  const row = await prisma.categoryPage.findFirst({
    where: { slug, isPublished: true },
  });
  return row ? toModel(row as Row) : null;
}

/** Yayınlanmış tüm sayfalar, sıraya göre. */
export async function getPublishedCategoryPages(): Promise<DbCategoryPage[]> {
  const rows = await prisma.categoryPage.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => toModel(r as Row));
}

/** Sitemap için yayınlanmış slug listesi. */
export async function getPublishedCategoryPageSlugs(): Promise<string[]> {
  const rows = await prisma.categoryPage.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
