import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const categoryInputSchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı").max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, sayı ve tire içerebilir"),
  order: z.number().int().nonnegative().optional(),
});

export async function GET() {
  await requireAdmin();

  const categories = await prisma.jobCategory.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  await requireAdmin();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const existing = await prisma.jobCategory.findUnique({
    where: { slug: parsed.data.slug },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Bu slug zaten var." },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.jobCategory.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const category = await prisma.jobCategory.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      order: parsed.data.order ?? (maxOrder?.order ?? 0) + 1,
    },
  });

  return NextResponse.json({ ok: true, category });
}
