import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-auth";
import DistrictsClient from "./DistrictsClient";

export const metadata = { title: "İlçeler — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDistrictsPage() {
  await requireAdmin();
  const districts = await prisma.district.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <DistrictsClient
      initialDistricts={districts.map((d) => ({
        id: d.id,
        slug: d.slug,
        name: d.name,
        isEnabled: d.isEnabled,
        order: d.order,
        neighborhoods: d.neighborhoods,
      }))}
    />
  );
}
