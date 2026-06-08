import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { WorkerSettings } from "@/lib/phone-visibility";
import { getPublicUrl } from "@/lib/r2";

export type { WorkerSettings };

export type WorkerListItem = {
  id: string;
  fullName: string;
  phone: string;
  district: string;
  neighborhood: string | null;
  professions: string[];
  bio: string | null;
  workerSettings: WorkerSettings;
  isAvailable: boolean;
  isOnline: boolean;
  profilePhotoUrl: string | null;
  createdAt: Date;
};

// Son 5 dakika içinde heartbeat atanlar "online" kabul edilir.
export const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;

export function isUserOnline(lastSeenAt: Date | null): boolean {
  if (!lastSeenAt) return false;
  return Date.now() - lastSeenAt.getTime() < ONLINE_THRESHOLD_MS;
}

export type WorkerSearchResult = {
  workers: WorkerListItem[];
  // Mahalle filtresinde sonuç çıkmadığı için otomatik ilçe geneline
  // genişletildiyse true olur — arayüzde kullanıcıya bildiriyoruz.
  widenedToDistrict: boolean;
};

async function queryWorkers(
  where: Prisma.UserWhereInput,
): Promise<WorkerListItem[]> {
  const workers = await prisma.user.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      phone: true,
      district: true,
      neighborhood: true,
      professions: true,
      bio: true,
      workerSettings: true,
      isAvailable: true,
      lastSeenAt: true,
      profilePhotoKey: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const enriched = workers.map((w) => ({
    id: w.id,
    fullName: w.fullName,
    phone: w.phone,
    district: w.district,
    neighborhood: w.neighborhood,
    professions: w.professions,
    bio: w.bio,
    workerSettings: (w.workerSettings ?? {}) as WorkerSettings,
    isAvailable: w.isAvailable,
    isOnline: isUserOnline(w.lastSeenAt),
    profilePhotoUrl: w.profilePhotoKey ? getPublicUrl(w.profilePhotoKey) : null,
    createdAt: w.createdAt,
  }));

  // Online + müsait kullanıcılar en üstte, sonra son aktiviteye göre.
  enriched.sort((a, b) => {
    if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return enriched;
}

export async function getActiveWorkers(filters: {
  profession?: string;
  district?: string;
  neighborhood?: string;
  q?: string;
}): Promise<WorkerSearchResult> {
  const { profession, district, neighborhood, q } = filters;

  // Müsait olmayan işçiler listede görünmez (yalnızca profil URL'i ile açılır).
  const where: Prisma.UserWhereInput = {
    isActive: true,
    isEmailVerified: true,
    isAvailable: true,
    professions: profession ? { has: profession } : { isEmpty: false },
  };

  if (district) {
    where.district = district;
  }

  if (q && q.trim()) {
    const query = q.trim();
    const matchingCategories = await prisma.jobCategory.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { slug: true },
    });
    const matchingSlugs = matchingCategories.map((c) => c.slug);

    where.OR = [
      { fullName: { contains: query, mode: "insensitive" } },
      { bio: { contains: query, mode: "insensitive" } },
      ...(matchingSlugs.length > 0
        ? [{ professions: { hasSome: matchingSlugs } }]
        : []),
    ];
  }

  // Önce mahalleye göre dene; mahalle filtresi varsa ekleyerek ara.
  if (neighborhood) {
    const inNeighborhood = await queryWorkers({ ...where, neighborhood });
    if (inNeighborhood.length > 0) {
      return { workers: inNeighborhood, widenedToDistrict: false };
    }
    // Mahallede kimse yoksa otomatik ilçe geneline genişlet.
    const inDistrict = await queryWorkers(where);
    return { workers: inDistrict, widenedToDistrict: inDistrict.length > 0 };
  }

  return { workers: await queryWorkers(where), widenedToDistrict: false };
}

export async function getProfessionCounts(): Promise<
  { slug: string; name: string; count: number }[]
> {
  const [categories, workers] = await Promise.all([
    prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.user.findMany({
      where: {
        isActive: true,
        isEmailVerified: true,
        professions: { isEmpty: false },
      },
      select: { professions: true },
    }),
  ]);

  const counts = new Map<string, number>();
  for (const w of workers) {
    for (const p of w.professions) {
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
  }

  return categories
    .map((c) => ({ slug: c.slug, name: c.name, count: counts.get(c.slug) ?? 0 }))
    .filter((c) => c.count > 0);
}
