import Link from "next/link";
import { prisma } from "@/lib/db";
import AdminIcon from "@/components/admin/AdminIcon";
import ReportsList from "@/components/admin/ReportsList";
import TopReportedUsers from "@/components/admin/TopReportedUsers";

export const metadata = { title: "Raporlar — Admin" };

type SearchParams = Promise<{ status?: "open" | "resolved" | "all" }>;

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "open";

  const where = status === "all" ? {} : { status };

  // Çok rapor edilen / uyarılan kullanıcılar (top 10)
  // Her mesajın senderId'sine göre rapor sayısını grupla
  const allReportsAggregate = await prisma.$queryRaw<
    Array<{
      sender_id: string;
      report_count: bigint;
      open_count: bigint;
    }>
  >`
    SELECT
      m."senderId" as sender_id,
      COUNT(r.id) as report_count,
      COUNT(CASE WHEN r.status = 'open' THEN 1 END) as open_count
    FROM "MessageReport" r
    INNER JOIN "Message" m ON m.id = r."messageId"
    GROUP BY m."senderId"
    ORDER BY report_count DESC
    LIMIT 10
  `;
  const topUserIds = allReportsAggregate.map((r) => r.sender_id);
  const topUsers = topUserIds.length
    ? await prisma.user.findMany({
        where: { id: { in: topUserIds } },
        select: {
          id: true,
          fullName: true,
          email: true,
          isActive: true,
          warningCount: true,
          lastWarnedAt: true,
        },
      })
    : [];
  const topUsersData = allReportsAggregate
    .map((row) => {
      const user = topUsers.find((u) => u.id === row.sender_id);
      if (!user) return null;
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
        warningCount: user.warningCount,
        lastWarnedAt: user.lastWarnedAt?.toISOString() ?? null,
        totalReports: Number(row.report_count),
        openReports: Number(row.open_count),
      };
    })
    .filter((u): u is NonNullable<typeof u> => u !== null);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [reports, openCount, resolvedCount, resolvedThisWeek] =
    await Promise.all([
      prisma.messageReport.findMany({
        where,
        include: {
          reportedBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.messageReport.count({ where: { status: "open" } }),
      prisma.messageReport.count({ where: { status: "resolved" } }),
      prisma.messageReport.count({
        where: { status: "resolved", resolvedAt: { gte: sevenDaysAgo } },
      }),
    ]);

  // İlgili mesajları ve göndericilere karşı açık rapor sayılarını derle
  const messageIds = reports.map((r) => r.messageId);
  const messages = messageIds.length
    ? await prisma.message.findMany({
        where: { id: { in: messageIds } },
        select: {
          id: true,
          content: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              isActive: true,
            },
          },
          recipient: { select: { id: true, fullName: true, email: true } },
        },
      })
    : [];
  const messageMap = new Map(messages.map((m) => [m.id, m]));

  const senderIds = Array.from(new Set(messages.map((m) => m.sender.id)));
  const openReportsBySender = new Map<string, number>();
  if (senderIds.length) {
    // Bu göndericilerin yazdığı tüm mesajlar
    const allMessagesFromSenders = await prisma.message.findMany({
      where: { senderId: { in: senderIds } },
      select: { id: true, senderId: true },
    });
    const messageIdToSender = new Map(
      allMessagesFromSenders.map((m) => [m.id, m.senderId]),
    );
    // Bu mesajların açık raporları
    const allOpenReports = await prisma.messageReport.findMany({
      where: {
        status: "open",
        messageId: { in: allMessagesFromSenders.map((m) => m.id) },
      },
      select: { messageId: true },
    });
    for (const r of allOpenReports) {
      const senderId = messageIdToSender.get(r.messageId);
      if (senderId) {
        openReportsBySender.set(
          senderId,
          (openReportsBySender.get(senderId) ?? 0) + 1,
        );
      }
    }
  }

  const enriched = reports.map((r) => {
    const msg = messageMap.get(r.messageId);
    return {
      id: r.id,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      resolvedAt: r.resolvedAt?.toISOString() ?? null,
      resolvedNote: r.resolvedNote ?? null,
      reportedBy: r.reportedBy,
      message: msg
        ? {
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt.toISOString(),
            sender: {
              id: msg.sender.id,
              fullName: msg.sender.fullName,
              email: msg.sender.email,
              isActive: msg.sender.isActive,
              openReportCount: openReportsBySender.get(msg.sender.id) ?? 0,
            },
            recipient: msg.recipient,
          }
        : null,
    };
  });

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
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Yönetim · Raporlar
          </div>
          <h1 style={{ marginBottom: 6 }}>Mesaj Raporları</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Kullanıcılar tarafından raporlanan mesajlar ve profiller.
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <div className="card card-pad">
          <div className="metric-label">Açık</div>
          <div className="metric-row">
            <div
              className="metric-value num"
              style={{ color: openCount > 0 ? "var(--warn)" : "var(--ink)" }}
            >
              {openCount}
            </div>
            <div className="metric-delta flat">moderasyon bekliyor</div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="metric-label">Toplam çözüldü</div>
          <div className="metric-row">
            <div className="metric-value num">{resolvedCount}</div>
            <div className="metric-delta flat">tüm zamanlar</div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="metric-label">Son 7 gün çözüldü</div>
          <div className="metric-row">
            <div className="metric-value num">{resolvedThisWeek}</div>
            <div className="metric-delta flat">son hafta aktivitesi</div>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div
        className="row"
        style={{ gap: 8, marginBottom: 18, flexWrap: "wrap" }}
      >
        <FilterChip href="/admin/raporlar?status=open" active={status === "open"}>
          Açık <span className="chip-count">{openCount}</span>
        </FilterChip>
        <FilterChip
          href="/admin/raporlar?status=resolved"
          active={status === "resolved"}
        >
          Çözüldü <span className="chip-count">{resolvedCount}</span>
        </FilterChip>
        <FilterChip href="/admin/raporlar?status=all" active={status === "all"}>
          Hepsi <span className="chip-count">{openCount + resolvedCount}</span>
        </FilterChip>
        <div style={{ flex: 1 }} />
        <span className="eyebrow">Sırala</span>
        <span className="chip" style={{ cursor: "default" }}>
          En yeni <AdminIcon name="chevron-down" size={12} />
        </span>
      </div>

      {/* Top reported users panel */}
      {topUsersData.length > 0 && (
        <TopReportedUsers users={topUsersData} />
      )}

      {/* Reports list */}
      <ReportsList reports={enriched} />
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={"chip" + (active ? " is-active" : "")}>
      {children}
    </Link>
  );
}
