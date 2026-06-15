import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { categoryPageCreateSchema } from "@/lib/category-page-schema";
import type { Prisma } from "@prisma/client";

// Yeni kategori sayfası oluştur
export async function POST(req: Request) {
  await requireAdmin();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = categoryPageCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const existing = await prisma.categoryPage.findUnique({
    where: { slug: data.slug },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Bu slug zaten kullanılıyor." },
      { status: 409 },
    );
  }

  const created = await prisma.categoryPage.create({
    data: {
      slug: data.slug,
      categorySlug: data.categorySlug,
      name: data.name,
      h1: data.h1,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      intro: data.intro,
      guideTitle: data.guideTitle,
      guidePoints: data.guidePoints as unknown as Prisma.InputJsonValue,
      emptyState: data.emptyState,
      faqs: data.faqs as unknown as Prisma.InputJsonValue,
      coverImageKey: data.coverImageKey ?? null,
      isPublished: data.isPublished,
      order: data.order,
    },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
