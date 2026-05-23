import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Pendik'te Usta Profili Aç — Ücretsiz Hizmet Bulma",
  description:
    "Pendik'te mesleğini paylaş, mahallendeki işverenler seni bulsun. Ücretsiz profil, komisyonsuz iletişim.",
};

export default async function KayitPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <AuthShell
      eyebrow="Aramıza katıl"
      title="Ücretsiz hesap aç"
      subtitle="Mahallendeki meslek sahibi kişilerle aracısız tanışmak için."
    >
      <RegisterForm />
    </AuthShell>
  );
}
