import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Giriş Yap — Cevrende.com",
};

export default async function GirisPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <AuthShell title="Giriş Yap" subtitle="Hesabına giriş yap.">
      <LoginForm />
    </AuthShell>
  );
}
