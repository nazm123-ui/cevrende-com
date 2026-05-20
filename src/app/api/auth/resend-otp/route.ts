import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createOtp, isDevMode } from "@/lib/otp";

const schema = z.object({ userId: z.string().min(1) });

export async function POST(req: Request) {
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

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, isPhoneVerified: true, isActive: true },
  });
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: "Kullanıcı bulunamadı." },
      { status: 404 },
    );
  }
  if (user.isPhoneVerified) {
    return NextResponse.json(
      { error: "Bu hesap zaten doğrulanmış." },
      { status: 400 },
    );
  }

  const otp = await createOtp(user.id, "registration");

  return NextResponse.json({
    ok: true,
    ...(isDevMode() ? { devOtp: otp.code } : {}),
  });
}
