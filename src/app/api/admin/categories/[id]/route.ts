import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

const categoryUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  order: z.number().int().nonnegative().optional(),
});

const categoryActionSchema = z.object({
  action: z.enum(["toggle"]),
});

export async function PATCH(req: Request, ctx: Ctx) {
  await requireAdmin();
  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = categoryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const category = await prisma.jobCategory.findUnique({ where: { id } });
  if (!category) {
    return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
  }

  const updated = await prisma.jobCategory.update({
    where: { id },
    data: {
      name: parsed.data.name,
      order: parsed.data.order,
    },
  });

  return NextResponse.json({ ok: true, category: updated });
}

export async function POST(req: Request, ctx: Ctx) {
  await requireAdmin();
  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = categoryActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bilinmeyen işlem." }, { status: 400 });
  }

  const category = await prisma.jobCategory.findUnique({ where: { id } });
  if (!category) {
    return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
  }

  const updated = await prisma.jobCategory.update({
    where: { id },
    data: { isActive: !category.isActive },
  });

  return NextResponse.json({ ok: true, category: updated });
}
