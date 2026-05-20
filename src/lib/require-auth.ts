import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/giris");
  return user;
}

export async function requireVerifiedUser() {
  const user = await requireUser();
  if (!user.isPhoneVerified) redirect("/dogrulama");
  return user;
}

export async function requireEmployer() {
  const user = await requireVerifiedUser();
  if (user.role !== "employer") redirect("/");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}
