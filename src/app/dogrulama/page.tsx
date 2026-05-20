import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import OtpForm from "@/components/auth/OtpForm";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Telefon Doğrulama — Cevrende.com",
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
      <AuthShell title="Telefon Doğrulama">
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
    select: { id: true, phone: true, isPhoneVerified: true, isActive: true },
  });

  if (!candidate || !candidate.isActive) {
    return (
      <AuthShell title="Telefon Doğrulama">
        <p className="text-sm text-red-700">
          Kullanıcı bulunamadı veya hesap pasif.
        </p>
      </AuthShell>
    );
  }

  if (candidate.isPhoneVerified) {
    return (
      <AuthShell title="Telefon Doğrulama">
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

  const masked = candidate.phone.replace(/^(\d{3})\d{4}(\d{2})(\d{2})$/, "$1****$2$3");

  return (
    <AuthShell
      title="Telefonunu Doğrula"
      subtitle={`${masked} numarasına gönderilen 6 haneli kodu gir.`}
    >
      <OtpForm userId={candidate.id} redirectTo="/" />
    </AuthShell>
  );
}
