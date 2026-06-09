import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createOtp, isDevMode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { registerSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { logActivity } from "@/lib/activity-log";
import { getDistrictBySlug } from "@/lib/districts";
import { checkContent, describeCategories } from "@/lib/content-filter";

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "auth-strict");
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const {
    fullName,
    email,
    phone,
    password,
    districtSlug,
    neighborhood,
    professions,
    bio,
  } = parsed.data;

  // İlçe doğrulama: seçilen ilçe gerçekten aktif mi ve mahalle ona ait mi?
  const district = await getDistrictBySlug(districtSlug);
  if (!district || !district.isEnabled) {
    return NextResponse.json(
      {
        error: "Seçilen ilçe şu anda hizmet vermiyor.",
        issues: { districtSlug: ["Geçerli bir ilçe seç."] },
      },
      { status: 400 },
    );
  }
  if (!district.neighborhoods.includes(neighborhood)) {
    return NextResponse.json(
      {
        error: "Mahalle ilçeyle uyumsuz.",
        issues: { neighborhood: ["Mahalleyi tekrar seç."] },
      },
      { status: 400 },
    );
  }

  // Meslek slug'ları gerçekten var olan aktif kategoriler mi?
  const validSlugs = new Set(
    (
      await prisma.jobCategory.findMany({
        where: { isActive: true },
        select: { slug: true },
      })
    ).map((c) => c.slug),
  );
  if (professions.some((p) => !validSlugs.has(p))) {
    return NextResponse.json(
      {
        error: "Geçersiz meslek seçimi.",
        issues: { professions: ["Meslekleri listeden seç."] },
      },
      { status: 400 },
    );
  }

  // Tanıtım metni içerik filtresi (küfür / iletişim bilgisi / spam)
  const filter = checkContent(bio);
  if (filter.blockedCategories.length > 0) {
    return NextResponse.json(
      {
        error: `Tanıtım metni uygunsuz içerik barındırıyor (${describeCategories(filter.blockedCategories)}).`,
        issues: { bio: ["Tanıtım metnini düzenle."] },
      },
      { status: 400 },
    );
  }

  const workerSettings = { showDistrict: false, phoneVisibility: "private" };
  const trimmedBio = bio.trim();

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
    select: {
      id: true,
      email: true,
      phone: true,
      isEmailVerified: true,
    },
  });

  if (existing) {
    if (!existing.isEmailVerified) {
      // Yarım kalmış kayıt: yeni girilen meslek/tanıtım bilgilerini güncelle.
      await prisma.user.update({
        where: { id: existing.id },
        data: { professions, bio: trimmedBio, workerSettings },
      });
      const emailOtp = await createOtp(existing.id, "email_registration");
      await sendOtpEmail(existing.email, emailOtp.code);

      return NextResponse.json({
        userId: existing.id,
        message:
          "Bu bilgilerle daha önce kayıt başlatılmış. Doğrulama kodu tekrar gönderildi.",
        needsPhoneVerification: false,
        needsEmailVerification: true,
        ...(isDevMode() ? { devEmailOtp: emailOtp.code } : {}),
      });
    }
    return NextResponse.json(
      { error: "Bu e-posta veya telefon zaten kayıtlı." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash,
      district: district.name,
      neighborhood: neighborhood || null,
      isPhoneVerified: true,
      professions,
      bio: trimmedBio,
      workerSettings,
    },
    select: { id: true, email: true },
  });

  await logActivity({
    type: "signup",
    actorId: user.id,
    targetId: user.id,
    title: `${fullName} kayıt oldu`,
    sub: neighborhood ? `${neighborhood} · doğrulama bekliyor` : "doğrulama bekliyor",
  });

  const emailOtp = await createOtp(user.id, "email_registration");
  await sendOtpEmail(user.email, emailOtp.code);

  return NextResponse.json({
    userId: user.id,
    needsPhoneVerification: false,
    needsEmailVerification: true,
    ...(isDevMode() ? { devEmailOtp: emailOtp.code } : {}),
  });
}
