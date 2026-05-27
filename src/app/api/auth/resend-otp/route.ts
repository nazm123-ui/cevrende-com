import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createOtp, isDevMode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  userId: z.string().min(1),
  channel: z.enum(["phone", "email"]).optional().default("email"),
});

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "auth-strict");
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Form hatalı." }, { status: 400 });
  }

  const { userId, channel } = parsed.data;

  if (channel !== "email") {
    return NextResponse.json(
      { error: "Bu doğrulama kanalı şu an aktif değil." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      isActive: true,
    },
  });
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: "Kullanıcı bulunamadı." },
      { status: 404 },
    );
  }

  if (user.isEmailVerified) {
    return NextResponse.json(
      { error: "E-posta zaten doğrulanmış." },
      { status: 400 },
    );
  }
  const otp = await createOtp(user.id, "email_registration");
  await sendOtpEmail(user.email, otp.code);
  return NextResponse.json({
    ok: true,
    ...(isDevMode() ? { devOtp: otp.code } : {}),
  });
}
