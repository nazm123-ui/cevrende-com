import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import { sendUserWarningEmail } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";

const schema = z.object({
  note: z
    .string()
    .trim()
    .min(10, "Uyarı en az 10 karakter olmalı.")
    .max(1000, "Uyarı en fazla 1000 karakter olabilir."),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentUser();
  if (!admin || !isAdminEmail(admin.email)) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }

  const { id } = await params;
  if (admin.id === id) {
    return NextResponse.json(
      { error: "Kendine uyarı gönderemezsin." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { fullName: true, email: true, isActive: true },
  });
  if (!target) {
    return NextResponse.json(
      { error: "Kullanıcı bulunamadı." },
      { status: 404 },
    );
  }

  after(async () => {
    try {
      await sendUserWarningEmail({
        to: target.email,
        name: target.fullName,
        note: parsed.data.note,
      });
    } catch (err) {
      console.error("[admin warn] mail send failed:", err);
    }
  });

  await logActivity({
    type: "warn",
    actorId: admin.id,
    targetId: id,
    title: `${admin.fullName} ${target.fullName} kullanıcısını uyardı`,
    sub: parsed.data.note.slice(0, 100),
  });

  return NextResponse.json({ success: true });
}
