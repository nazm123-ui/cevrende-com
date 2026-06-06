import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import { checkContent, describeCategories } from "@/lib/content-filter";
import { checkRateLimit } from "@/lib/rate-limit";
import { logActivity } from "@/lib/activity-log";

const bodySchema = z.object({
  suggestedName: z
    .string()
    .trim()
    .min(2, "Meslek adı en az 2 karakter olmalı.")
    .max(60, "Meslek adı en fazla 60 karakter olabilir."),
  note: z.string().trim().max(300).optional(),
});

const MAX_PENDING_PER_USER = 5;

export async function POST(req: Request) {
  const user = await requireVerifiedUser();

  const limited = await checkRateLimit(req, "messages");
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const { suggestedName, note } = parsed.data;

  // Küfür / spam / iletişim bilgisi filtresi
  const check = checkContent(suggestedName, note ?? "");
  if (check.blockedCategories.length > 0) {
    return NextResponse.json(
      {
        error: `Önerin uygunsuz içerik barındırıyor (${describeCategories(
          check.blockedCategories,
        )}). Lütfen sadece meslek adını yaz.`,
      },
      { status: 400 },
    );
  }

  // Zaten var olan bir kategoriye çok benziyorsa kullanıcıyı bilgilendir
  const normalized = suggestedName.toLocaleLowerCase("tr");
  const existing = await prisma.jobCategory.findFirst({
    where: {
      isActive: true,
      name: { equals: suggestedName, mode: "insensitive" },
    },
    select: { name: true },
  });
  if (existing) {
    return NextResponse.json(
      {
        error: `"${existing.name}" zaten listede var — meslek arama kutusuna yazıp seçebilirsin.`,
      },
      { status: 409 },
    );
  }

  // Kullanıcının bekleyen öneri sayısını sınırla (kötüye kullanım)
  const pendingCount = await prisma.categorySuggestion.count({
    where: { userId: user.id, status: "pending" },
  });
  if (pendingCount >= MAX_PENDING_PER_USER) {
    return NextResponse.json(
      {
        error:
          "Bekleyen öneri sınırına ulaştın. Mevcut önerilerin incelenince yenisini gönderebilirsin.",
      },
      { status: 429 },
    );
  }

  // Aynı kullanıcıdan aynı isimde bekleyen öneri varsa tekrar oluşturma
  const duplicate = await prisma.categorySuggestion.findFirst({
    where: {
      userId: user.id,
      status: "pending",
      suggestedName: { equals: normalized, mode: "insensitive" },
    },
    select: { id: true },
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "Bu öneriyi zaten gönderdin, inceleniyor." },
      { status: 409 },
    );
  }

  const suggestion = await prisma.categorySuggestion.create({
    data: {
      userId: user.id,
      suggestedName,
      note: note || null,
    },
  });

  await logActivity({
    type: "category",
    actorId: user.id,
    targetId: suggestion.id,
    title: `${user.fullName} yeni meslek önerdi: "${suggestedName}"`,
    sub: note?.slice(0, 80),
  });

  return NextResponse.json({ ok: true });
}
