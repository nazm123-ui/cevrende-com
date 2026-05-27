import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatRelative } from "@/lib/format";
import { canSeePhone, type WorkerSettings } from "@/lib/phone-visibility";
import { parseExperiences, formatYearRange } from "@/lib/experience";
import WorkerContactCard from "@/components/workers/WorkerContactCard";
import Icon from "@/components/ui/Icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const w = await prisma.user.findUnique({
    where: { id },
    select: { fullName: true },
  });
  if (!w) return { title: "Profil — Cevrende.com" };
  return { title: `${w.fullName} — Cevrende.com` };
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

  return (
    <div className="page">
      {/* Breadcrumb */}
      <section style={{ padding: "32px 0 0" }}>
        <div className="container">
          <Link
            href="/cevrendekiler"
            style={{
              background: "none",
              border: 0,
              padding: 0,
              font: "inherit",
              cursor: "pointer",
              color: "var(--color-ink-500)",
              fontSize: 13.5,
              textDecoration: "none",
            }}
          >
            ← Çevrendekiler
          </Link>
        </div>
      </section>

      <section style={{ padding: "24px 0 96px" }}>
        <div
          className="container worker-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 64,
            alignItems: "flex-start",
          }}
        >
          {/* Sol — profil */}
          <div>
            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  background: "#F4F2EB",
                  color: "var(--color-ink-900)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  flex: "0 0 84px",
                  border: "1px solid var(--color-ink-200)",
                }}
              >
                {initials}
              </div>

              <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{ fontSize: 13.5, color: "var(--color-ink-500)" }}
                  >
                    {formatRelative(worker.createdAt)}
                  </span>
                  <span style={{ color: "var(--color-ink-400)" }}>·</span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 13.5,
                      color: "var(--color-ink-500)",
                    }}
                  >
                    <Icon name="pin" size={13} /> {location}
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: 36,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {worker.fullName}
                </h1>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 17,
                    color: "var(--color-ink-700)",
                  }}
                >
                  {headline}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 18,
                    flexWrap: "wrap",
                  }}
                >
                  {professionNames.slice(0, 1).map((name) => (
                    <span key={name} className="chip chip-muted">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="divider" style={{ margin: "40px 0" }} />

            {/* Hakkında */}
            <h3 style={{ marginBottom: 14 }}>Hakkında</h3>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: "var(--color-ink-700)",
                maxWidth: 640,
                whiteSpace: "pre-wrap",
              }}
            >
              {bioRest || worker.bio || "Profil sahibi henüz tanıtım yazısı eklememiş."}
            </p>

            {/* Yetkinlikler */}
            <h3 style={{ marginTop: 40, marginBottom: 14 }}>Yetkinlikler</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
            <h3 style={{ marginTop: 40, marginBottom: 18 }}>İş geçmişi</h3>
            {experiences.length === 0 ? (
              <div
                style={{
                  padding: "20px 24px",
                  border: "1px dashed var(--color-ink-200)",
                  borderRadius: 14,
                  color: "var(--color-ink-500)",
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                {isSelf
                  ? "Henüz iş deneyimi eklemedin. Profilini düzenleyerek geçmiş işlerini ekleyebilirsin."
                  : "Bu kullanıcı henüz iş deneyimi eklememiş."}
              </div>
            ) : (
              <div
                style={{
                  borderLeft: "1px solid var(--color-ink-200)",
                  paddingLeft: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {experiences.map((h, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: -29,
                        top: 8,
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {h.role}
                      </div>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: 13.5,
                          color: "var(--color-ink-500)",
                        }}
                      >
                        {formatYearRange(h)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: "var(--color-ink-700)",
                        marginTop: 4,
                      }}
                    >
                      {h.workplace}
                    </div>
                    {h.description && (
                      <div
                        style={{
                          fontSize: 13.5,
                          color: "var(--color-ink-500)",
                          marginTop: 2,
                          lineHeight: 1.55,
                        }}
                      >
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
              initialSaved={initialSaved}
            />

            <div
              style={{
                padding: "18px 24px",
                color: "var(--color-ink-500)",
                fontSize: 12.5,
                lineHeight: 1.55,
              }}
            >
              Sorunlu profil mi?{" "}
              <button
                style={{
                  background: "none",
                  border: 0,
                  padding: 0,
                  font: "inherit",
                  cursor: "pointer",
                  color: "var(--color-ink-700)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                Bildir
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
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

function firstLine(text: string): string {
  const idx = text.indexOf("\n");
  return idx === -1 ? text.slice(0, 80) : text.slice(0, idx);
}

function restOfBio(text: string): string {
  const idx = text.indexOf("\n");
  if (idx === -1) return text;
  return text.slice(idx + 1).trim();
}
