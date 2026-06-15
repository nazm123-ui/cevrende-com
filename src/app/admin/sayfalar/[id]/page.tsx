import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import CategoryPageForm from "./CategoryPageForm";
import type { CategoryFaq, CategoryGuidePoint } from "@/lib/category-pages";

export const metadata = { title: "Sayfa Düzenle — Admin" };
export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const categories = await prisma.jobCategory.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });

  if (id === "yeni") {
    return <CategoryPageForm categories={categories} />;
  }

  const page = await prisma.categoryPage.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <CategoryPageForm
      categories={categories}
      initial={{
        id: page.id,
        slug: page.slug,
        categorySlug: page.categorySlug,
        name: page.name,
        h1: page.h1,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        intro: page.intro,
        guideTitle: page.guideTitle,
        emptyState: page.emptyState,
        guidePoints: Array.isArray(page.guidePoints)
          ? (page.guidePoints as CategoryGuidePoint[])
          : [],
        faqs: Array.isArray(page.faqs) ? (page.faqs as CategoryFaq[]) : [],
        isPublished: page.isPublished,
        order: page.order,
      }}
    />
  );
}
