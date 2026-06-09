import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";
import { CATEGORY_PAGE_SLUGS } from "@/lib/category-pages";
import { getAllGuides } from "@/lib/guides";

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

  // Kategori landing sayfaları (/pendik/[meslek]) — elle hazırlanmış SEO sayfaları
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_PAGE_SLUGS.map((slug) => ({
    url: absoluteUrl(`/pendik/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Rehber içerikleri (/rehber + /rehber/[slug])
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/rehber"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    ...getAllGuides().map((g) => ({
      url: absoluteUrl(`/rehber/${g.slug}`),
      lastModified: new Date(g.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

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
