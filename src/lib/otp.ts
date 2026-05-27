import { prisma } from "@/lib/db";

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

export type OtpPurpose =
  | "phone_registration"
  | "email_registration"
  | "login"
  | "password_reset";

function generateCode(): string {
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

export async function createOtp(userId: string, purpose: OtpPurpose) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await prisma.otpCode.create({
    data: { userId, code, purpose, expiresAt },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEV OTP] userId=${userId} purpose=${purpose} code=${code}`);
  }

  return { code, expiresAt };
}

export async function verifyOtp(
  userId: string,
  code: string,
  purpose: OtpPurpose,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const otp = await prisma.otpCode.findFirst({
    where: { userId, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return { ok: false, reason: "OTP bulunamadı." };
  if (otp.expiresAt < new Date())
    return { ok: false, reason: "Doğrulama kodu süresi doldu." };

  if (otp.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });
    return {
      ok: false,
      reason: "Çok fazla hatalı deneme. Yeni kod isteyin.",
    };
  }

  if (otp.code !== code) {
    const nextAttempts = otp.attempts + 1;
    await prisma.otpCode.update({
      where: { id: otp.id },
      data:
        nextAttempts >= MAX_OTP_ATTEMPTS
          ? { attempts: nextAttempts, consumedAt: new Date() }
          : { attempts: nextAttempts },
    });
    const remaining = MAX_OTP_ATTEMPTS - nextAttempts;
    if (remaining <= 0) {
      return {
        ok: false,
        reason: "Çok fazla hatalı deneme. Yeni kod isteyin.",
      };
    }
    return {
      ok: false,
      reason: `Kod hatalı. Kalan deneme: ${remaining}.`,
    };
  }

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { consumedAt: new Date() },
  });

  return { ok: true };
}

export function isDevMode(): boolean {
  return process.env.EXPOSE_DEV_OTPS === "true";
}
