import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { guidePatchSchema } from "@/lib/guide-schema";
import type { Prisma } from "@prisma/client";

// Rehber yazısını güncelle
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = guidePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const existing = await prisma.guideArticle.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
  }

  if (data.slug && data.slug !== existing.slug) {
    const clash = await prisma.guideArticle.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });
    if (clash) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor." },
        { status: 409 },
      );
    }
  }

  const u: Prisma.GuideArticleUpdateInput = {};
  if (data.slug !== undefined) u.slug = data.slug;
  if (data.title !== undefined) u.title = data.title;
  if (data.metaTitle !== undefined) u.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined) u.metaDescription = data.metaDescription;
  if (data.excerpt !== undefined) u.excerpt = data.excerpt;
  if (data.intro !== undefined) u.intro = data.intro;
  if (data.topic !== undefined) u.topic = data.topic;
  if (data.sections !== undefined)
    u.sections = data.sections as unknown as Prisma.InputJsonValue;
  if (data.faqs !== undefined)
    u.faqs = data.faqs as unknown as Prisma.InputJsonValue;
  if (data.relatedCategorySlugs !== undefined)
    u.relatedCategorySlugs = data.relatedCategorySlugs;
  if (data.isPublished !== undefined) u.isPublished = data.isPublished;
  if (data.order !== undefined) u.order = data.order;

  const updated = await prisma.guideArticle.update({ where: { id }, data: u });
  return NextResponse.json({ id: updated.id });
}

// Rehber yazısını sil
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  const existing = await prisma.guideArticle.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
  }
  await prisma.guideArticle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
