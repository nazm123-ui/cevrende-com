import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";
import { getEnabledDistricts, formatDistrictListTr } from "@/lib/districts";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const districts = await getEnabledDistricts();
  const names = districts.map((d) => d.name);
  const locationLabel = formatDistrictListTr(names);
  return {
    title: `${locationLabel}'te Usta Profili Aç — Ücretsiz Hizmet Bulma`,
    description: `${locationLabel}'te mesleğini paylaş, mahallendeki işverenler seni bulsun. Ücretsiz profil, komisyonsuz iletişim.`,
  };
}

export default async function KayitPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const districts = await getEnabledDistricts();

  return (
    <AuthShell
      eyebrow="Aramıza katıl"
      title="Ücretsiz hesap aç"
      subtitle="Mahallendeki meslek sahibi kişilerle aracısız tanışmak için."
    >
      <RegisterForm
        districts={districts.map((d) => ({
          slug: d.slug,
          name: d.name,
          neighborhoods: d.neighborhoods,
        }))}
      />
    </AuthShell>
  );
}
