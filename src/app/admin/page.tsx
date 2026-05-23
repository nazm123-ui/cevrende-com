import Link from "next/link";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";

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
    requestsCount,
    pendingRequestsCount,
    acceptedRequestsCount,
    searchCount,
    searchCount7d,
    openReportsCount,
    topWorkers,
    topProfessions,
    topNeighborhoods,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { professions: { isEmpty: false } } }),
    prisma.jobCategory.count({ where: { isActive: true } }),
    prisma.message.count(),
    prisma.contactRequest.count(),
    prisma.contactRequest.count({ where: { status: "pending" } }),
    prisma.contactRequest.count({ where: { status: "accepted" } }),
    prisma.searchEvent.count(),
    prisma.searchEvent.count({ where: { createdAt: { gte: last7d } } }),
    prisma.messageReport.count({ where: { status: "open" } }),
    prisma.contactRequest.groupBy({
      by: ["toWorkerId"],
      _count: { toWorkerId: true },
      orderBy: { _count: { toWorkerId: "desc" } },
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
  ]);

  const topWorkerIds = topWorkers.map((w) => w.toWorkerId);
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-8">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
          Yönetim
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
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
        <h2 className="text-[13px] font-mono uppercase tracking-[0.08em] text-ink-500 mb-3">
          Genel
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <Stat label="Kullanıcı" value={usersCount} sub={`+${recentSignups} (7g)`} />
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
        <h2 className="text-[13px] font-mono uppercase tracking-[0.08em] text-ink-500 mb-3">
          Etkileşim
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <Stat label="Toplam arama" value={searchCount} sub={`${searchCount7d} (7g)`} />
          <Stat label="Toplam talep" value={requestsCount} />
          <Stat label="Bekleyen talep" value={pendingRequestsCount} />
          <Stat label="Kabul edilen talep" value={acceptedRequestsCount} />
        </div>
        <Stat
          className="mt-3 sm:max-w-xs"
          label="Toplam mesaj"
          value={messagesCount}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="En çok tercih edilen işçiler"
          subtitle="Aldığı talep sayısına göre"
          empty={topWorkers.length === 0}
          emptyText="Henüz talep yok."
        >
          <ul className="divide-y divide-ink-100">
            {topWorkers.map((row, i) => {
              const user = topWorkerMap.get(row.toWorkerId);
              if (!user) return null;
              return (
                <li
                  key={row.toWorkerId}
                  className="py-3 flex items-center gap-3"
                >
                  <span className="font-mono text-[12px] text-ink-400 w-5">
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
                  <span className="font-mono text-[13px] text-ink-900">
                    {row._count.toWorkerId}
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
                <span className="font-mono text-[12px] text-ink-400 w-5">
                  {i + 1}
                </span>
                <p className="flex-1 text-[14px] text-ink-900 truncate">
                  {row.professionSlug
                    ? profNameBySlug.get(row.professionSlug) ?? row.professionSlug
                    : "—"}
                </p>
                <span className="font-mono text-[13px] text-ink-900">
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
                <span className="font-mono text-[12px] text-ink-400 w-5">
                  {i + 1}
                </span>
                <p className="flex-1 text-[14px] text-ink-900 truncate">
                  {row.neighborhood ?? "—"}
                </p>
                <span className="font-mono text-[13px] text-ink-900">
                  {row._count.neighborhood}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Hızlı eylemler" subtitle="Yönetim sayfaları">
          <div className="grid gap-2">
            <Link
              href="/admin/kullanicilar"
              className="flex items-center justify-between rounded-[10px] border border-ink-100 px-4 py-3 text-[14px] text-ink-900 hover:border-ink-900 transition"
            >
              Kullanıcı yönetimi
              <span className="text-ink-400">→</span>
            </Link>
            <Link
              href="/admin/raporlar"
              className="flex items-center justify-between rounded-[10px] border border-ink-100 px-4 py-3 text-[14px] text-ink-900 hover:border-ink-900 transition"
            >
              Mesaj raporları{" "}
              {openReportsCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-[20px] min-w-[20px] px-1.5 rounded-full bg-accent-600 text-[11px] font-semibold" style={{ color: "#ffffff" }}>
                  {openReportsCount}
                </span>
              )}
              <span className="text-ink-400 ml-auto">→</span>
            </Link>
            <Link
              href="/admin/kategoriler"
              className="flex items-center justify-between rounded-[10px] border border-ink-100 px-4 py-3 text-[14px] text-ink-900 hover:border-ink-900 transition"
            >
              Kategoriler
              <span className="text-ink-400">→</span>
            </Link>
          </div>
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
  sub,
  highlight,
  className,
}: {
  label: string;
  value: number;
  sub?: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[14px] border p-4 bg-white ${
        highlight ? "border-accent-600" : "border-ink-100"
      } ${className ?? ""}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-500">
        {label}
      </p>
      <p className="mt-1.5 text-[26px] font-semibold tracking-[-0.02em] text-ink-900">
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-[12px] font-mono text-ink-500">{sub}</p>
      )}
    </div>
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
