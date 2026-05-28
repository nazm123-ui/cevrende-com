import Link from "next/link";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import ReportsList from "@/components/admin/ReportsList";

export const metadata = { title: "Raporlar — Admin" };

type SearchParams = Promise<{ status?: "open" | "resolved" | "all" }>;

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const status = sp.status ?? "open";

  const where =
    status === "all"
      ? {}
      : { status };

  const reports = await prisma.messageReport.findMany({
    where,
    include: {
      reportedBy: {
        select: { id: true, fullName: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Fetch the related messages separately (no relation on schema)
  const messageIds = reports.map((r) => r.messageId);
  const messages = messageIds.length
    ? await prisma.message.findMany({
        where: { id: { in: messageIds } },
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderId: true,
          recipientId: true,
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

  // Her sender'a karşı kaç açık rapor var?
  const senderIds = Array.from(
    new Set(messages.map((m) => m.sender.id)),
  );
  const senderOpenReports = senderIds.length
    ? await prisma.message.findMany({
        where: { senderId: { in: senderIds } },
        select: { id: true, senderId: true },
      })
    : [];
  const messageIdToSender = new Map(
    senderOpenReports.map((m) => [m.id, m.senderId]),
  );
  const openReportsBySender = new Map<string, number>();
  if (senderIds.length) {
    const allOpenReports = await prisma.messageReport.findMany({
      where: {
        status: "open",
        messageId: { in: senderOpenReports.map((m) => m.id) },
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

  const [openCount, resolvedCount] = await Promise.all([
    prisma.messageReport.count({ where: { status: "open" } }),
    prisma.messageReport.count({ where: { status: "resolved" } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-[13px] text-ink-500 hover:text-ink-900 transition"
        >
          ← Admin paneli
        </Link>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          Mesaj Raporları
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Kullanıcılar tarafından raporlanan mesajlar.
        </p>
      </div>

      <div className="mb-5 flex gap-2 flex-wrap">
        <FilterPill href="/admin/raporlar?status=open" active={status === "open"}>
          Açık ({openCount})
        </FilterPill>
        <FilterPill
          href="/admin/raporlar?status=resolved"
          active={status === "resolved"}
        >
          Çözüldü ({resolvedCount})
        </FilterPill>
        <FilterPill href="/admin/raporlar?status=all" active={status === "all"}>
          Hepsi
        </FilterPill>
      </div>

      <ReportsList reports={enriched} />
    </div>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center h-9 px-4 rounded-full text-[13.5px] font-medium transition ${
        active
          ? "bg-ink-900 text-white"
          : "bg-white border border-ink-200 text-ink-700 hover:border-ink-900"
      }`}
      style={active ? { color: "#ffffff" } : undefined}
    >
      {children}
    </Link>
  );
}
