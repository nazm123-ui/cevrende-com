import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { WorkerSettings } from "@/lib/phone-visibility";

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
  createdAt: Date;
};

export async function getActiveWorkers(filters: {
  profession?: string;
  neighborhood?: string;
  q?: string;
}): Promise<WorkerListItem[]> {
  const { profession, neighborhood, q } = filters;

  const where: Prisma.UserWhereInput = {
    isActive: true,
    isEmailVerified: true,
    professions: profession ? { has: profession } : { isEmpty: false },
  };

  if (neighborhood) {
    where.neighborhood = neighborhood;
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
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return workers.map((w) => ({
    ...w,
    workerSettings: (w.workerSettings ?? {}) as WorkerSettings,
  }));
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
