import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatRelative } from "@/lib/format";
import { canSeePhone, type WorkerSettings } from "@/lib/phone-visibility";
import { parseExperiences, formatYearRange } from "@/lib/experience";
import { getInitials } from "@/lib/initials";
import WorkerContactCard from "@/components/workers/WorkerContactCard";
import Icon from "@/components/ui/Icon";
import { isUserOnline } from "@/lib/workers";
import { getPublicUrl } from "@/lib/r2";
import { absoluteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const w = await prisma.user.findUnique({
    where: { id },
    select: {
      fullName: true,
      bio: true,
      professions: true,
      district: true,
      neighborhood: true,
      isActive: true,
      isEmailVerified: true,
    },
  });
  if (!w) {
    return {
      title: "Profil bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  // Aktif olmayan / doğrulanmamış profiller indeksleme
  if (!w.isActive || !w.isEmailVerified) {
    return {
      title: `${w.fullName}`,
      robots: { index: false, follow: false },
    };
  }

  // Meslekleri okunabilir hale getir (kategori slug → isim çevirisi)
  const categories = await prisma.jobCategory.findMany({
    where: { slug: { in: w.professions } },
    select: { slug: true, name: true },
  });
  const professionNames = categories.map((c) => c.name);
  const profStr =
    professionNames.length > 0 ? professionNames.slice(0, 3).join(", ") : "Usta";
  const locStr = w.neighborhood
    ? `${w.neighborhood}, ${w.district}`
    : w.district;

  const title = `${w.fullName} — ${profStr} · ${locStr}`;
  const description = w.bio
    ? `${w.bio.slice(0, 140)}${w.bio.length > 140 ? "…" : ""} ${locStr}'te ${profStr.toLowerCase()} arayanlar için Çevrende profili.`
    : `${w.fullName} — ${locStr}'te ${profStr.toLowerCase()} hizmeti veriyor. Doğrudan mesajlaş, aracısız iletişime geç. Cevrende.com`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical: `/cevrendekiler/${id}` },
    openGraph: {
      title,
      description: description.slice(0, 200),
      url: `/cevrendekiler/${id}`,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description: description.slice(0, 200),
    },
  };
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
        isAvailable: true,
        lastSeenAt: true,
        profilePhotoKey: true,
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

  // Person yapısal verisi — AI aramalarda ve zengin sonuçlarda kişiyi tanımlar.
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: worker.fullName,
    ...(professionNames.length > 0
      ? { jobTitle: professionNames.join(", ") }
      : {}),
    url: absoluteUrl(`/cevrendekiler/${worker.id}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: worker.district,
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${worker.district}, İstanbul`,
    },
    ...(worker.bio ? { description: worker.bio.slice(0, 250) } : {}),
    ...(worker.profilePhotoKey
      ? { image: getPublicUrl(worker.profilePhotoKey) }
      : {}),
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
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
              <div className="relative shrink-0">
                {worker.profilePhotoKey ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getPublicUrl(worker.profilePhotoKey)}
                    alt={worker.fullName}
                    className="h-[84px] w-[84px] rounded-full object-cover border border-ink-200 bg-brand-50"
                  />
                ) : (
                  <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-brand-50 border border-ink-200 text-ink-900 text-[30px] font-medium tracking-[-0.01em]">
                    {initials}
                  </div>
                )}
                {isUserOnline(worker.lastSeenAt) && (
                  <span
                    className="absolute bottom-1 right-1 w-[18px] h-[18px] rounded-full bg-emerald-500 border-[3px] border-white"
                    aria-label="Çevrimiçi"
                  />
                )}
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
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-[32px] sm:text-[36px] font-semibold tracking-[-0.025em] leading-[1.1] m-0">
                    {worker.fullName}
                  </h1>
                  {isUserOnline(worker.lastSeenAt) && (
                    <span className="inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-medium">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Çevrimiçi
                    </span>
                  )}
                  {!worker.isAvailable && (
                    <span className="inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-full bg-ink-100 text-ink-700 text-[12px] font-medium">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink-400" />
                      Şu an dolu
                    </span>
                  )}
                </div>
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
              isAvailable={worker.isAvailable}
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


function firstLine(text: string): string {
  const idx = text.indexOf("\n");
  return idx === -1 ? text.slice(0, 80) : text.slice(0, idx);
}

function restOfBio(text: string): string {
  const idx = text.indexOf("\n");
  if (idx === -1) return text;
  return text.slice(idx + 1).trim();
}
