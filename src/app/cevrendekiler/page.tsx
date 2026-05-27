import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getActiveWorkers, getProfessionCounts } from "@/lib/workers";
import WorkerCard from "@/components/workers/WorkerCard";
import TopFilterBar from "@/components/workers/TopFilterBar";
import CategorySidebar from "@/components/workers/CategorySidebar";

export const metadata = {
  title: "Çevrendekiler — Pendik'te Usta ve Hizmet",
  description:
    "Pendik ve çevresinde mesleğe göre işçi ara. Profil incele, doğrudan mesajla, aracısız iletişime geç.",
};

type SearchParams = Promise<{
  meslek?: string;
  mahalle?: string;
  ilce?: string;
  q?: string;
  siralama?: string;
}>;

export default async function CevrendekilerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const [user, workers, professions, categories] = await Promise.all([
    getCurrentUser(),
    getActiveWorkers({
      profession: sp.meslek,
      neighborhood: sp.mahalle,
      q: sp.q,
    }),
    getProfessionCounts(),
    prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));
  const canContact = !!user && user.isEmailVerified;

  return (
    <div className="page">
      {/* Search + filter bar */}
      <section style={{ padding: "32px 0 24px" }}>
        <div className="container">
          <TopFilterBar />
        </div>
      </section>

      {/* Ana içerik — sidebar + listings */}
      <section style={{ padding: "8px 0 96px" }}>
        <div
          className="container listings-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 48,
            alignItems: "flex-start",
          }}
        >
          <CategorySidebar
            professions={professions}
            total={workers.length}
          />

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
                color: "var(--color-ink-500)",
                fontSize: 13.5,
                alignItems: "center",
              }}
            >
              <span>
                <span
                  className="font-mono"
                  style={{ color: "var(--color-ink-700)" }}
                >
                  {workers.length}
                </span>{" "}
                sonuç
              </span>
              <span>
                {sp.siralama === "rating"
                  ? "Puana göre"
                  : sp.siralama === "near"
                    ? "Yakına göre"
                    : "Yeniden eskiye"}
              </span>
            </div>

            {workers.length === 0 ? (
              <div
                style={{
                  padding: "80px 24px",
                  textAlign: "center",
                  border: "1px dashed var(--color-ink-200)",
                  borderRadius: 14,
                }}
              >
                <div className="eyebrow" style={{ marginBottom: 10 }}>
                  Sonuç yok
                </div>
                <h3 style={{ marginBottom: 10 }}>
                  Bu filtrelerle kimseyi bulamadık.
                </h3>
                <p style={{ color: "var(--color-ink-500)" }}>
                  Filtreleri sıfırla veya farklı bir mahalleyi dene.
                </p>
              </div>
            ) : (
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {workers.map((w) => (
                  <li key={w.id}>
                    <WorkerCard
                      worker={w}
                      categoryNameBySlug={categoryNameBySlug}
                      canContact={canContact}
                      isSelf={user?.id === w.id}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
