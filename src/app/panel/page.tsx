import { redirect } from "next/navigation";
import { requireVerifiedUser } from "@/lib/require-auth";

export default async function PanelPage() {
  await requireVerifiedUser();
  redirect("/panel/profil");
}
