import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import GuideForm from "./GuideForm";
import type { GuideSection, GuideFaq } from "@/lib/guides";

export const metadata = { title: "Yazı Düzenle — Admin" };
export const dynamic = "force-dynamic";

export default async function EditGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const categoryPages = await prisma.categoryPage.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });

  if (id === "yeni") {
    return <GuideForm categoryPages={categoryPages} />;
  }

  const g = await prisma.guideArticle.findUnique({ where: { id } });
  if (!g) notFound();

  return (
    <GuideForm
      categoryPages={categoryPages}
      initial={{
        id: g.id,
        slug: g.slug,
        title: g.title,
        metaTitle: g.metaTitle,
        metaDescription: g.metaDescription,
        excerpt: g.excerpt,
        intro: g.intro,
        topic: g.topic,
        sections: Array.isArray(g.sections) ? (g.sections as GuideSection[]) : [],
        faqs: Array.isArray(g.faqs) ? (g.faqs as GuideFaq[]) : [],
        relatedCategorySlugs: g.relatedCategorySlugs,
        isPublished: g.isPublished,
      }}
    />
  );
}
