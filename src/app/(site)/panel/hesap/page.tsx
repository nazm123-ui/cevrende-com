import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import { getDistrictByName } from "@/lib/districts";
import AccountTab from "@/components/profile/AccountTab";

export const metadata = { title: "Hesap Ayarları — Cevrende.com" };
export const dynamic = "force-dynamic";

export default async function HesapPage() {
  const session = await requireVerifiedUser();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.id },
    select: {
      fullName: true,
      email: true,
      phone: true,
      district: true,
      neighborhood: true,
    },
  });

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  const district = await getDistrictByName(user.district);
  const neighborhoods = district?.neighborhoods ?? [];

  return (
    <div className="page">
      <section style={{ padding: "56px 0 96px" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Hesabım
          </div>
          <h2 style={{ fontSize: 32, marginBottom: 32 }}>Hesap Ayarları</h2>
          <AccountTab
            user={{
              id: session.id,
              fullName: user.fullName,
              initials,
              email: user.email,
              phone: user.phone,
              district: user.district,
              neighborhood: user.neighborhood,
              professions: [],
              bio: "",
              profilePhotoUrl: null,
              createdAt: "",
            }}
            neighborhoods={neighborhoods}
          />
        </div>
      </section>
    </div>
  );
}
