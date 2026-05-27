import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatRelative } from "@/lib/format";
import { canSeePhone, type WorkerSettings } from "@/lib/phone-visibility";
import { parseExperiences, formatYearRange } from "@/lib/experience";
import WorkerContactCard from "@/components/workers/WorkerContactCard";
import Icon from "@/components/ui/Icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const w = await prisma.user.findUnique({
    where: { id },
    select: { fullName: true },
  });
  if (!w) return { title: "Profil — Cevrende.com" };
  return { title: `${w.fullName} — Cevrende.com` };
}

export default async function WorkerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [me, worker, categories] = await Promise.all([
    getCurrentUser(),
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        phone: true,
        professions: true,
        bio: true,
        district: true,
        neighborhood: true,
        createdAt: true,
        isActive: true,
        workerSettings: true,
        experiences: true,
      },
    }),
    prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  if (!worker || !worker.isActive || worker.professions.length === 0) {
    notFound();
  }

  const isSelf = me?.id === worker.id;

  let initialSaved = false;
  if (me && !isSelf) {
    const existing = await prisma.savedProfile.findUnique({
      where: { userId_savedUserId: { userId: me.id, savedUserId: worker.id } },
      select: { id: true },
    });
    initialSaved = !!existing;
  }
  const settings = (worker.workerSettings ?? {}) as WorkerSettings;

  const location =
    settings.showDistrict && worker.neighborhood
      ? `${worker.neighborhood}, ${worker.district}`
      : worker.district;

  const initials = getInitials(worker.fullName);
  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));
  const professionNames = worker.professions.map(
    (slug) => categoryNameBySlug.get(slug) ?? slug,
  );

  const headline = worker.bio ? firstLine(worker.bio) : professionNames[0] || "";
  const bioRest = worker.bio ? restOfBio(worker.bio) : "";

  const showFullPhone = canSeePhone(settings);
  const experiences = parseExperiences(worker.experiences);
  const skills = professionNames.slice(0, 6);

  return (
    <div className="page">
      {/* Breadcrumb */}
      <section className="pt-8">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <Link
            href="/cevrendekiler"
            className="text-[13.5px] text-ink-500 hover:text-ink-900 transition inline-flex items-center gap-1"
          >
            <span aria-hidden>←</span> Çevrendekiler
          </Link>
        </div>
      </section>

      <section className="pt-6 pb-24">
        <div
          className="mx-auto max-w-[1200px] px-5 sm:px-6 worker-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 64,
            alignItems: "flex-start",
          }}
        >
          {/* Sol — profil */}
          <div>
            <div className="flex gap-5 items-start flex-wrap">
              {/* Avatar */}
              <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-brand-50 border border-ink-200 text-ink-900 text-[30px] font-medium tracking-[-0.01em] shrink-0">
                {initials}
              </div>

              {/* Ad + meta + headline */}
              <div className="flex-1 min-w-[280px] flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap text-[13.5px] text-ink-500">
                  <span className="font-mono">
                    {formatRelative(worker.createdAt)}
                  </span>
                  <span className="text-ink-400">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Icon name="pin" size={13} /> {location}
                  </span>
                </div>
                <h1 className="text-[32px] sm:text-[36px] font-semibold tracking-[-0.025em] leading-[1.1] m-0">
                  {worker.fullName}
                </h1>
                <p className="text-[17px] text-ink-700 leading-snug m-0">
                  {headline}
                </p>
              </div>
            </div>

            <div className="divider mt-10 mb-10" />

            {/* Hakkında */}
            <h3 className="mb-4">Hakkında</h3>
            <p className="text-[16px] text-ink-700 leading-[1.65] max-w-[640px] whitespace-pre-wrap">
              {bioRest || worker.bio || "Profil sahibi henüz tanıtım yazısı eklememiş."}
            </p>

            {/* Yetkinlikler */}
            <h3 className="mt-10 mb-4">Yetkinlikler</h3>
            <div className="flex gap-2 flex-wrap">
              {skills.map((s) => (
                <span
                  key={s}
                  className="chip chip-muted"
                  style={{ height: 32, padding: "0 14px" }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* İş geçmişi */}
            <h3 className="mt-10 mb-5">İş geçmişi</h3>
            {experiences.length === 0 ? (
              <div className="px-6 py-5 border border-dashed border-ink-200 rounded-[14px] text-ink-500 text-[14px] leading-[1.55]">
                {isSelf
                  ? "Henüz iş deneyimi eklemedin. Profilini düzenleyerek geçmiş işlerini ekleyebilirsin."
                  : "Bu kullanıcı henüz iş deneyimi eklememiş."}
              </div>
            ) : (
              <div className="border-l border-ink-200 pl-6 flex flex-col gap-6">
                {experiences.map((h, i) => (
                  <div key={i} className="relative">
                    <span
                      className="absolute -left-[29px] top-2 w-2.5 h-2.5 rounded-full"
                      style={{
                        background:
                          i === 0
                            ? "var(--color-accent-600)"
                            : "var(--color-ink-200)",
                        boxShadow:
                          i === 0
                            ? "0 0 0 4px rgba(31, 90, 69, 0.13)"
                            : "none",
                      }}
                    />
                    <div className="flex justify-between flex-wrap gap-2">
                      <div className="text-[16px] font-medium tracking-[-0.01em]">
                        {h.role}
                      </div>
                      <div className="font-mono text-[13.5px] text-ink-500">
                        {formatYearRange(h)}
                      </div>
                    </div>
                    <div className="text-[13.5px] text-ink-700 mt-1">
                      {h.workplace}
                    </div>
                    {h.description && (
                      <div className="text-[13.5px] text-ink-500 mt-0.5 leading-[1.55]">
                        {h.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sağ — iletişim kartı */}
          <aside
            className="worker-aside"
            style={{ position: "sticky", top: 96 }}
          >
            <WorkerContactCard
              workerId={worker.id}
              workerPhone={worker.phone}
              showFullPhone={showFullPhone}
              canContact={!!me && me.isEmailVerified}
              isSelf={isSelf}
              initialSaved={initialSaved}
            />

            {!isSelf && (
              <div className="px-6 pt-5 pb-1 text-ink-500 text-[12.5px] leading-[1.55]">
                Sorunlu profil mi?{" "}
                <Link
                  href={`/geri-bildirim?profile=${worker.id}`}
                  className="text-ink-700 underline underline-offset-[3px] hover:text-ink-900 transition"
                >
                  Bildir
                </Link>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

function getInitials(name: string): string {
  const cleaned = name.replace(/\*+/g, "").trim();
  if (!cleaned) return "··";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function firstLine(text: string): string {
  const idx = text.indexOf("\n");
  return idx === -1 ? text.slice(0, 80) : text.slice(0, idx);
}

function restOfBio(text: string): string {
  const idx = text.indexOf("\n");
  if (idx === -1) return text;
  return text.slice(idx + 1).trim();
}
