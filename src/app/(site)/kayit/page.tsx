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
    title: `${locationLabel}'te Hizmet Veriyorsan Ücretsiz Profil Oluştur`,
    description: `${locationLabel}'te mesleğini ve mahalleni ekle, çevrendeki insanlar sana doğrudan ulaşsın. Ücretsiz profil, komisyonsuz iletişim, üyelik ücreti yok.`,
  };
}

export default async function KayitPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const districts = await getEnabledDistricts();

  return (
    <AuthShell
      eyebrow="Pendik'te görünür ol"
      title="Ücretsiz profil oluştur"
      subtitle="Mesleğini, hizmetlerini ve mahalleni ekle — çevrendeki insanlar sana doğrudan ulaşsın. Komisyon yok, aracı yok, üyelik ücreti yok."
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
