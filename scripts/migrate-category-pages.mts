// Tek seferlik taşıma: koddaki CATEGORY_PAGES → DB (CategoryPage tablosu).
// Idempotent: var olan slug'a DOKUNMAZ (admin düzenlemelerini ezmez).
// Çalıştır: npx tsx scripts/migrate-category-pages.mts
import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { CATEGORY_PAGES, CATEGORY_PAGE_SLUGS } from "../src/lib/category-pages";

const prisma = new PrismaClient();

async function main() {
  let order = 0;
  let created = 0;
  for (const slug of CATEGORY_PAGE_SLUGS) {
    const c = CATEGORY_PAGES[slug];
    const res = await prisma.categoryPage.upsert({
      where: { slug: c.slug },
      update: {}, // varsa dokunma
      create: {
        slug: c.slug,
        categorySlug: c.categorySlug,
        name: c.name,
        h1: c.h1,
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
        intro: c.intro,
        guideTitle: c.guideTitle,
        guidePoints: c.guidePoints as unknown as Prisma.InputJsonValue,
        emptyState: c.emptyState,
        faqs: c.faqs as unknown as Prisma.InputJsonValue,
        isPublished: true,
        order: order,
      },
    });
    if (res.order === order) created++;
    order++;
  }
  const total = await prisma.categoryPage.count();
  console.log(`✓ İşlendi. DB'deki CategoryPage satır sayısı: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
