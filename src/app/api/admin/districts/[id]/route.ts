import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

const patchSchema = z.object({
  isEnabled: z.boolean().optional(),
  neighborhoods: z.array(z.string().min(1).max(80)).max(200).optional(),
  order: z.number().int().nonnegative().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const existing = await prisma.district.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "İlçe bulunamadı." }, { status: 404 });
  }

  const updated = await prisma.district.update({
    where: { id },
    data: parsed.data,
  });

  // Aç/kapa eylemi log'a düşsün
  if (parsed.data.isEnabled !== undefined && parsed.data.isEnabled !== existing.isEnabled) {
    await logActivity({
      type: "district",
      actorId: admin.id,
      targetId: updated.id,
      title: updated.isEnabled
        ? `${updated.name} açıldı`
        : `${updated.name} kapatıldı`,
      sub: `Admin: ${admin.email}`,
      metadata: { slug: updated.slug, isEnabled: updated.isEnabled },
    });
  }

  return NextResponse.json(updated);
}
