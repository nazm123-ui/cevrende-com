import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOtp } from "@/lib/otp";
import { setSessionCookie } from "@/lib/auth";
import { verifyOtpSchema } from "@/lib/validators";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = verifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { userId, code } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isActive: true,
      isPhoneVerified: true,
      isEmailVerified: true,
    },
  });
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: "Kullanıcı bulunamadı." },
      { status: 404 },
    );
  }

  if (!user.isEmailVerified) {
    const result = await verifyOtp(userId, code, "email_registration");
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  if (user.isPhoneVerified) {
    await setSessionCookie({ userId: user.id });
    return NextResponse.json({ ok: true, complete: true });
  }

  return NextResponse.json({
    ok: true,
    complete: false,
    nextStep: "phone",
  });
}
