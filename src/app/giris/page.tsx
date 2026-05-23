import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Giriş — çevrende",
};

export default async function GirisPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <AuthShell
      eyebrow="Hoş geldin"
      title="Giriş yap"
      subtitle="E-posta veya telefon numaranla devam et."
    >
      <LoginForm />
    </AuthShell>
  );
}
