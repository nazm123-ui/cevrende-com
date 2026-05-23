import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getActiveWorkers, getProfessionCounts } from "@/lib/workers";
import { getRequestStatusMap } from "@/lib/contact-requests";
import WorkerCard from "@/components/workers/WorkerCard";
import WorkerFilters from "@/components/workers/WorkerFilters";

export const metadata = {
  title: "Çevrendekiler — Cevrende.com",
  description:
    "Pendik ve çevresinde mesleğine göre kişi ara. Garson, temizlik, kurye ve daha fazlası.",
};

type SearchParams = Promise<{
  meslek?: string;
  mahalle?: string;
  q?: string;
}>;

export default async function IscilarPage({
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
      select: { slug: true, name: true },
    }),
  ]);

  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));
  const canContact = !!user && user.isEmailVerified;
  const requestStatusMap =
    canContact && user
      ? await getRequestStatusMap(
          user.id,
          workers.map((w) => w.id),
        )
      : new Map();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          Çevrendekiler
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Pendik ve mahallelerinde meslek sahibi kişiler. Mesleğe veya bölgeye
          göre filtrele.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white rounded-2xl border border-ink-100 p-4 shadow-sm">
            <WorkerFilters professions={professions} total={workers.length} />
          </div>
        </div>

        <section>
          {!canContact && (
            <div className="mb-4 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-900">
              <p>
                Çevrendekilerle iletişime geçmek için{" "}
                <Link href="/giris" className="underline font-semibold">
                  giriş yap
                </Link>{" "}
                veya{" "}
                <Link href="/kayit" className="underline font-semibold">
                  ücretsiz kayıt ol
                </Link>
                .
              </p>
            </div>
          )}

          {workers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
              <p className="text-base font-medium text-ink-900">
                Aramayla eşleşen kişi bulunamadı.
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Filtreleri temizleyip tekrar deneyin.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {workers.map((w) => (
                <li key={w.id}>
                  <WorkerCard
                    worker={w}
                    categoryNameBySlug={categoryNameBySlug}
                    canContact={canContact}
                    requestStatus={requestStatusMap.get(w.id) ?? null}
                    isSelf={user?.id === w.id}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
