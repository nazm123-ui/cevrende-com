import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import { sendAdminMessageEmail } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";

const schema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Mesaj boş olamaz.")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir."),
  sendEmail: z.boolean().optional().default(false),
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
      { error: "Kendine mesaj gönderemezsin." },
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
      { error: parsed.error.flatten().formErrors[0] || "Form hatalı." },
      { status: 400 },
    );
  }
  const { content, sendEmail } = parsed.data;

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, fullName: true, email: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  // 1) Platform içi mesaj (admin gönderici → hedef alıcı)
  await prisma.message.create({
    data: {
      senderId: admin.id,
      recipientId: target.id,
      content,
    },
  });

  // 2) İsteğe bağlı e-posta
  if (sendEmail) {
    try {
      await sendAdminMessageEmail({
        to: target.email,
        name: target.fullName,
        content,
      });
    } catch (err) {
      console.error("[admin-message] email failed:", err);
      // E-posta başarısız olsa da platform içi mesaj gitti
    }
  }

  await logActivity({
    type: "message",
    actorId: admin.id,
    targetId: target.id,
    title: `${admin.fullName}, ${target.fullName} kişisine mesaj gönderdi`,
    sub: content.slice(0, 80),
  });

  return NextResponse.json({ ok: true });
}
