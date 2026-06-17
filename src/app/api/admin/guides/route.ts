import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { guideCreateSchema } from "@/lib/guide-schema";
import type { Prisma } from "@prisma/client";

// Yeni rehber yazısı oluştur
export async function POST(req: Request) {
  await requireAdmin();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = guideCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const existing = await prisma.guideArticle.findUnique({
    where: { slug: data.slug },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Bu slug zaten kullanılıyor." },
      { status: 409 },
    );
  }

  const created = await prisma.guideArticle.create({
    data: {
      slug: data.slug,
      title: data.title,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      excerpt: data.excerpt,
      intro: data.intro,
      topic: data.topic,
      sections: data.sections as unknown as Prisma.InputJsonValue,
      faqs: data.faqs as unknown as Prisma.InputJsonValue,
      relatedCategorySlugs: data.relatedCategorySlugs,
      isPublished: data.isPublished,
      order: data.order,
    },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
