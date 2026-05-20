import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getActiveJobById, buildMapUrl } from "@/lib/jobs";
import { getCurrentUser } from "@/lib/auth";
import { type Viewer } from "@/lib/masking";
import {
  formatDate,
  formatJobType,
  formatRelative,
  formatSalary,
} from "@/lib/format";
import ContactCard from "@/components/jobs/ContactCard";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getActiveJobById(id);
  if (!job) return { title: "İlan bulunamadı — Cevrende.com" };
  return {
    title: `${job.title} — Cevrende.com`,
    description: job.description.slice(0, 160),
  };
}

const BENEFIT_LABELS: Record<string, string> = {
  meal: "Yemek",
  transport: "Yol",
  uniform: "Üniforma",
};

export default async function IlanDetayPage({ params }: { params: Params }) {
  const { id } = await params;
  const [job, user] = await Promise.all([
    getActiveJobById(id),
    getCurrentUser(),
  ]);

  if (!job) notFound();

  const viewer: Viewer = user
    ? user.isPhoneVerified
      ? { kind: "verified", userId: user.id }
      : { kind: "unverified", userId: user.id }
    : { kind: "guest" };

  const salary = formatSalary(job.salaryAmount, job.salaryType);
  const benefits = job.benefits
    ? job.benefits
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
    : [];
  const mapUrl = buildMapUrl(job);
  const isUrgent = job.jobType === "urgent";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <Link
        href="/ilanlar"
        className="text-sm text-brand-700 hover:underline"
      >
        ← Tüm İlanlar
      </Link>

      <header className="mt-3">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="flex-1 text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight leading-tight">
            {job.title}
          </h1>
          {isUrgent && (
            <span className="rounded-full bg-accent-100 text-accent-700 text-xs font-semibold px-2.5 py-1">
              Acil
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-500">
          <span className="inline-flex items-center gap-1 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 text-brand-700 font-medium text-xs">
            {job.category.name}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-ink-100 bg-white px-2.5 py-0.5 text-ink-700 font-medium text-xs">
            {formatJobType(job.jobType)}
          </span>
          <span>
            📍 {job.city} / {job.district} / {job.neighborhood}
          </span>
          <span>Yayın: {formatRelative(job.createdAt)}</span>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <main className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-ink-900">
              İş Açıklaması
            </h2>
            <p className="mt-3 text-ink-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">
              Çalışma Bilgileri
            </h2>
            <dl className="mt-3 grid gap-4 sm:grid-cols-2">
              {salary && <Info label="Ücret" value={salary} />}
              {job.workDate && (
                <Info
                  label="Çalışma Tarihi"
                  value={formatDate(job.workDate)}
                />
              )}
              {job.startTime && job.endTime && (
                <Info
                  label="Çalışma Saatleri"
                  value={`${job.startTime} – ${job.endTime}`}
                />
              )}
              <Info
                label="Aranan Kişi Sayısı"
                value={`${job.neededPeopleCount} kişi`}
              />
              <Info
                label="Deneyim"
                value={job.experienceRequired ? "Gerekli" : "Gerekli değil"}
              />
              {benefits.length > 0 && (
                <Info
                  label="Sunulan İmkanlar"
                  value={benefits
                    .map((b) => BENEFIT_LABELS[b] ?? b)
                    .join(" • ")}
                />
              )}
            </dl>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">Konum</h2>
            <div className="mt-3 rounded-2xl border border-ink-100 bg-white p-5">
              <p className="text-ink-900 font-medium">
                {job.city} / {job.district} / {job.neighborhood}
              </p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 transition"
              >
                🗺️ Konumu Haritada Aç
              </a>
              <p className="mt-2 text-xs text-ink-500">
                Google Maps üzerinden açılır.
              </p>
            </div>
          </section>
        </main>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ContactCard employer={job.employer} viewer={viewer} />
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="mt-1 font-medium text-ink-900">{value}</dd>
    </div>
  );
}
