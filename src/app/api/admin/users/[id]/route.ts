import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import { phoneSchema } from "@/lib/validators";
import { logActivity } from "@/lib/activity-log";

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    return null;
  }
  return user;
}

const patchSchema = z.object({
  fullName: z.string().trim().min(2, "Ad soyad en az 2 karakter.").max(80).optional(),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin.").optional(),
  phone: phoneSchema.optional(),
  district: z.string().trim().min(1).max(60).optional(),
  neighborhood: z.string().trim().max(80).nullable().optional(),
  bio: z.string().trim().max(500, "Tanıtım en fazla 500 karakter.").nullable().optional(),
  professions: z
    .array(z.string().min(1).max(60))
    .max(5, "En fazla 5 meslek seçilebilir.")
    .optional(),
  isAvailable: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional(),
  // Gizlilik ayarları (workerSettings içine yazılır) — yaşlı kullanıcılar
  // profili düzenleyemediğinde admin elle ayarlayabilsin diye.
  showDistrict: z.boolean().optional(),
  phoneVisibility: z.enum(["public", "private"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await assertAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }

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
  const input = parsed.data;

  const target = await prisma.user.findUnique({
    where: { id },
    select: { fullName: true, email: true, isActive: true, workerSettings: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }
  const targetIsAdmin = isAdminEmail(target.email);

  // isActive değişimi: kendine ve admin hesaplarına dokunulamaz
  if (typeof input.isActive === "boolean") {
    if (admin.id === id) {
      return NextResponse.json(
        { error: "Kendi hesabının erişimini değiştiremezsin." },
        { status: 400 },
      );
    }
    if (targetIsAdmin) {
      return NextResponse.json(
        { error: "Admin hesabının erişimi değiştirilemez." },
        { status: 400 },
      );
    }
  }

  // E-posta / telefon benzersizlik kontrolü (başka hesapta var mı?)
  if (input.email) {
    const clash = await prisma.user.findFirst({
      where: { email: input.email, NOT: { id } },
      select: { id: true },
    });
    if (clash) {
      return NextResponse.json(
        { error: "Bu e-posta başka bir hesapta kayıtlı." },
        { status: 400 },
      );
    }
  }
  if (input.phone) {
    const clash = await prisma.user.findFirst({
      where: { phone: input.phone, NOT: { id } },
      select: { id: true },
    });
    if (clash) {
      return NextResponse.json(
        { error: "Bu telefon başka bir hesapta kayıtlı." },
        { status: 400 },
      );
    }
  }

  // Meslek slug doğrulama
  if (input.professions && input.professions.length > 0) {
    const validSlugs = new Set(
      (
        await prisma.jobCategory.findMany({
          where: { isActive: true },
          select: { slug: true },
        })
      ).map((c) => c.slug),
    );
    const bad = input.professions.find((p) => !validSlugs.has(p));
    if (bad) {
      return NextResponse.json(
        { error: "Geçersiz meslek seçimi." },
        { status: 400 },
      );
    }
  }

  const data: Record<string, unknown> = {};
  if (input.fullName !== undefined) data.fullName = input.fullName;
  if (input.email !== undefined) data.email = input.email;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.district !== undefined) data.district = input.district;
  if (input.neighborhood !== undefined) data.neighborhood = input.neighborhood;
  if (input.bio !== undefined) data.bio = input.bio;
  if (input.professions !== undefined) data.professions = input.professions;
  if (input.isAvailable !== undefined) data.isAvailable = input.isAvailable;
  if (input.isActive !== undefined) data.isActive = input.isActive;
  if (input.isEmailVerified !== undefined)
    data.isEmailVerified = input.isEmailVerified;
  if (input.isPhoneVerified !== undefined)
    data.isPhoneVerified = input.isPhoneVerified;

  // Gizlilik ayarları: mevcut workerSettings'i koruyarak üzerine yaz.
  if (input.showDistrict !== undefined || input.phoneVisibility !== undefined) {
    const current =
      target.workerSettings && typeof target.workerSettings === "object"
        ? (target.workerSettings as Record<string, unknown>)
        : {};
    data.workerSettings = {
      ...current,
      ...(input.showDistrict !== undefined
        ? { showDistrict: input.showDistrict }
        : {}),
      ...(input.phoneVisibility !== undefined
        ? { phoneVisibility: input.phoneVisibility }
        : {}),
    };
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Değiştirilecek alan yok." }, { status: 400 });
  }

  await prisma.user.update({ where: { id }, data });

  // Aktivite log
  if (typeof input.isActive === "boolean" && Object.keys(data).length === 1) {
    await logActivity({
      type: input.isActive ? "activate" : "deactivate",
      actorId: admin.id,
      targetId: id,
      title: input.isActive
        ? `${admin.fullName} ${target.fullName} hesabını aktif etti`
        : `${admin.fullName} ${target.fullName} hesabını pasifleştirdi`,
      sub: input.isActive ? "tekrar aktif" : "giriş engelli",
    });
  } else {
    await logActivity({
      type: "edit",
      actorId: admin.id,
      targetId: id,
      title: `${admin.fullName}, ${target.fullName} bilgilerini düzenledi`,
      sub: Object.keys(data).join(", "),
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await assertAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }

  const { id } = await params;

  if (admin.id === id) {
    return NextResponse.json(
      { error: "Kendi hesabını silemezsin." },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { email: true },
  });

  if (target && isAdminEmail(target.email)) {
    return NextResponse.json(
      { error: "Admin hesabı silinemez." },
      { status: 400 },
    );
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
