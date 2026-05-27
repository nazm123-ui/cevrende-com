import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";

const bodySchema = z.object({
  savedUserId: z.string().min(1, "Geçersiz kullanıcı."),
});

export async function GET() {
  const user = await requireVerifiedUser();
  const rows = await prisma.savedProfile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { savedUserId: true },
  });
  return NextResponse.json({ ids: rows.map((r) => r.savedUserId) });
}

export async function POST(req: Request) {
  const user = await requireVerifiedUser();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz parametre." }, { status: 400 });
  }
  const { savedUserId } = parsed.data;
  if (savedUserId === user.id) {
    return NextResponse.json(
      { error: "Kendi profilini kaydedemezsin." },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id: savedUserId },
    select: { id: true, isActive: true },
  });
  if (!target || !target.isActive) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  await prisma.savedProfile.upsert({
    where: { userId_savedUserId: { userId: user.id, savedUserId } },
    update: {},
    create: { userId: user.id, savedUserId },
  });
  return NextResponse.json({ ok: true, saved: true });
}

export async function DELETE(req: Request) {
  const user = await requireVerifiedUser();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz parametre." }, { status: 400 });
  }
  const { savedUserId } = parsed.data;

  await prisma.savedProfile.deleteMany({
    where: { userId: user.id, savedUserId },
  });
  return NextResponse.json({ ok: true, saved: false });
}
