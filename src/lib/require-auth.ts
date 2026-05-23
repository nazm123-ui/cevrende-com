import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/giris");
  return user;
}

export async function requireVerifiedUser() {
  const user = await requireUser();
  if (!user.isEmailVerified) {
    redirect(`/dogrulama?userId=${user.id}`);
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdminEmail(user.email)) redirect("/");
  return user;
}
