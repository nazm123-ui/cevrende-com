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
      email: true,
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

  if (candidate.isEmailVerified) {
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

  const emailMasked = maskEmail(candidate.email);

  return (
    <AuthShell
      eyebrow="Son adım"
      title="Hesabını Doğrula"
      subtitle="E-postana 6 haneli doğrulama kodu gönderildi."
    >
      <OtpForm
        userId={candidate.id}
        emailMasked={emailMasked}
        redirectTo="/"
      />
    </AuthShell>
  );
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${local[1]}***@${domain}`;
}
