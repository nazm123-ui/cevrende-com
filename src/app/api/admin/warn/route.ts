import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import {
  WARNING_TEMPLATES,
  type WarningCategory,
} from "@/lib/warning-templates";
import { sendCategorizedWarningEmail } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";

const bodySchema = z.object({
  reportId: z.string().min(1).max(40),
  category: z.enum([
    "hakaret",
    "cinsel",
    "dolandiricilik",
    "spam",
    "tehdit",
    "diger",
  ]),
  customNote: z.string().trim().max(400).optional(),
});

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || !isAdminEmail(admin.email)) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Form hatalı." }, { status: 400 });
  }
  const { reportId, category, customNote } = parsed.data;

  const report = await prisma.messageReport.findUnique({
    where: { id: reportId },
    include: {
      // Mesajın göndericisi = uyarılacak kişi
    },
  });
  if (!report) {
    return NextResponse.json({ error: "Rapor bulunamadı." }, { status: 404 });
  }

  // Raporun konusu olan mesajın göndericisini bul — uyarılacak kişi o
  const message = await prisma.message.findUnique({
    where: { id: report.messageId },
    select: { senderId: true },
  });
  if (!message) {
    return NextResponse.json(
      { error: "Raporlanan mesaj artık mevcut değil." },
      { status: 404 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id: message.senderId },
    select: { id: true, fullName: true, email: true },
  });
  if (!target) {
    return NextResponse.json(
      { error: "Kullanıcı bulunamadı." },
      { status: 404 },
    );
  }

  const template = WARNING_TEMPLATES[category as WarningCategory];
  const systemBody = customNote
    ? `${template.systemMessage}\n\nYönetim notu: ${customNote}`
    : template.systemMessage;
  const emailBody = customNote
    ? `${template.emailBody}\n\nYönetim notu: ${customNote}`
    : template.emailBody;

  // 1) Sohbete sistem mesajı (admin gönderici, hedef alıcı)
  await prisma.message.create({
    data: {
      senderId: admin.id,
      recipientId: target.id,
      content: `⚠️ Çevrende.com Yönetim Uyarısı (${template.label})\n\n${systemBody}`,
    },
  });

  // 2) Email gönder (transporter env yoksa sessiz dev log)
  try {
    await sendCategorizedWarningEmail({
      to: target.email,
      name: target.fullName,
      subject: template.subject,
      body: emailBody,
      categoryLabel: template.label,
    });
  } catch (err) {
    console.error("[warn] email failed:", err);
    // Email başarısız olsa bile sistem mesajı gittiği için işleme devam
  }

  // 3) Raporu çöz, kullanıcının uyarı sayacını artır
  await Promise.all([
    prisma.messageReport.update({
      where: { id: reportId },
      data: {
        status: "resolved",
        resolvedAt: new Date(),
        resolvedNote: `${template.label}${customNote ? " — " + customNote : ""}`,
      },
    }),
    prisma.user.update({
      where: { id: target.id },
      data: {
        warningCount: { increment: 1 },
        lastWarnedAt: new Date(),
      },
    }),
  ]);

  // 4) Aktivite log
  await logActivity({
    type: "warn",
    actorId: admin.id,
    targetId: target.id,
    title: `${target.fullName} uyarıldı (${template.label})`,
    sub: customNote?.slice(0, 80),
  });

  return NextResponse.json({
    ok: true,
    targetName: target.fullName,
    category: template.label,
  });
}
