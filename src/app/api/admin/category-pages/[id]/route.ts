import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { categoryPagePatchSchema } from "@/lib/category-page-schema";
import type { Prisma } from "@prisma/client";

// Kategori sayfasını güncelle
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

  const parsed = categoryPagePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const existing = await prisma.categoryPage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Sayfa bulunamadı." }, { status: 404 });
  }

  // Slug değişiyorsa benzersizlik kontrolü
  if (data.slug && data.slug !== existing.slug) {
    const clash = await prisma.categoryPage.findUnique({
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

  const updateData: Prisma.CategoryPageUpdateInput = {};
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.categorySlug !== undefined) updateData.categorySlug = data.categorySlug;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.h1 !== undefined) updateData.h1 = data.h1;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
  if (data.intro !== undefined) updateData.intro = data.intro;
  if (data.bodyContent !== undefined) updateData.bodyContent = data.bodyContent;
  if (data.guideTitle !== undefined) updateData.guideTitle = data.guideTitle;
  if (data.guidePoints !== undefined)
    updateData.guidePoints = data.guidePoints as unknown as Prisma.InputJsonValue;
  if (data.emptyState !== undefined) updateData.emptyState = data.emptyState;
  if (data.faqs !== undefined)
    updateData.faqs = data.faqs as unknown as Prisma.InputJsonValue;
  if (data.coverImageKey !== undefined) updateData.coverImageKey = data.coverImageKey;
  if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
  if (data.order !== undefined) updateData.order = data.order;

  const updated = await prisma.categoryPage.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ id: updated.id });
}

// Kategori sayfasını sil
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  const existing = await prisma.categoryPage.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Sayfa bulunamadı." }, { status: 404 });
  }
  await prisma.categoryPage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
