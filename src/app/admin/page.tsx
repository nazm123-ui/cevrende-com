import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  buildDailySeries,
  computeDelta,
  startOf14DayWindow,
} from "@/lib/admin-stats";
import { getInitials } from "@/lib/initials";
import AdminIcon from "@/components/admin/AdminIcon";
import Metric from "@/components/admin/Metric";
import RankCard from "@/components/admin/RankCard";

export const metadata = { title: "Admin Paneli — Cevrende.com" };

function formatLastSeen(d: Date): string {
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "şimdi";
  if (diff < 3600) return `${Math.floor(diff / 60)}d`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}g`;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
  }).format(d);
}

export default async function AdminPage() {
  const since = startOf14DayWindow();

  const [
    usersTotal,
    workersTotal,
    searchesTotal,
    messagesTotal,
    openReports,
    categoriesActive,
    categoriesInactive,
    usersInWindow,
    workersInWindow,
    searchesInWindow,
    messagesInWindow,
    topMessageRecipients,
    topProfessionsRaw,
    topNeighborhoodsRaw,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { professions: { isEmpty: false } } }),
    prisma.searchEvent.count(),
    prisma.message.count(),
    prisma.messageReport.count({ where: { status: "open" } }),
    prisma.jobCategory.count({ where: { isActive: true } }),
    prisma.jobCategory.count({ where: { isActive: false } }),
    prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, professions: true },
    }),
    // İşçi profili: 14 gün penceresinde professions array'i dolu olarak set edilmiş
    // (proxy: o pencerede oluşturulup professions dolu olanlar). Eski user'lar bio
    // güncellemesi yapsa bile sayılmaz — biraz pessimistic, kabul edilebilir.
    prisma.user.findMany({
      where: {
        createdAt: { gte: since },
        professions: { isEmpty: false },
      },
      select: { createdAt: true },
    }),
    prisma.searchEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.message.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.message.groupBy({
      by: ["recipientId"],
      _count: { recipientId: true },
      orderBy: { _count: { recipientId: "desc" } },
      take: 5,
    }),
    prisma.searchEvent.groupBy({
      by: ["professionSlug"],
      where: { professionSlug: { not: null }, createdAt: { gte: since } },
      _count: { professionSlug: true },
      orderBy: { _count: { professionSlug: "desc" } },
      take: 5,
    }),
    prisma.searchEvent.groupBy({
      by: ["neighborhood"],
      where: { neighborhood: { not: null }, createdAt: { gte: since } },
      _count: { neighborhood: true },
      orderBy: { _count: { neighborhood: "desc" } },
      take: 5,
    }),
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

  const usersSeries = buildDailySeries(usersInWindow.map((u) => u.createdAt));
  const workersSeries = buildDailySeries(workersInWindow.map((u) => u.createdAt));
  const searchSeries = buildDailySeries(
    searchesInWindow.map((s) => s.createdAt),
  );
  const msgSeries = buildDailySeries(messagesInWindow.map((m) => m.createdAt));

  const usersDelta = computeDelta(usersSeries);
  const workersDelta = computeDelta(workersSeries);
  const searchDelta = computeDelta(searchSeries);
  const msgDelta = computeDelta(msgSeries);

  // En çok mesaj alan işçilerin isimlerini çek
  const topRecipientIds = topMessageRecipients.map((r) => r.recipientId);
  const topRecipients = topRecipientIds.length
    ? await prisma.user.findMany({
        where: { id: { in: topRecipientIds } },
        select: { id: true, fullName: true, professions: true, neighborhood: true },
      })
    : [];
  const recipientById = new Map(topRecipients.map((u) => [u.id, u]));

  // Meslek slug → isim
  const slugs = topProfessionsRaw
    .map((p) => p.professionSlug)
    .filter((s): s is string => !!s);
  const categories = slugs.length
    ? await prisma.jobCategory.findMany({
        where: { slug: { in: slugs } },
        select: { slug: true, name: true },
      })
    : [];
  const profNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));

  const topMessaged = topMessageRecipients
    .map((row) => {
      const u = recipientById.get(row.recipientId);
      if (!u) return null;
      return {
        id: u.id,
        name: u.fullName,
        sub:
          u.professions.slice(0, 2).join(", ") +
          (u.neighborhood ? ` · ${u.neighborhood}` : ""),
        count: row._count.recipientId,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const topProfessions = topProfessionsRaw
    .map((row) => {
      const slug = row.professionSlug;
      if (!slug) return null;
      return {
        id: slug,
        name: profNameBySlug.get(slug) ?? slug,
        count: row._count.professionSlug,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const topNeighborhoods = topNeighborhoodsRaw
    .map((row) => {
      const n = row.neighborhood;
      if (!n) return null;
      return { id: n, name: n, count: row._count.neighborhood };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <div className="page-fade">
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 24,
        }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Yönetim · Genel
          </div>
          <h1 style={{ marginBottom: 6 }}>Admin Paneli</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Genel istatistikler, son aktiviteler ve yönetim araçları.
          </p>
        </div>
      </div>

      {/* Metric grid */}
      <div className="eyebrow" style={{ margin: "6px 0 12px" }}>
        Genel · Son 14 gün
      </div>
      <div className="grid grid-4" style={{ marginBottom: 14 }}>
        <Metric
          label="Kullanıcı"
          value={usersTotal}
          delta={usersDelta.delta}
          deltaLabel={usersDelta.deltaLabel}
          series={usersSeries}
          accent="var(--accent)"
        />
        <Metric
          label="İşçi Profili"
          value={workersTotal}
          delta={workersDelta.delta}
          deltaLabel={workersDelta.deltaLabel}
          series={workersSeries}
          accent="var(--ink)"
        />
        <Metric
          label="Arama"
          value={searchesTotal}
          delta={searchDelta.delta}
          deltaLabel={searchDelta.deltaLabel}
          series={searchSeries}
          accent="var(--info)"
        />
        <Metric
          label="Mesaj"
          value={messagesTotal}
          delta={msgDelta.delta}
          deltaLabel={msgDelta.deltaLabel}
          series={msgSeries}
          accent="var(--ink)"
        />
      </div>

      {/* Action strip */}
      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        <Link
          href="/admin/raporlar"
          className="card"
          style={{
            padding: "16px 20px",
            textAlign: "left",
            cursor: "pointer",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "inherit",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "var(--warn-soft)",
              color: "var(--warn)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 42px",
            }}
          >
            <AdminIcon name="flag" size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)" }}
            >
              Açık raporlar{" "}
              <span className="num" style={{ color: "var(--warn)" }}>
                · {openReports}
              </span>
            </div>
            <div
              style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
            >
              Bekleyen moderasyon kararı
            </div>
          </div>
          <AdminIcon name="chevron-right" size={16} color="var(--muted)" />
        </Link>

        <Link
          href="/admin/kategoriler"
          className="card"
          style={{
            padding: "16px 20px",
            textAlign: "left",
            cursor: "pointer",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "inherit",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "var(--accent-soft)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 42px",
            }}
          >
            <AdminIcon name="tag" size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)" }}
            >
              Kategoriler ·{" "}
              <span className="num">{categoriesActive + categoriesInactive}</span>
            </div>
            <div
              style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
            >
              {categoriesActive} aktif · {categoriesInactive} pasif
            </div>
          </div>
          <AdminIcon name="chevron-right" size={16} color="var(--muted)" />
        </Link>
      </div>

      {/* Rank cards — top messaged + top professions */}
      <div className="grid grid-2" style={{ marginBottom: 14 }}>
        <RankCard
          title="En çok mesaj alan işçiler"
          sub="Aldıkları toplam mesaj sayısına göre"
          rows={topMessaged}
          emptyText="Henüz mesaj yok."
        />
        <RankCard
          title="En çok aranan meslekler"
          sub="Arama event sayısı · son 14 gün"
          rows={topProfessions}
          emptyText="Henüz arama yok."
        />
      </div>

      {/* Rank cards — neighborhoods + recent signups */}
      <div className="grid grid-2">
        <RankCard
          title="En çok aranan mahalleler"
          sub="Mahalle filtresi event'leri · son 14 gün"
          rows={topNeighborhoods}
          emptyText="Henüz mahalle araması yok."
        />

        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              padding: "18px 22px 0",
            }}
          >
            <div>
              <h3 style={{ fontSize: 15.5 }}>Son kayıt olanlar</h3>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--muted)",
                  marginTop: 3,
                }}
              >
                Son 6 kullanıcı
              </div>
            </div>
            <Link
              href="/admin/kullanicilar"
              className="btn btn-ghost btn-xs"
            >
              Tümü <AdminIcon name="chevron-right" size={12} />
            </Link>
          </div>
          <div style={{ padding: "6px 22px 12px" }}>
            {recentUsers.length === 0 ? (
              <div className="empty" style={{ padding: "28px 12px" }}>
                Henüz kullanıcı yok.
              </div>
            ) : (
              recentUsers.map((u) => (
                <Link
                  key={u.id}
                  href={`/cevrendekiler/${u.id}`}
                  className="rank-row"
                  style={{
                    gridTemplateColumns: "30px 1fr auto",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  <div
                    className="avatar avatar-sm"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--ink-2)",
                    }}
                  >
                    {getInitials(u.fullName)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="rank-name">{u.fullName}</div>
                    <div className="rank-sub">
                      {u.neighborhood ?? "—"} ·{" "}
                      {u.professions.length > 0
                        ? u.professions.slice(0, 2).join(", ")
                        : "Profilsiz"}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: 11.5,
                      color: "var(--muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatLastSeen(u.createdAt)}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
