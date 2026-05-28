import { redirect } from "next/navigation";
import { requireVerifiedUser } from "@/lib/require-auth";

export const metadata = {
  title: "Kontrol Paneli — Cevrende",
  description: "Profil, mesajlar ve taleplerinizi yönetin.",
};

export default async function PanelPage() {
  await requireVerifiedUser();
  redirect("/panel/profil");
}
