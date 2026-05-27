import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatRelative } from "@/lib/format";
import { getPhoneVisibility, type WorkerSettings } from "@/lib/phone-visibility";

export default async function PreviewListings() {
  const workers = await prisma.user.findMany({
    where: {
      professions: { isEmpty: false },
      isActive: true,
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
    <section style={{ padding: "96px 0" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              Yeni profiller
            </div>
            <h2>Bu hafta katılanlar</h2>
          </div>
          <Link
            href="/cevrendekiler"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              color: "var(--color-ink-900)",
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 999,
            }}
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

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                style={{
                  padding: "22px 26px",
                  background: "#fff",
                  border: "1px solid var(--color-ink-100)",
                  borderRadius: 14,
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  transition: "border-color .15s ease",
                }}
              >
                {/* Üst meta */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--color-ink-500)",
                      fontSize: 13,
                    }}
                  >
                    <span className="font-mono">
                      {formatRelative(w.createdAt)}
                    </span>
                    <span style={{ color: "var(--color-ink-400)" }}>·</span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <PinIcon /> {location}
                    </span>
                  </div>
                  {phoneVisibility === "private" && (
                    <span
                      style={{ fontSize: 12, color: "var(--color-ink-400)" }}
                    >
                      Sadece mesaj
                    </span>
                  )}
                </div>

                {/* Avatar + isim + headline + chips */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "#F4F2EB",
                      color: "var(--color-ink-900)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      flex: "0 0 52px",
                      border: "1px solid var(--color-ink-200)",
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        letterSpacing: "-0.015em",
                        margin: 0,
                      }}
                    >
                      {w.fullName}
                    </h3>
                    {w.bio && (
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--color-ink-500)",
                          marginTop: 4,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {w.bio}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        marginTop: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      {professionNames.map((name) => (
                        <span
                          key={name}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            height: 26,
                            padding: "0 10px",
                            borderRadius: 999,
                            background: "#F4F2EB",
                            fontSize: 12,
                            color: "var(--color-ink-700)",
                          }}
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

function getInitials(name: string): string {
  const cleaned = name.replace(/\*+/g, "").trim();
  if (!cleaned) return "··";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
      style={{ color: "var(--color-ink-400)" }}
    >
      <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}
