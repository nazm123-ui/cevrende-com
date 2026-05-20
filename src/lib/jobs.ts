import { prisma } from "@/lib/db";
import type { JobInput } from "@/lib/job-validators";
import {
  checkContent,
  describeCategories,
  type FilterCategory,
} from "@/lib/content-filter";

const POST_TTL_DAYS = 30;
export const POST_TTL_MS = POST_TTL_DAYS * 24 * 60 * 60 * 1000;

export type JobActionResult =
  | { ok: true; jobId: string; pendingReview?: boolean }
  | {
      ok: false;
      error: string;
      status?: number;
      blockedCategories?: FilterCategory[];
    };

export async function getOwnedJobs(employerId: string) {
  return prisma.jobPost.findMany({
    where: { employerId },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true, slug: true } } },
  });
}

export async function getOwnedJobById(id: string, employerId: string) {
  return prisma.jobPost.findFirst({
    where: { id, employerId },
    include: { category: { select: { name: true, slug: true } } },
  });
}

function parseWorkDate(input: string | undefined | null): Date | null {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createJob(
  employerId: string,
  data: JobInput,
): Promise<JobActionResult> {
  const category = await prisma.jobCategory.findUnique({
    where: { slug: data.categorySlug },
    select: { id: true, isActive: true },
  });
  if (!category || !category.isActive) {
    return { ok: false, error: "Geçersiz kategori.", status: 400 };
  }

  const check = checkContent(data.title, data.description);

  if (check.blockedCategories.length > 0) {
    return {
      ok: false,
      status: 400,
      error: `İlan içeriğinde uygunsuz ifadeler tespit edildi (${describeCategories(
        check.blockedCategories,
      )}). Lütfen düzeltip tekrar deneyin.`,
      blockedCategories: check.blockedCategories,
    };
  }

  const status =
    check.flaggedCategories.length > 0 ? "pending_review" : "active";

  const job = await prisma.jobPost.create({
    data: {
      employerId,
      title: data.title,
      description: data.description,
      categoryId: category.id,
      jobType: data.jobType,
      neighborhood: data.neighborhood,
      workDate: parseWorkDate(data.workDate),
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      salaryAmount: data.salaryAmount,
      salaryType: data.salaryType,
      neededPeopleCount: data.neededPeopleCount,
      experienceRequired: data.experienceRequired,
      benefits: data.benefits.join(","),
      mapLocationUrl: data.mapLocationUrl ?? null,
      status,
      expiresAt: new Date(Date.now() + POST_TTL_MS),
    },
    select: { id: true },
  });

  return {
    ok: true,
    jobId: job.id,
    pendingReview: status === "pending_review",
  };
}

export async function updateJob(
  id: string,
  employerId: string,
  data: JobInput,
): Promise<JobActionResult> {
  const existing = await prisma.jobPost.findFirst({
    where: { id, employerId },
    select: { id: true, status: true },
  });
  if (!existing)
    return { ok: false, error: "İlan bulunamadı.", status: 404 };

  const category = await prisma.jobCategory.findUnique({
    where: { slug: data.categorySlug },
    select: { id: true, isActive: true },
  });
  if (!category || !category.isActive) {
    return { ok: false, error: "Geçersiz kategori.", status: 400 };
  }

  const check = checkContent(data.title, data.description);

  if (check.blockedCategories.length > 0) {
    return {
      ok: false,
      status: 400,
      error: `İlan içeriğinde uygunsuz ifadeler tespit edildi (${describeCategories(
        check.blockedCategories,
      )}). Lütfen düzeltip tekrar deneyin.`,
      blockedCategories: check.blockedCategories,
    };
  }

  // status değişimi: passive olanı dokunma; active/pending_review olanı
  // içerik kontrol sonucuna göre yeniden ata.
  const newStatus =
    existing.status === "passive"
      ? "passive"
      : check.flaggedCategories.length > 0
        ? "pending_review"
        : "active";

  await prisma.jobPost.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      categoryId: category.id,
      jobType: data.jobType,
      neighborhood: data.neighborhood,
      workDate: parseWorkDate(data.workDate),
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      salaryAmount: data.salaryAmount,
      salaryType: data.salaryType,
      neededPeopleCount: data.neededPeopleCount,
      experienceRequired: data.experienceRequired,
      benefits: data.benefits.join(","),
      mapLocationUrl: data.mapLocationUrl ?? null,
      status: newStatus,
    },
  });

  return {
    ok: true,
    jobId: id,
    pendingReview: newStatus === "pending_review",
  };
}

