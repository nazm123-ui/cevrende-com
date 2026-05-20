import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createOtp, isDevMode } from "@/lib/otp";
import { registerSchema } from "@/lib/validators";

export async function POST(req: Request) {
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

  const { role, fullName, email, phone, password, neighborhood } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
    select: { id: true, isPhoneVerified: true, email: true, phone: true },
  });

  if (existing) {
    if (!existing.isPhoneVerified) {
      const otp = await createOtp(existing.id, "registration");
      return NextResponse.json({
        userId: existing.id,
        message:
          "Bu bilgilerle daha önce kayıt başlatılmış. Doğrulama kodu tekrar gönderildi.",
        ...(isDevMode() ? { devOtp: otp.code } : {}),
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
      role,
      fullName,
      email,
      phone,
      passwordHash,
      neighborhood: neighborhood || null,
    },
    select: { id: true },
  });

  const otp = await createOtp(user.id, "registration");

  return NextResponse.json({
    userId: user.id,
    ...(isDevMode() ? { devOtp: otp.code } : {}),
  });
}
