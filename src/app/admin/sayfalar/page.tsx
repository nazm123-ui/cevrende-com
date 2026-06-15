import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import CategoryPagesClient from "./CategoryPagesClient";

export const metadata = { title: "Kategori Sayfaları — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCategoryPagesPage() {
  await requireAdmin();
  const pages = await prisma.categoryPage.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      categorySlug: true,
      isPublished: true,
      order: true,
      updatedAt: true,
    },
  });
  return (
    <CategoryPagesClient
      initial={pages.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        categorySlug: p.categorySlug,
        isPublished: p.isPublished,
        order: p.order,
        updatedAt: p.updatedAt.toISOString(),
      }))}
    />
  );
}
