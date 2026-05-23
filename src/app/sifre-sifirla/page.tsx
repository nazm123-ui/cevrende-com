import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Şifremi Unuttum — Cevrende.com",
};

export default async function SifreSifirlaPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <AuthShell
      title="Şifremi Unuttum"
      subtitle="E-postana bir kod göndereceğiz. Yeni şifreni o kodla belirleyebilirsin."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
