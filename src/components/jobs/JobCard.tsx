import Link from "next/link";
import { maskName } from "@/lib/masking";
import {
  formatDate,
  formatJobType,
  formatRelative,
  formatSalary,
} from "@/lib/format";

type JobCardProps = {
  job: {
    id: string;
    title: string;
    description: string;
    jobType: string;
    neighborhood: string;
    salaryAmount: number | null;
    salaryType: string;
    workDate: Date | null;
    startTime: string | null;
    endTime: string | null;
    createdAt: Date;
    category: { name: string; slug: string };
    employer: { fullName: string };
  };
  canSeeFullEmployer: boolean;
};

export default function JobCard({ job, canSeeFullEmployer }: JobCardProps) {
  const salary = formatSalary(job.salaryAmount, job.salaryType);
  const employerLabel = canSeeFullEmployer
    ? job.employer.fullName
    : maskName(job.employer.fullName);
  const isUrgent = job.jobType === "urgent";

  return (
    <article
      className={`flex flex-col bg-white border ${
        isUrgent ? "border-accent-200" : "border-ink-100"
      } rounded-2xl p-5 shadow-sm hover:shadow-md transition`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-ink-900 leading-snug">{job.title}</h3>
        {isUrgent && (
          <span className="shrink-0 rounded-full bg-accent-100 text-accent-700 text-xs font-semibold px-2 py-0.5">
            Acil
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge tone="brand">{job.category.name}</Badge>
        <Badge>{formatJobType(job.jobType)}</Badge>
        <Badge tone="ink">📍 {job.neighborhood}</Badge>
      </div>

      <p className="mt-3 text-sm text-ink-500 leading-relaxed line-clamp-2">
        {job.description}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {salary && (
          <div>
            <dt className="text-xs text-ink-500">Ücret</dt>
            <dd className="font-semibold text-ink-900">{salary}</dd>
          </div>
        )}
        {job.workDate && (
          <div>
            <dt className="text-xs text-ink-500">Çalışma Tarihi</dt>
            <dd className="font-medium text-ink-900">
              {formatDate(job.workDate)}
            </dd>
          </div>
        )}
        {job.startTime && job.endTime && (
          <div>
            <dt className="text-xs text-ink-500">Saat</dt>
            <dd className="font-medium text-ink-900">
              {job.startTime} – {job.endTime}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-ink-500">İlan Veren</dt>
          <dd
            className="font-medium text-ink-900"
            title={
              canSeeFullEmployer
                ? undefined
                : "Tam bilgi için giriş yapın ve telefonunuzu doğrulayın."
            }
          >
            {employerLabel}
          </dd>
        </div>
      </dl>

      <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between gap-2">
        <span className="text-xs text-ink-500">
          {formatRelative(job.createdAt)}
        </span>
        <Link
          href={`/ilanlar/${job.id}`}
          className="text-sm font-semibold text-brand-700 hover:underline"
        >
          Detayları Gör →
        </Link>
      </div>
    </article>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "brand" | "ink" | "neutral";
}) {
  const styles =
    tone === "brand"
      ? "bg-brand-50 text-brand-700 border-brand-100"
      : tone === "ink"
        ? "bg-ink-50 text-ink-700 border-ink-100"
        : "bg-white text-ink-700 border-ink-200";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${styles}`}
    >
      {children}
    </span>
  );
}
