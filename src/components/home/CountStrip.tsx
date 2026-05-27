import { prisma } from "@/lib/db";

export default async function CountStrip() {
  const [workersCount] = await Promise.all([
    prisma.user.count({
      where: { professions: { isEmpty: false }, isActive: true },
    }),
  ]);

  // Formatlanmış sayı — 1000+ ise "1.4K" şeklinde
  const workersDisplay =
    workersCount >= 1000
      ? `${(workersCount / 1000).toFixed(1)}K`
      : workersCount.toString();

  const stats = [
    { n: workersDisplay, lbl: "iş arayan" },
    { n: "7 semt", lbl: "Pendik & çevresi" },
    { n: "2 saat", lbl: "ortalama yanıt" },
    { n: "%0", lbl: "komisyon" },
  ];

  return (
    <section
      style={{
        padding: "36px 0",
        borderTop: "1px solid var(--color-ink-100)",
        borderBottom: "1px solid var(--color-ink-100)",
      }}
    >
      <div
        className="container count-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 32,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--color-ink-900)",
              }}
            >
              {s.n}
            </div>
            <div className="text-sm text-muted">{s.lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