export async function extendJob(
  id: string,
  employerId: string,
): Promise<JobActionResult> {
  const existing = await prisma.jobPost.findFirst({
    where: { id, employerId },
    select: { id: true, expiresAt: true },
  });
  if (!existing)
    return { ok: false, error: "İlan bulunamadı.", status: 404 };

  const base =
    existing.expiresAt > new Date() ? existing.expiresAt : new Date();
  const newExpiry = new Date(base.getTime() + POST_TTL_MS);

  await prisma.jobPost.update({
    where: { id },
    data: { expiresAt: newExpiry, status: "active" },
  });

  return { ok: true, jobId: id };
}

export async function passivateJob(
  id: string,
  employerId: string,
): Promise<JobActionResult> {
  const existing = await prisma.jobPost.findFirst({
    where: { id, employerId },
    select: { id: true },
  });
  if (!existing)
    return { ok: false, error: "İlan bulunamadı.", status: 404 };

  await prisma.jobPost.update({
    where: { id },
    data: { status: "passive" },
  });
  return { ok: true, jobId: id };
}

export async function activateJob(
  id: string,
  employerId: string,
): Promise<JobActionResult> {
  const existing = await prisma.jobPost.findFirst({
    where: { id, employerId },
    select: { id: true, expiresAt: true },
  });
  if (!existing)
    return { ok: false, error: "İlan bulunamadı.", status: 404 };

  // Süresi dolmuşsa otomatik 30 gün ekleyerek aktive et
  const expiresAt =
    existing.expiresAt > new Date()
      ? existing.expiresAt
      : new Date(Date.now() + POST_TTL_MS);

  await prisma.jobPost.update({
    where: { id },
    data: { status: "active", expiresAt },
  });
  return { ok: true, jobId: id };
}

export async function deleteJob(
  id: string,
  employerId: string,
): Promise<JobActionResult> {
  const existing = await prisma.jobPost.findFirst({
    where: { id, employerId },
    select: { id: true },
  });
  if (!existing)
    return { ok: false, error: "İlan bulunamadı.", status: 404 };

  await prisma.jobPost.delete({ where: { id } });
  return { ok: true, jobId: id };
}

export function jobLifecycle(job: { status: string; expiresAt: Date }):
  | "active"
  | "expired"
  | "passive"
  | "pending" {
  if (job.status === "passive") return "passive";
  if (job.status === "pending_review") return "pending";
  if (job.expiresAt <= new Date()) return "expired";
  return "active";
}


export type JobFilters = {
  category?: string;
  neighborhood?: string;
  jobType?: string;
  q?: string;
};

export async function getActiveJobs(filters: JobFilters) {
  const now = new Date();

  const categoryFilter = filters.category
    ? { category: { slug: filters.category, isActive: true } }
    : {};

  return prisma.jobPost.findMany({
    where: {
      status: "active",
      expiresAt: { gt: now },
      ...categoryFilter,
      ...(filters.neighborhood ? { neighborhood: filters.neighborhood } : {}),
      ...(filters.jobType ? { jobType: filters.jobType } : {}),
      ...(filters.q
        ? {
            OR: [
              { title: { contains: filters.q } },
              { description: { contains: filters.q } },
            ],
          }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }],
    include: {
      category: { select: { name: true, slug: true } },
      employer: {
        select: {
          fullName: true,
          phone: true,
          isPhoneVerified: true,
        },
      },
    },
    take: 60,
  });
}

export async function getActiveJobById(id: string) {
  return prisma.jobPost.findFirst({
    where: {
      id,
      status: "active",
      expiresAt: { gt: new Date() },
    },
    include: {
      category: { select: { name: true, slug: true } },
      employer: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          isPhoneVerified: true,
        },
      },
    },
  });
}

export function buildMapUrl(job: {
  mapLocationUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  neighborhood: string;
  district: string;
  city: string;
}): string {
  if (job.mapLocationUrl) return job.mapLocationUrl;
  if (job.latitude != null && job.longitude != null) {
    return `https://www.google.com/maps?q=${job.latitude},${job.longitude}`;
  }
  const query = encodeURIComponent(
    `${job.neighborhood} ${job.district} ${job.city}`,
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export async function getActiveCategoriesWithCounts() {
  const cats = await prisma.jobCategory.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });

  const counts = await prisma.jobPost.groupBy({
    by: ["categoryId"],
    where: { status: "active", expiresAt: { gt: new Date() } },
    _count: { _all: true },
  });

  const catIdToSlug = await prisma.jobCategory.findMany({
    select: { id: true, slug: true },
  });
  const idToSlug = new Map(catIdToSlug.map((c) => [c.id, c.slug]));
  const slugCount = new Map<string, number>();
  for (const c of counts) {
    const slug = idToSlug.get(c.categoryId);
    if (slug) slugCount.set(slug, c._count._all);
  }

  return cats.map((c) => ({ ...c, count: slugCount.get(c.slug) ?? 0 }));
}
