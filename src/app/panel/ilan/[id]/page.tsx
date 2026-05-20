import Link from "next/link";
import { notFound } from "next/navigation";
import { requireEmployer } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { getOwnedJobById, jobLifecycle } from "@/lib/jobs";
import JobForm, { type JobFormInitial } from "@/components/panel/JobForm";
import { JobAction } from "@/components/panel/JobActions";

export const metadata = { title: "İlanı Düzenle — Cevrende.com" };

type Params = Promise<{ id: string }>;

export default async function IlanDuzenlePage({ params }: { params: Params }) {
  const user = await requireEmployer();
  const { id } = await params;

  const [job, categories] = await Promise.all([
    getOwnedJobById(id, user.id),
    prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  if (!job) notFound();

  const phase = jobLifecycle(job);

  const initial: JobFormInitial = {
    title: job.title,
    description: job.description,
    categorySlug: job.category.slug,
    jobType: job.jobType,
    neighborhood: job.neighborhood,
    workDate: job.workDate
      ? job.workDate.toISOString().slice(0, 10)
      : "",
    startTime: job.startTime ?? "",
    endTime: job.endTime ?? "",
    salaryAmount: job.salaryAmount?.toString() ?? "",
    salaryType: job.salaryType,
    neededPeopleCount: job.neededPeopleCount,
    experienceRequired: job.experienceRequired,
    benefits: job.benefits
      ? job.benefits.split(",").map((b) => b.trim()).filter(Boolean)
      : [],
    mapLocationUrl: job.mapLocationUrl ?? "",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <Link href="/panel" className="text-sm text-brand-700 hover:underline">
        ← Panele Dön
      </Link>

      <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            İlanı Düzenle
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Değişiklikleri kaydet veya sağdaki menüden ilan durumunu yönet.
          </p>
          <div className="mt-6">
            <JobForm
              categories={categories}
              mode="edit"
              jobId={job.id}
              initial={initial}
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-ink-900">Durum</h2>
            <p className="mt-2 text-sm text-ink-700">
              {phase === "active" && (
                <span className="text-green-700">Yayında</span>
              )}
              {phase === "expired" && (
                <span className="text-amber-700">Süresi Doldu</span>
              )}
              {phase === "passive" && (
                <span className="text-ink-700">Pasif</span>
              )}
              {phase === "pending" && (
                <span className="text-amber-700">İncelemede</span>
              )}
            </p>
            {phase === "pending" ? (
              <p className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">
                İlan içeriği şüpheli ifadeler içerdiği için admin onayı
                bekliyor. İçeriği düzenleyip kaydederseniz tekrar
                değerlendirilir.
              </p>
            ) : (
              <p className="mt-1 text-xs text-ink-500">
                Sona erme: {job.expiresAt.toLocaleDateString("tr-TR")}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              {phase === "active" && (
                <>
                  <JobAction
                    jobId={job.id}
                    action="extend"
                    label="30 Gün Uzat"
                    loadingLabel="Uzatılıyor..."
                    variant="primary"
                  />
                  <JobAction
                    jobId={job.id}
                    action="passivate"
                    label="Yayından Kaldır"
                    loadingLabel="Kaldırılıyor..."
                    confirm="Bu ilanı yayından kaldırmak istediğinizden emin misiniz?"
                  />
                </>
              )}
              {(phase === "expired" || phase === "passive") && (
                <JobAction
                  jobId={job.id}
                  action="activate"
                  label={
                    phase === "expired"
                      ? "Yeniden Yayınla (30 gün)"
                      : "Yeniden Yayınla"
                  }
                  loadingLabel="Yayınlanıyor..."
                  variant="primary"
                />
              )}
              <JobAction
                jobId={job.id}
                action="delete"
                label="İlanı Sil"
                loadingLabel="Siliniyor..."
                variant="danger"
                confirm="Bu ilanı kalıcı olarak silmek istediğinizden emin misiniz?"
              />
            </div>
          </div>

          <Link
            href={`/ilanlar/${job.id}`}
            className="block rounded-2xl border border-ink-100 bg-white p-5 text-center text-sm font-medium text-brand-700 shadow-sm hover:bg-ink-50 transition"
          >
            İlanın ziyaretçi görünümünü aç ↗
          </Link>
        </aside>
      </div>
    </div>
  );
}
