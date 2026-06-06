import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-auth";
import { slugify } from "@/lib/slugify";
import { sendCategoryApprovedEmail } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";

export async function GET() {
  await requireAdmin();

  const suggestions = await prisma.categorySuggestion.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 200,
    include: {
      user: { select: { id: true, fullName: true, email: true } },
    },
  });

  return NextResponse.json(suggestions);
}

const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("approve"),
    id: z.string().min(1).max(40),
    // Admin ismi düzeltebilir
    name: z.string().trim().min(2).max(50),
    // Slug opsiyonel; verilmezse isimden üretilir
    slug: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    // Öneren kişinin profiline otomatik eklensin mi
    addToProfile: z.boolean().optional().default(true),
  }),
  z.object({
    action: z.literal("reject"),
    id: z.string().min(1).max(40),
    reason: z.string().trim().max(300).optional(),
  }),
]);

export async function PATCH(req: Request) {
  const admin = await requireAdmin();

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

  const suggestion = await prisma.categorySuggestion.findUnique({
    where: { id: parsed.data.id },
    include: { user: { select: { id: true, fullName: true, email: true, professions: true } } },
  });
  if (!suggestion) {
    return NextResponse.json({ error: "Öneri bulunamadı." }, { status: 404 });
  }
  if (suggestion.status !== "pending") {
    return NextResponse.json(
      { error: "Bu öneri zaten işleme alınmış." },
      { status: 409 },
    );
  }

  // ---- REDDET ----
  if (parsed.data.action === "reject") {
    await prisma.categorySuggestion.update({
      where: { id: suggestion.id },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
        reviewNote: parsed.data.reason || null,
      },
    });
    await logActivity({
      type: "category",
      actorId: admin.id,
      targetId: suggestion.id,
      title: `Meslek önerisi reddedildi: "${suggestion.suggestedName}"`,
      sub: parsed.data.reason?.slice(0, 80),
    });
    return NextResponse.json({ ok: true });
  }

  // ---- ONAYLA ----
  const name = parsed.data.name.trim();
  let slug = parsed.data.slug?.trim() || slugify(name);
  if (!slug || slug.length < 2) {
    return NextResponse.json(
      { error: "Geçerli bir slug üretilemedi, elle gir." },
      { status: 400 },
    );
  }

  // Slug çakışırsa mevcut kategoriyi kullan; isim aynıysa zaten var
  let category = await prisma.jobCategory.findUnique({ where: { slug } });
  if (!category) {
    const maxOrder = await prisma.jobCategory.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    category = await prisma.jobCategory.create({
      data: {
        name,
        slug,
        order: (maxOrder?.order ?? 0) + 1,
        isActive: true,
      },
    });
  } else {
    slug = category.slug;
  }

  // Öneren kişinin profiline ekle (yer varsa, zaten yoksa)
  let addedToProfile = false;
  if (
    parsed.data.addToProfile &&
    suggestion.user.professions.length < 5 &&
    !suggestion.user.professions.includes(slug)
  ) {
    await prisma.user.update({
      where: { id: suggestion.user.id },
      data: { professions: { push: slug } },
    });
    addedToProfile = true;
  }

  // Öneriyi onaylı işaretle
  await prisma.categorySuggestion.update({
    where: { id: suggestion.id },
    data: {
      status: "approved",
      reviewedAt: new Date(),
      resultSlug: slug,
      resultName: name,
    },
  });

  // Sohbete sistem mesajı (admin → öneren kişi)
  const profileLine = addedToProfile
    ? `Mesleği profiline ekledik — panelden kontrol edip güncelleyebilirsin.`
    : `Artık profil ayarlarından bu mesleği seçebilirsin.`;
  await prisma.message.create({
    data: {
      senderId: admin.id,
      recipientId: suggestion.user.id,
      content: `✅ Çevrende.com\n\nÖnerdiğin "${name}" mesleğini ekledik. Teşekkürler! ${profileLine}`,
    },
  });

  // Email gönder (sessiz başarısızlık)
  try {
    await sendCategoryApprovedEmail({
      to: suggestion.user.email,
      name: suggestion.user.fullName,
      categoryName: name,
      addedToProfile,
    });
  } catch (err) {
    console.error("[category-suggestion] email failed:", err);
  }

  await logActivity({
    type: "category",
    actorId: admin.id,
    targetId: category.id,
    title: `Öneri onaylandı → "${name}" kategorisi eklendi`,
    sub: `Öneren: ${suggestion.user.fullName}`,
  });

  return NextResponse.json({ ok: true, slug, addedToProfile });
}
