import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import OtpForm from "@/components/auth/OtpForm";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Hesap Doğrulama — Cevrende.com",
};

type SearchParams = Promise<{ userId?: string }>;

export default async function DogrulamaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const { userId } = await searchParams;

  if (!userId) {
    return (
      <AuthShell title="Hesap Doğrulama">
        <p className="text-sm text-ink-700">
          Bu sayfaya doğrudan erişilemez. Lütfen önce{" "}
          <Link href="/kayit" className="text-brand-700 underline">
            kayıt
          </Link>{" "}
          olun veya{" "}
          <Link href="/giris" className="text-brand-700 underline">
            giriş yapın
          </Link>
          .
        </p>
      </AuthShell>
    );
  }

  const candidate = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      email: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      isActive: true,
    },
  });

  if (!candidate || !candidate.isActive) {
    return (
      <AuthShell title="Hesap Doğrulama">
        <p className="text-sm text-red-700">
          Kullanıcı bulunamadı veya hesap pasif.
        </p>
      </AuthShell>
    );
  }

  if (candidate.isPhoneVerified && candidate.isEmailVerified) {
    return (
      <AuthShell title="Hesap Doğrulama">
        <p className="text-sm text-ink-700">
          Bu hesap zaten doğrulanmış.{" "}
          <Link href="/giris" className="text-brand-700 underline">
            Giriş yap
          </Link>
          .
        </p>
      </AuthShell>
    );
  }

  const phoneMasked = maskPhone(candidate.phone);
  const emailMasked = maskEmail(candidate.email);

  return (
    <AuthShell
      eyebrow="Son adım"
      title="Hesabını Doğrula"
      subtitle="Telefonuna SMS ve e-postana doğrulama kodu gönderildi. İkisini de gir."
    >
      <OtpForm
        userId={candidate.id}
        needsPhone={!candidate.isPhoneVerified}
        needsEmail={!candidate.isEmailVerified}
        phoneMasked={phoneMasked}
        emailMasked={emailMasked}
        redirectTo="/"
      />
    </AuthShell>
  );
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return digits.slice(0, 3) + "****" + digits.slice(-2);
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${local[1]}***@${domain}`;
}
