import Link from "next/link";
import { redirect } from "next/navigation";
import { requireVerifiedUser } from "@/lib/require-auth";
import { getOwnedJobs, jobLifecycle } from "@/lib/jobs";
import JobRow from "@/components/panel/JobRow";

export const metadata = { title: "İşveren Paneli — Cevrende.com" };

export default async function PanelPage() {
  const user = await requireVerifiedUser();
  if (user.role === "worker") redirect("/panel/profil");
  if (user.role !== "employer") redirect("/");
  const jobs = await getOwnedJobs(user.id);

  const pending = jobs.filter((j) => jobLifecycle(j) === "pending");
  const active = jobs.filter((j) => jobLifecycle(j) === "active");
  const expired = jobs.filter((j) => jobLifecycle(j) === "expired");
  const passive = jobs.filter((j) => jobLifecycle(j) === "passive");

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            İşveren Paneli
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Merhaba, {user.fullName.split(" ")[0]}. İlanlarını buradan yönet.
          </p>
        </div>
        <Link
          href="/panel/ilan-yeni"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 transition"
        >
          + Yeni İlan
        </Link>
      </header>

      {jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-10">
          {pending.length > 0 && (
            <div>
              <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <p className="font-semibold">
                  {pending.length} ilanın incelemede.
                </p>
                <p className="mt-0.5 text-amber-800/90">
                  İçeriği şüpheli ifadeler içerdiği için admin onayı bekleniyor.
                  Bu süre içinde ilan yayında görünmez.
                </p>
              </div>
              <JobGroup
                title="İncelemedeki İlanlar"
                count={pending.length}
                jobs={pending}
                emptyText=""
              />
            </div>
          )}
          <JobGroup
            title="Aktif İlanlar"
            count={active.length}
            jobs={active}
            emptyText="Aktif ilanın yok."
          />
          {expired.length > 0 && (
            <JobGroup
              title="Süresi Dolan İlanlar"
              count={expired.length}
              jobs={expired}
              emptyText=""
            />
          )}
          {passive.length > 0 && (
            <JobGroup
              title="Pasif İlanlar"
              count={passive.length}
              jobs={passive}
              emptyText=""
            />
          )}
        </div>
      )}
    </div>
  );
}

function JobGroup({
  title,
  count,
  jobs,
  emptyText,
}: {
  title: string;
  count: number;
  jobs: React.ComponentProps<typeof JobRow>["job"][];
  emptyText: string;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-ink-900 mb-3">
        {title}{" "}
        <span className="text-sm font-normal text-ink-500">({count})</span>
      </h2>
      {jobs.length === 0 ? (
        <p className="text-sm text-ink-500">{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((j) => (
            <JobRow key={j.id} job={j} />
          ))}
        </ul>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
      <p className="text-base font-medium text-ink-900">
        Henüz ilan oluşturmadın.
      </p>
      <p className="mt-1 text-sm text-ink-500">
        İlk ilanını oluşturmak için aşağıdaki butona tıkla.
      </p>
      <Link
        href="/panel/ilan-yeni"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 transition"
      >
        + İlk İlanını Oluştur
      </Link>
    </div>
  );
}
