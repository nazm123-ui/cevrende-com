import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";
import { getPublishedCategoryPageSlugs } from "@/lib/category-pages-db";
import { getPublishedGuideMetaDb } from "@/lib/guides-db";

export const revalidate = 3600; // 1 saat

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Statik sayfalar — değişim sıklığı ve önem skoruyla
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/cevrendekiler"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/kayit"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/giris"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/yardim"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/kullanim-kosullari"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/gizlilik"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/kvkk"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/geri-bildirim"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Kategori landing sayfaları (/pendik/[meslek]) — DB'den yayınlanmış sayfalar
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getPublishedCategoryPageSlugs();
    categoryPages = slugs.map((slug) => ({
      url: absoluteUrl(`/pendik/${slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.warn("[sitemap] category pages fetch failed:", err);
  }

  // Rehber içerikleri (/rehber + /rehber/[slug]) — DB'den
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/rehber"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];
  try {
    const guideMeta = await getPublishedGuideMetaDb();
    guidePages.push(
      ...guideMeta.map((g) => ({
        url: absoluteUrl(`/rehber/${g.slug}`),
        lastModified: g.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    );
  } catch (err) {
    console.warn("[sitemap] guide fetch failed:", err);
  }

  // Aktif işçi profilleri — sadece doğrulanmış + aktif + müsait
  let workerPages: MetadataRoute.Sitemap = [];
  try {
    const workers = await prisma.user.findMany({
      where: {
        isActive: true,
        isEmailVerified: true,
        professions: { isEmpty: false },
      },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000, // Sitemap 50k URL limiti, biz çok altında
    });
    workerPages = workers.map((w) => ({
      url: absoluteUrl(`/cevrendekiler/${w.id}`),
      lastModified: w.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.warn("[sitemap] worker fetch failed:", err);
  }

  return [...staticPages, ...categoryPages, ...guidePages, ...workerPages];
}

export { SITE_URL };
