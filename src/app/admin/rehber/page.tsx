import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { GUIDE_TOPICS, type GuideTopicSlug } from "@/lib/guides";
import GuidesClient from "./GuidesClient";

export const metadata = { title: "Rehber Yazıları — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  await requireAdmin();
  const guides = await prisma.guideArticle.findMany({
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      isPublished: true,
      updatedAt: true,
    },
  });
  return (
    <GuidesClient
      initial={guides.map((g) => ({
        id: g.id,
        slug: g.slug,
        title: g.title,
        topicLabel:
          GUIDE_TOPICS[g.topic as GuideTopicSlug]?.label ?? g.topic,
        isPublished: g.isPublished,
        updatedAt: g.updatedAt.toISOString(),
      }))}
    />
  );
}
