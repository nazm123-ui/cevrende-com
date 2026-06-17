// Tek seferlik taşıma: koddaki GUIDES → DB (GuideArticle tablosu).
// Idempotent: var olan slug'a DOKUNMAZ (admin düzenlemelerini ezmez).
// Çalıştır: npx tsx scripts/migrate-guides.mts
import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { GUIDES, GUIDE_SLUGS } from "../src/lib/guides";

const prisma = new PrismaClient();

async function main() {
  let order = 0;
  for (const slug of GUIDE_SLUGS) {
    const g = GUIDES[slug];
    await prisma.guideArticle.upsert({
      where: { slug: g.slug },
      update: {}, // varsa dokunma
      create: {
        slug: g.slug,
        title: g.title,
        metaTitle: g.metaTitle,
        metaDescription: g.metaDescription,
        excerpt: g.excerpt,
        intro: g.intro,
        topic: g.topic,
        sections: g.sections as unknown as Prisma.InputJsonValue,
        faqs: g.faqs as unknown as Prisma.InputJsonValue,
        relatedCategorySlugs: g.relatedCategorySlugs,
        isPublished: true,
        publishedAt: new Date(g.publishedAt),
        order: order,
      },
    });
    order++;
  }
  const total = await prisma.guideArticle.count();
  console.log(`✓ İşlendi. DB'deki GuideArticle satır sayısı: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
