import Link from "next/link";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { formatRelative } from "@/lib/format";

export const metadata = { title: "Admin Paneli — Cevrende.com" };

export default async function AdminPage() {
  await requireAdmin();

  const now = new Date();
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    usersCount,
    workersCount,
    categoriesCount,
    messagesCount,
    searchCount,
    searchCount7d,
    openReportsCount,
    topMessageSenders,
    topProfessions,
    topNeighborhoods,
    recentSignups,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { professions: { isEmpty: false } } }),
    prisma.jobCategory.count({ where: { isActive: true } }),
    prisma.message.count(),
    prisma.searchEvent.count(),
    prisma.searchEvent.count({ where: { createdAt: { gte: last7d } } }),
    prisma.messageReport.count({ where: { status: "open" } }),
    prisma.message.groupBy({
      by: ["recipientId"],
      _count: { recipientId: true },
      orderBy: { _count: { recipientId: "desc" } },
      take: 10,
    }),
    prisma.searchEvent.groupBy({
      by: ["professionSlug"],
      where: { professionSlug: { not: null } },
      _count: { professionSlug: true },
      orderBy: { _count: { professionSlug: "desc" } },
      take: 10,
    }),
    prisma.searchEvent.groupBy({
      by: ["neighborhood"],
      where: { neighborhood: { not: null } },
      _count: { neighborhood: true },
      orderBy: { _count: { neighborhood: "desc" } },
      take: 8,
    }),
    prisma.user.count({ where: { createdAt: { gte: last7d } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        fullName: true,
        neighborhood: true,
        professions: true,
        createdAt: true,
      },
    }),
  ]);

  const topWorkerIds = topMessageSenders.map((w) => w.recipientId);
  const topWorkerUsers = topWorkerIds.length
    ? await prisma.user.findMany({
        where: { id: { in: topWorkerIds } },
        select: {
          id: true,
          fullName: true,
          professions: true,
          neighborhood: true,
        },
      })
    : [];
  const topWorkerMap = new Map(topWorkerUsers.map((u) => [u.id, u]));

  const topProfessionSlugs = topProfessions
    .map((p) => p.professionSlug)
    .filter((s): s is string => !!s);
  const categoriesByName = topProfessionSlugs.length
    ? await prisma.jobCategory.findMany({
        where: { slug: { in: topProfessionSlugs } },
        select: { slug: true, name: true },
      })
    : [];
  const profNameBySlug = new Map(categoriesByName.map((c) => [c.slug, c.name]));

  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-6 py-8 sm:py-10">
      <div className="mb-8">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
          Yönetim
        </p>
        <h1 className="mt-2 text-[26px] sm:text-[32px] font-semibold tracking-[-0.02em] leading-tight text-ink-900">
          Admin Paneli
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Genel istatistikler ve yönetim araçları
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <NavPill href="/admin/kullanicilar">Kullanıcılar</NavPill>
        <NavPill href="/admin/raporlar" badge={openReportsCount}>
          Raporlar
        </NavPill>
        <NavPill href="/admin/kategoriler">Kategoriler</NavPill>
      </div>

      <section className="mb-10">
        <h2 className="text-[13px] font-mono uppercase tracking-[0.08em] text-ink-500 font-medium mb-3">
          Genel
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <Stat label="Kullanıcı" value={usersCount} trend={recentSignups} trendLabel="7g" />
          <Stat label="İşçi profili" value={workersCount} />
          <Stat label="Kategori" value={categoriesCount} />
          <Stat
            label="Açık rapor"
            value={openReportsCount}
            highlight={openReportsCount > 0}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[13px] font-mono uppercase tracking-[0.08em] text-ink-500 font-medium mb-3">
          Etkileşim
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <Stat label="Toplam arama" value={searchCount} trend={searchCount7d} trendLabel="7g" />
          <Stat label="Toplam mesaj" value={messagesCount} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="En çok mesaj alan işçiler"
          subtitle="Aldığı mesaj sayısına göre"
          empty={topMessageSenders.length === 0}
          emptyText="Henüz mesaj yok."
        >
          <ul className="divide-y divide-ink-100">
            {topMessageSenders.map((row, i) => {
              const user = topWorkerMap.get(row.recipientId);
              if (!user) return null;
              return (
                <li
                  key={row.recipientId}
                  className="py-3 flex items-center gap-3"
                >
                  <span className="font-mono text-[12px] text-ink-400 w-6 text-right shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-ink-900 truncate">
                      {user.fullName}
                    </p>
                    <p className="text-[12.5px] text-ink-500 truncate">
                      {user.neighborhood ?? "—"} ·{" "}
                      {user.professions.slice(0, 2).join(", ") || "Profilsiz"}
                    </p>
                  </div>
                  <span className="font-mono text-[13px] text-ink-900 shrink-0">
                    {row._count.recipientId}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel
          title="En çok aranan meslekler"
          subtitle="Arama event sayısı"
          empty={topProfessions.length === 0}
          emptyText="Henüz arama event'i yok."
        >
          <ul className="divide-y divide-ink-100">
            {topProfessions.map((row, i) => (
              <li
                key={row.professionSlug ?? `unknown-${i}`}
                className="py-3 flex items-center gap-3"
              >
                <span className="font-mono text-[12px] text-ink-400 w-6 text-right shrink-0">
                  {i + 1}
                </span>
                <p className="flex-1 text-[14px] text-ink-900 truncate">
                  {row.professionSlug
                    ? profNameBySlug.get(row.professionSlug) ?? row.professionSlug
                    : "—"}
                </p>
                <span className="font-mono text-[13px] text-ink-900 shrink-0">
                  {row._count.professionSlug}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="En çok aranan mahalleler"
          subtitle="Mahalle filtresi event'leri"
          empty={topNeighborhoods.length === 0}
          emptyText="Henüz mahalle araması yok."
        >
          <ul className="divide-y divide-ink-100">
            {topNeighborhoods.map((row, i) => (
              <li
                key={row.neighborhood ?? `unk-${i}`}
                className="py-3 flex items-center gap-3"
              >
                <span className="font-mono text-[12px] text-ink-400 w-6 text-right shrink-0">
                  {i + 1}
                </span>
                <p className="flex-1 text-[14px] text-ink-900 truncate">
                  {row.neighborhood ?? "—"}
                </p>
                <span className="font-mono text-[13px] text-ink-900 shrink-0">
                  {row._count.neighborhood}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Son kayıt olanlar"
          subtitle="Son 6 kullanıcı"
          empty={recentUsers.length === 0}
          emptyText="Henüz kullanıcı yok."
        >
          <ul className="divide-y divide-ink-100">
            {recentUsers.map((u) => (
              <li key={u.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/cevrendekiler/${u.id}`}
                    className="text-[14px] font-medium text-ink-900 truncate hover:text-accent-600 transition block"
                  >
                    {u.fullName}
                  </Link>
                  <p className="text-[12.5px] text-ink-500 truncate">
                    {u.neighborhood ?? "—"} ·{" "}
                    {u.professions.length > 0
                      ? u.professions.slice(0, 2).join(", ")
                      : "Profilsiz"}
                  </p>
                </div>
                <span className="font-mono text-[12px] text-ink-400 shrink-0">
                  {formatRelative(u.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function NavPill({
  href,
  children,
  badge,
}: {
  href: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-ink-200 bg-white text-[14px] font-medium text-ink-900 hover:border-ink-900 transition"
    >
      {children}
      {badge && badge > 0 ? (
        <span
          className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-accent-600 text-[11px] font-semibold"
          style={{ color: "#ffffff" }}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function Stat({
  label,
  value,
  trend,
  trendLabel,
  highlight,
}: {
  label: string;
  value: number;
  trend?: number;
  trendLabel?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[14px] border p-4 bg-white ${
        highlight ? "border-accent-600" : "border-ink-100"
      }`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-500">
        {label}
      </p>
      <p className="mt-1.5 text-[26px] font-semibold tracking-[-0.02em] text-ink-900">
        {value}
      </p>
      {trend !== undefined && trend > 0 && (
        <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-mono text-accent-600">
          <ArrowUp /> +{trend} {trendLabel}
        </p>
      )}
      {trend !== undefined && trend === 0 && trendLabel && (
        <p className="mt-1 text-[12px] font-mono text-ink-400">
          ±0 {trendLabel}
        </p>
      )}
    </div>
  );
}

function ArrowUp() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function Panel({
  title,
  subtitle,
  children,
  empty,
  emptyText,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  empty?: boolean;
  emptyText?: string;
}) {
  return (
    <div className="rounded-[14px] border border-ink-100 bg-white p-5">
      <div className="mb-3">
        <h3 className="text-[15px] font-semibold text-ink-900">{title}</h3>
        {subtitle && (
          <p className="text-[12.5px] text-ink-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {empty ? (
        <p className="py-6 text-center text-[13.5px] text-ink-400">
          {emptyText ?? "—"}
        </p>
      ) : (
        children
      )}
    </div>
  );
}
