import Link from "next/link";
import { prisma } from "@/lib/db";
import AdminIcon from "@/components/admin/AdminIcon";

export const metadata = { title: "Aktivite — Admin" };

type FilterValue =
  | "all"
  | "signup"
  | "report"
  | "resolve"
  | "warn"
  | "deactivate"
  | "category";

type SearchParams = Promise<{ type?: FilterValue }>;

const TYPE_META: Record<
  string,
  { label: string; icon: Parameters<typeof AdminIcon>[0]["name"]; color: string; bg: string }
> = {
  signup: {
    label: "Kayıt",
    icon: "users",
    color: "var(--accent)",
    bg: "var(--accent-soft)",
  },
  report: {
    label: "Rapor",
    icon: "flag",
    color: "var(--warn)",
    bg: "var(--warn-soft)",
  },
  resolve: {
    label: "Çözüm",
    icon: "check",
    color: "var(--accent)",
    bg: "var(--accent-soft)",
  },
  warn: {
    label: "Uyarı",
    icon: "alert",
    color: "var(--warn)",
    bg: "var(--warn-soft)",
  },
  deactivate: {
    label: "Pasifleştirme",
    icon: "ban",
    color: "var(--danger)",
    bg: "var(--danger-soft)",
  },
  activate: {
    label: "Aktifleştirme",
    icon: "check",
    color: "var(--accent)",
    bg: "var(--accent-soft)",
  },
  category: {
    label: "Kategori",
    icon: "tag",
    color: "var(--info)",
    bg: "var(--info-soft)",
  },
};

const DEFAULT_META = {
  label: "Olay",
  icon: "activity" as const,
  color: "var(--ink-2)",
  bg: "var(--surface-2)",
};

function relativeWhen(d: Date): string {
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "şimdi";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
  if (diff < 2419200) return `${Math.floor(diff / 604800)} hf önce`;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function bucketOf(d: Date): "Bugün" | "Dün" | "Daha eski" {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(
    startOfToday.getTime() - 24 * 60 * 60 * 1000,
  );
  if (d >= startOfToday) return "Bugün";
  if (d >= startOfYesterday) return "Dün";
  return "Daha eski";
}

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const type = sp.type ?? "all";

  const where =
    type === "all"
      ? {}
      : type === "report"
        ? { type: { in: ["report", "resolve"] } }
        : type === "warn"
          ? { type: { in: ["warn", "deactivate", "activate"] } }
          : { type };

  const [items, counts] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.activityLog.groupBy({
      by: ["type"],
      _count: { type: true },
    }),
  ]);

  const countByType = new Map(
    counts.map((c) => [c.type, c._count.type] as const),
  );
  const totalAll = Array.from(countByType.values()).reduce((a, b) => a + b, 0);
  const sumOf = (types: string[]) =>
    types.reduce((acc, t) => acc + (countByType.get(t) ?? 0), 0);

  const filterCounts = {
    all: totalAll,
    signup: countByType.get("signup") ?? 0,
    report: sumOf(["report", "resolve"]),
    warn: sumOf(["warn", "deactivate", "activate"]),
    category: countByType.get("category") ?? 0,
  };

  // Bucket'lara grupla
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const b = bucketOf(item.createdAt);
    if (!groups.has(b)) groups.set(b, []);
    groups.get(b)!.push(item);
  }

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
            Yönetim · Aktivite
          </div>
          <h1 style={{ marginBottom: 6 }}>Aktivite akışı</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Platform genelindeki son olayların zaman çizelgesi.
          </p>
        </div>
      </div>

      {/* Filter chips */}
      <div
        className="row"
        style={{ gap: 8, marginBottom: 18, flexWrap: "wrap" }}
      >
        <FilterChip href="/admin/aktivite" active={type === "all"}>
          Tümü <span className="chip-count">{filterCounts.all}</span>
        </FilterChip>
        <FilterChip
          href="/admin/aktivite?type=signup"
          active={type === "signup"}
        >
          Kayıtlar{" "}
          <span className="chip-count">{filterCounts.signup}</span>
        </FilterChip>
        <FilterChip
          href="/admin/aktivite?type=report"
          active={type === "report"}
        >
          Raporlar{" "}
          <span className="chip-count">{filterCounts.report}</span>
        </FilterChip>
        <FilterChip
          href="/admin/aktivite?type=warn"
          active={type === "warn"}
        >
          Moderasyon{" "}
          <span className="chip-count">{filterCounts.warn}</span>
        </FilterChip>
        <FilterChip
          href="/admin/aktivite?type=category"
          active={type === "category"}
        >
          Kategoriler{" "}
          <span className="chip-count">{filterCounts.category}</span>
        </FilterChip>
      </div>

      {/* Feed */}
      <div className="card" style={{ padding: "4px 24px 18px" }}>
        {items.length === 0 ? (
          <div className="empty" style={{ margin: "16px 0" }}>
            Bu filtrede aktivite yok.
          </div>
        ) : (
          Array.from(groups.entries()).map(([bucket, list], gi) => (
            <div
              key={bucket}
              style={{ marginTop: gi === 0 ? 18 : 28 }}
            >
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                {bucket}
              </div>
              <div>
                {list.map((item) => {
                  const m = TYPE_META[item.type] ?? DEFAULT_META;
                  return (
                    <div key={item.id} className="feed-item">
                      <div
                        className="feed-icon"
                        style={{ background: m.bg, color: m.color }}
                      >
                        <AdminIcon name={m.icon} size={14} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="feed-title">
                          <b>{item.title}</b>
                        </div>
                        {item.sub && (
                          <div className="feed-sub">
                            {item.sub}{" "}
                            <span
                              className="mono"
                              style={{
                                color: "var(--muted-2)",
                                marginLeft: 8,
                              }}
                            >
                              · {m.label}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="feed-time">
                        {relativeWhen(item.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
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
