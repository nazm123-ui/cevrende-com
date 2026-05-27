import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createOtp, isDevMode } from "@/lib/otp";
import { sendPasswordResetEmail } from "@/lib/email";
import { requestPasswordResetSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "auth-strict");
  if (limited) return limited;

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

  // Email enumeration ataklarını engellemek için kayıtlı/kayıtsız akışları
  // arka planda paralel çalıştırıp toplam süreyi normalize ediyoruz.
  const work = (async () => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, isActive: true },
    });

    if (user && user.isActive) {
      const otp = await createOtp(user.id, "password_reset");
      await sendPasswordResetEmail(user.email, otp.code);
      return otp.code;
    }
    return null;
  })();

  const [code] = await Promise.all([
    work,
    new Promise((resolve) => setTimeout(resolve, 600)),
  ]);

  if (code && isDevMode()) {
    return NextResponse.json({ ok: true, devCode: code });
  }
  return NextResponse.json({ ok: true });
}
