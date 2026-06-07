import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import { phoneSchema } from "@/lib/validators";
import { logActivity } from "@/lib/activity-log";
import { sendWelcomeEmail } from "@/lib/email";
import { absoluteUrl } from "@/lib/site-url";

const createSchema = z.object({
  fullName: z.string().trim().min(2, "Ad soyad en az 2 karakter.").max(80),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin."),
  phone: phoneSchema,
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalı.")
    .max(120),
  district: z.string().trim().min(1).max(60).default("Pendik"),
  neighborhood: z.string().trim().max(80).optional().nullable(),
  bio: z.string().trim().max(500).optional().nullable(),
  professions: z
    .array(z.string().min(1).max(60))
    .max(5, "En fazla 5 meslek seçilebilir.")
    .optional()
    .default([]),
  sendWelcome: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // Benzersizlik
  const [emailClash, phoneClash] = await Promise.all([
    prisma.user.findUnique({ where: { email: input.email }, select: { id: true } }),
    prisma.user.findUnique({ where: { phone: input.phone }, select: { id: true } }),
  ]);
  if (emailClash) {
    return NextResponse.json(
      { error: "Bu e-posta zaten kayıtlı." },
      { status: 400 },
    );
  }
  if (phoneClash) {
    return NextResponse.json(
      { error: "Bu telefon zaten kayıtlı." },
      { status: 400 },
    );
  }

  // Meslek doğrulama
  if (input.professions.length > 0) {
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

  const passwordHash = await bcrypt.hash(input.password, 10);

  const created = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      district: input.district,
      neighborhood: input.neighborhood || null,
      bio: input.bio || null,
      professions: input.professions,
      // Admin eklediği için doğrulanmış kabul edilir
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    },
    select: { id: true, fullName: true, email: true },
  });

  // İsteğe bağlı: giriş bilgileriyle hoş geldin e-postası
  if (input.sendWelcome) {
    try {
      await sendWelcomeEmail({
        to: created.email,
        name: created.fullName,
        password: input.password,
        loginUrl: absoluteUrl("/giris"),
      });
    } catch (err) {
      console.error("[admin-create] welcome email failed:", err);
      // E-posta başarısız olsa da hesap oluşturuldu
    }
  }

  await logActivity({
    type: "create",
    actorId: admin.id,
    targetId: created.id,
    title: `${admin.fullName}, ${created.fullName} hesabını oluşturdu`,
    sub: created.email,
  });

  return NextResponse.json({ ok: true, user: created });
}
