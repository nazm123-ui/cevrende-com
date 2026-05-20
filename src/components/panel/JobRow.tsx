import Link from "next/link";
import { JobAction } from "@/components/panel/JobActions";
import { formatJobType, formatRelative } from "@/lib/format";
import { jobLifecycle } from "@/lib/jobs";

type JobRowProps = {
  job: {
    id: string;
    title: string;
    status: string;
    jobType: string;
    neighborhood: string;
    expiresAt: Date;
    createdAt: Date;
    category: { name: string };
  };
};

export default function JobRow({ job }: JobRowProps) {
  const phase = jobLifecycle(job);
  const expiryLabel =
    phase === "pending"
      ? "Yayınlanmadan önce admin incelemesinde"
      : formatExpiry(job.expiresAt);

  return (
    <li className="rounded-2xl border border-ink-100 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/ilanlar/${job.id}`}
            className="block font-semibold text-ink-900 hover:text-brand-700 truncate"
          >
            {job.title}
          </Link>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-500">
            <span>{job.category.name}</span>
            <span>•</span>
            <span>{formatJobType(job.jobType)}</span>
            <span>•</span>
            <span>📍 {job.neighborhood}</span>
            <span>•</span>
            <span>{formatRelative(job.createdAt)}</span>
          </div>
        </div>
        <StatusBadge phase={phase} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-ink-500">{expiryLabel}</span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/panel/ilan/${job.id}`}
            className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50 transition"
          >
            Düzenle
          </Link>
          {phase === "active" && (
            <>
              <JobAction
                jobId={job.id}
                action="extend"
                label="30 Gün Uzat"
                loadingLabel="Uzatılıyor..."
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
          {phase === "expired" && (
            <JobAction
              jobId={job.id}
              action="activate"
              label="Yeniden Yayınla (30 gün)"
              loadingLabel="Yayınlanıyor..."
              variant="primary"
            />
          )}
          {phase === "passive" && (
            <JobAction
              jobId={job.id}
              action="activate"
              label="Yeniden Yayınla"
              loadingLabel="Yayınlanıyor..."
              variant="primary"
            />
          )}
          <JobAction
            jobId={job.id}
            action="delete"
            label="Sil"
            loadingLabel="Siliniyor..."
            variant="danger"
            confirm="Bu ilanı kalıcı olarak silmek istediğinizden emin misiniz?"
          />
        </div>
      </div>
    </li>
  );
}

function StatusBadge({
  phase,
}: {
  phase: "active" | "expired" | "passive" | "pending";
}) {
  const map: Record<typeof phase, { label: string; cls: string }> = {
    active: {
      label: "Yayında",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    expired: {
      label: "Süresi Doldu",
      cls: "bg-amber-50 text-amber-800 border-amber-200",
    },
    passive: {
      label: "Pasif",
      cls: "bg-ink-50 text-ink-700 border-ink-200",
    },
    pending: {
      label: "İncelemede",
      cls: "bg-amber-50 text-amber-800 border-amber-200",
    },
  };
  const m = map[phase];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

function formatExpiry(expiresAt: Date): string {
  const diff = expiresAt.getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  if (days > 1) return `${days} gün sonra sona erecek`;
  if (days === 1) return "Yarın sona erecek";
  if (days === 0) return "Bugün sona eriyor";
  if (days === -1) return "Dün sona erdi";
  return `${Math.abs(days)} gün önce sona erdi`;
}
