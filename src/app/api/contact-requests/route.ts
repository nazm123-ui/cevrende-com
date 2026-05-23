import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import { contactRequestSchema } from "@/lib/validators";
import { checkContent, describeCategories } from "@/lib/content-filter";

export async function POST(req: Request) {
  const user = await requireVerifiedUser();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Talep hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { toWorkerId, message } = parsed.data;

  if (toWorkerId === user.id) {
    return NextResponse.json(
      { error: "Kendine talep gönderemezsin." },
      { status: 400 },
    );
  }

  if (message && message.length > 0) {
    const filter = checkContent(message);
    if (filter.blockedCategories.length > 0) {
      return NextResponse.json(
        {
          error: `Not uygunsuz içerik barındırıyor (${describeCategories(filter.blockedCategories)}).`,
        },
        { status: 400 },
      );
    }
  }

  const worker = await prisma.user.findUnique({
    where: { id: toWorkerId },
    select: { id: true, isActive: true, professions: true },
  });
  if (!worker || !worker.isActive || worker.professions.length === 0) {
    return NextResponse.json(
      { error: "Bu kişinin meslek profili yok." },
      { status: 404 },
    );
  }

  const existing = await prisma.contactRequest.findUnique({
    where: { fromUserId_toWorkerId: { fromUserId: user.id, toWorkerId } },
    select: { id: true, status: true },
  });

  if (existing) {
    if (existing.status === "accepted") {
      return NextResponse.json(
        { error: "Talebin zaten kabul edilmiş.", status: "accepted" },
        { status: 409 },
      );
    }
    if (existing.status === "pending") {
      return NextResponse.json(
        { error: "Önceki talebin hâlâ onay bekliyor.", status: "pending" },
        { status: 409 },
      );
    }
    const updated = await prisma.contactRequest.update({
      where: { id: existing.id },
      data: {
        status: "pending",
        message: message || null,
        createdAt: new Date(),
        respondedAt: null,
      },
      select: { id: true, status: true },
    });
    return NextResponse.json({ ok: true, request: updated });
  }

  const request = await prisma.contactRequest.create({
    data: {
      fromUserId: user.id,
      toWorkerId,
      message: message || null,
    },
    select: { id: true, status: true },
  });

  return NextResponse.json({ ok: true, request });
}
