import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { WorkerSettings } from "@/lib/phone-visibility";
import { getPublicUrl } from "@/lib/r2";
import { normalizeTr } from "@/lib/normalize-tr";

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
  take = 100,
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
    take,
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

  // Serbest metin araması: Türkçe harf duyarsız (ğ↔g, ı↔i, ş↔s, ö↔o, ü↔u, ç↔c).
  // Eşleştirme JS'te yapılır; çünkü Postgres `contains` Türkçe aksanı katlamaz.
  // "matematik öğretmeni" gibi çok kelimeli aramada her token ad / tanıtım /
  // meslek adından eşleşebilir; kişi HER token'ı bir yerde karşılamalı.
  const tokens =
    q && q.trim()
      ? normalizeTr(q)
          .split(/\s+/)
          .filter((t) => t.length >= 2)
      : [];

  let categoryNameBySlug: Map<string, string> | null = null;
  if (tokens.length > 0) {
    const cats = await prisma.jobCategory.findMany({
      where: { isActive: true },
      select: { slug: true, name: true },
    });
    categoryNameBySlug = new Map(cats.map((c) => [c.slug, c.name]));
  }

  function textMatch(workers: WorkerListItem[]): WorkerListItem[] {
    if (tokens.length === 0) return workers;
    return workers.filter((w) => {
      const name = normalizeTr(w.fullName);
      const bio = normalizeTr(w.bio ?? "");
      const profs = w.professions.map((s) =>
        normalizeTr(categoryNameBySlug?.get(s) ?? s),
      );
      return tokens.every(
        (tok) =>
          name.includes(tok) ||
          bio.includes(tok) ||
          profs.some((p) => p.includes(tok)),
      );
    });
  }

  // Metin araması varsa daha geniş aday kümesi çek (JS'te eleyeceğiz), sonra 100'e indir.
  const fetchTake = tokens.length > 0 ? 1000 : 100;

  // Önce mahalleye göre dene; mahalle filtresi varsa ekleyerek ara.
  if (neighborhood) {
    const inNeighborhood = textMatch(
      await queryWorkers({ ...where, neighborhood }, fetchTake),
    ).slice(0, 100);
    if (inNeighborhood.length > 0) {
      return { workers: inNeighborhood, widenedToDistrict: false };
    }
    // Mahallede kimse yoksa otomatik ilçe geneline genişlet.
    const inDistrict = textMatch(await queryWorkers(where, fetchTake)).slice(
      0,
      100,
    );
    return { workers: inDistrict, widenedToDistrict: inDistrict.length > 0 };
  }

  const all = textMatch(await queryWorkers(where, fetchTake)).slice(0, 100);
  return { workers: all, widenedToDistrict: false };
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
