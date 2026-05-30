import { prisma } from "@/lib/db";

export type DistrictSummary = {
  id: string;
  slug: string;
  name: string;
  isEnabled: boolean;
  order: number;
  neighborhoods: string[];
};

const DEFAULT_FALLBACK = {
  id: "fallback-pendik",
  slug: "pendik",
  name: "Pendik",
  isEnabled: true,
  order: 1,
  neighborhoods: [],
};

// Aktif (açık) ilçelerin listesi — kayıt/profil/arama dropdown'larında kullanılır.
export async function getEnabledDistricts(): Promise<DistrictSummary[]> {
  const list = await prisma.district.findMany({
    where: { isEnabled: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  if (list.length === 0) {
    // Hiç aktif yoksa minimum garanti: Pendik (DB'ye dokunulmamış yeni deploy korumam)
    return [DEFAULT_FALLBACK];
  }
  return list;
}

export async function getAllDistricts(): Promise<DistrictSummary[]> {
  return prisma.district.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export async function getDistrictBySlug(
  slug: string,
): Promise<DistrictSummary | null> {
  return prisma.district.findUnique({ where: { slug } });
}

export async function getDistrictByName(
  name: string,
): Promise<DistrictSummary | null> {
  return prisma.district.findUnique({ where: { name } });
}

export async function getEnabledDistrictNames(): Promise<string[]> {
  const list = await getEnabledDistricts();
  return list.map((d) => d.name);
}

// Bir ilçenin mahalleleri — kayıt formunda ilçe seçilince yüklenir.
export async function getNeighborhoodsForDistrict(
  slug: string,
): Promise<string[]> {
  const d = await getDistrictBySlug(slug);
  if (!d || !d.isEnabled) return [];
  return d.neighborhoods;
}

// "Pendik, Tuzla ve Kartal" gibi insan okur metin
export function formatDistrictListTr(names: string[]): string {
  if (names.length === 0) return "İstanbul";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} ve ${names[1]}`;
  const last = names[names.length - 1];
  return `${names.slice(0, -1).join(", ")} ve ${last}`;
}
