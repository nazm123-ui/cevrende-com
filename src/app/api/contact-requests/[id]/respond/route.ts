import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import { contactRequestRespondSchema } from "@/lib/validators";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireVerifiedUser();
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = contactRequestRespondSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Karar hatalı." },
      { status: 400 },
    );
  }

  const request = await prisma.contactRequest.findUnique({
    where: { id },
    select: { id: true, toWorkerId: true, status: true },
  });
  if (!request) {
    return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
  }
  if (request.toWorkerId !== user.id) {
    return NextResponse.json(
      { error: "Bu talebe cevap verme yetkin yok." },
      { status: 403 },
    );
  }
  if (request.status !== "pending") {
    return NextResponse.json(
      { error: "Bu talep zaten yanıtlanmış." },
      { status: 409 },
    );
  }

  const updated = await prisma.contactRequest.update({
    where: { id },
    data: {
      status: parsed.data.decision,
      respondedAt: new Date(),
    },
    select: { id: true, status: true },
  });

  return NextResponse.json({ ok: true, request: updated });
}
