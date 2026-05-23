import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createOtp, isDevMode } from "@/lib/otp";
import { sendPasswordResetEmail } from "@/lib/email";
import { requestPasswordResetSchema } from "@/lib/validators";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = requestPasswordResetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "E-posta hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, isActive: true },
  });

  if (user && user.isActive) {
    const otp = await createOtp(user.id, "password_reset");
    await sendPasswordResetEmail(user.email, otp.code);
    if (isDevMode()) {
      return NextResponse.json({ ok: true, devCode: otp.code });
    }
  }

  return NextResponse.json({ ok: true });
}
