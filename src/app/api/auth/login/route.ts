import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { setSessionCookie } from "@/lib/auth";
import { createOtp, isDevMode } from "@/lib/otp";
import { loginSchema, phoneSchema } from "@/lib/validators";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { identifier, password } = parsed.data;
  const isEmail = identifier.includes("@");

  let where: { email?: string } | { phone?: string };
  if (isEmail) {
    where = { email: identifier.toLowerCase() };
  } else {
    const phoneParsed = phoneSchema.safeParse(identifier);
    if (!phoneParsed.success) {
      return NextResponse.json(
        { error: "E-posta veya geçerli telefon girin." },
        { status: 400 },
      );
    }
    where = { phone: phoneParsed.data };
  }

  const user = await prisma.user.findUnique({
    where: where as { email: string } | { phone: string },
    select: {
      id: true,
      role: true,
      passwordHash: true,
      isPhoneVerified: true,
      isActive: true,
    },
  });

  const invalid = NextResponse.json(
    { error: "E-posta/telefon veya şifre hatalı." },
    { status: 401 },
  );
  if (!user || !user.isActive) return invalid;

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return invalid;

  if (!user.isPhoneVerified) {
    const otp = await createOtp(user.id, "registration");
    return NextResponse.json(
      {
        error: "Hesabınız henüz telefonla doğrulanmamış.",
        needsVerification: true,
        userId: user.id,
        ...(isDevMode() ? { devOtp: otp.code } : {}),
      },
      { status: 403 },
    );
  }

  await setSessionCookie({ userId: user.id, role: user.role });

  return NextResponse.json({ ok: true });
}
