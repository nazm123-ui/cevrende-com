import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Kayıt Ol — Cevrende.com",
};

export default async function KayitPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <AuthShell
      title="Kayıt Ol"
      subtitle="Ücretsiz hesap oluştur, mahallendeki kişilerle tanış."
    >
      <RegisterForm />
    </AuthShell>
  );
}
