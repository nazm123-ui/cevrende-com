import { NextResponse, after } from "next/server";
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

  // Email enumeration timing attack koruması:
  // 1) DB + OTP yazma response'a dahil (hızlı işler, ~200ms)
  // 2) Mail gönderimi after() ile response sonrasına ertelendi (2-3s SMTP latency'si gizlenir)
  // 3) 600ms taban gecikme: registered/unregistered yanıt süresi normalize edilir
  const work = (async () => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, isActive: true },
    });

    if (user && user.isActive) {
      const otp = await createOtp(user.id, "password_reset");
      after(async () => {
        try {
          await sendPasswordResetEmail(user.email, otp.code);
        } catch (err) {
          console.error("[request-password-reset] mail send failed:", err);
        }
      });
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
