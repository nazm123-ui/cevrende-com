import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOtp } from "@/lib/otp";
import { hashPassword } from "@/lib/password";
import { resetPasswordSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "auth");
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { email, code, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, isActive: true },
  });
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: "Bu e-posta için kayıt bulunamadı veya hesap pasif." },
      { status: 404 },
    );
  }

  const result = await verifyOtp(user.id, code, "password_reset");
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, passwordChangedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
