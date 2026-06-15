import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatRelative } from "@/lib/format";
import { getPhoneVisibility, type WorkerSettings } from "@/lib/phone-visibility";
import { getInitials } from "@/lib/initials";
import { isUserOnline } from "@/lib/workers";
import { getPublicUrl } from "@/lib/r2";

export default async function PreviewListings() {
  const workers = await prisma.user.findMany({
    where: {
      professions: { isEmpty: false },
      isActive: true,
      isAvailable: true,
    },
    select: {
      id: true,
      fullName: true,
      bio: true,
      district: true,
      neighborhood: true,
      professions: true,
      createdAt: true,
      workerSettings: true,
      lastSeenAt: true,
      profilePhotoKey: true,
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (workers.length === 0) return null;

  const categories = await prisma.jobCategory.findMany({
    where: { isActive: true },
    select: { slug: true, name: true },
  });
  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));

  return (
    <section className="section-py-lg">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="flex justify-between items-end mb-9 flex-wrap gap-3">
          <div>
            <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium mb-3">
              Yeni profiller
            </p>
            <h2 className="text-balance">Bu hafta katılanlar</h2>
          </div>
          <Link
            href="/cevrendekiler"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-ink-900 text-[14px] font-medium rounded-full hover:bg-ink-100 transition"
          >
            Tümünü gör
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {workers.map((w) => {
            const settings = (w.workerSettings ?? {}) as WorkerSettings;
            const location =
              settings.showDistrict && w.neighborhood
                ? `${w.neighborhood}, ${w.district}`
                : w.district;
            const initials = getInitials(w.fullName);
            const professionNames = w.professions
              .map((slug) => categoryNameBySlug.get(slug) ?? slug)
              .slice(0, 2);
            const phoneVisibility = getPhoneVisibility(settings);

            return (
              <Link
                key={w.id}
                href={`/cevrendekiler/${w.id}`}
                className="card-lift block px-6 py-5 bg-white border border-ink-100 rounded-[14px] hover:border-ink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50"
              >
                <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                  <div className="flex items-center gap-2 text-ink-500 text-[13px]">
                    <span className="font-mono">
                      {formatRelative(w.createdAt)}
                    </span>
                    <span className="text-ink-400">·</span>
                    <span className="inline-flex items-center gap-1">
                      <PinIcon /> {location}
                    </span>
                  </div>
                  {phoneVisibility === "private" && (
                    <span className="text-[12px] text-ink-500">Sadece mesaj</span>
                  )}
                </div>

                <div className="flex gap-4 items-start">
                  <div className="relative shrink-0">
                    {w.profilePhotoKey ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getPublicUrl(w.profilePhotoKey)}
                        alt={w.fullName}
                        loading="lazy"
                        className="h-[52px] w-[52px] rounded-full object-cover border border-ink-200 bg-brand-50"
                      />
                    ) : (
                      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-50 border border-ink-200 text-ink-900 text-[18px] font-medium tracking-[-0.01em]">
                        {initials}
                      </div>
                    )}
                    {isUserOnline(w.lastSeenAt) && (
                      <span
                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
                        aria-label="Çevrimiçi"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[18px] font-medium tracking-[-0.015em] m-0">
                      {w.fullName}
                    </h3>
                    {w.bio && (
                      <p
                        className="text-[14px] text-ink-500 mt-1 leading-[1.5] line-clamp-2"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {w.bio}
                      </p>
                    )}
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {professionNames.map((name) => (
                        <span
                          key={name}
                          className="inline-flex items-center h-[26px] px-2.5 rounded-full bg-brand-50 text-[12px] text-ink-700"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function PinIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink-400"
    >
      <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}
