import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getActiveWorkers, getProfessionCounts } from "@/lib/workers";
import { getRequestStatusMap } from "@/lib/contact-requests";
import WorkerCard from "@/components/workers/WorkerCard";
import WorkerFilters from "@/components/workers/WorkerFilters";
import QuickSearchCard from "@/components/home/QuickSearchCard";

export const metadata = {
  title: "Çevrendekiler — çevrende",
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
      orderBy: { order: "asc" },
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
    <div className="mx-auto max-w-[1200px] px-5 sm:px-6 py-12 sm:py-16">
      <header className="mb-10">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
          Çevrendekiler
        </p>
        <h1 className="mt-3 text-[34px] sm:text-[42px] font-semibold tracking-[-0.025em] leading-[1.08] text-ink-900">
          Pendik ve mahallelerinde
        </h1>
        <p className="mt-2 text-[16px] text-ink-500">
          <span className="font-mono text-ink-700">{workers.length}</span> kişi
          listeleniyor · meslek ve mahalleye göre süzebilirsin
        </p>
      </header>

      {!canContact ? (
        <LoggedOutGate
          totalCount={workers.length}
          popular={professions
            .sort((a, b) => b.count - a.count)
            .slice(0, 8)}
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] items-start">
          <aside className="lg:sticky lg:top-24">
            <WorkerFilters professions={professions} total={workers.length} />
          </aside>

          <section>
            {workers.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-ink-200 bg-white p-12 text-center">
                <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 mb-2">
                  Sonuç yok
                </p>
                <p className="text-[18px] font-medium text-ink-900">
                  Bu filtrelerle kimse bulamadık.
                </p>
                <p className="mt-1.5 text-[14px] text-ink-500">
                  Filtreleri temizleyip farklı bir mahalleyi deneyebilirsin.
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
      )}
    </div>
  );
}

function LoggedOutGate({
  totalCount,
  popular,
}: {
  totalCount: number;
  popular: { slug: string; name: string; count: number }[];
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
      <div className="bg-white border border-ink-100 rounded-[18px] p-8 sm:p-12 text-center">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
          Üyelere özel
        </p>
        <h2 className="mt-3 text-[26px] sm:text-[30px] font-semibold tracking-[-0.02em] text-ink-900 max-w-[420px] mx-auto leading-tight text-balance">
          Çevrendekilerin profillerini görmek için giriş yap
        </h2>
        <p className="mt-3 text-[15px] text-ink-500 max-w-[400px] mx-auto leading-relaxed">
          Spam ve istenmeyen iletişimi önlemek için profiller sadece üyelere
          açıktır. Kayıt ücretsiz.
        </p>

        <div className="mt-7 flex flex-wrap gap-3 justify-center">
          <Link
            href="/kayit"
            className="inline-flex items-center h-12 px-6 rounded-full bg-ink-900 text-white text-[15px] font-medium hover:bg-accent-600 transition"
          >
            Ücretsiz kayıt ol
          </Link>
          <Link
            href="/giris"
            className="inline-flex items-center h-12 px-6 rounded-full border border-ink-200 text-ink-900 text-[15px] font-medium hover:border-ink-900 transition"
          >
            Giriş yap
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-ink-100">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-400 mb-3">
            Şu an çevrende
          </p>
          <div className="font-mono text-[32px] text-ink-900 mb-1">
            {totalCount}
          </div>
          <p className="text-[13.5px] text-ink-500">meslek sahibi kişi</p>
        </div>
      </div>

      <div>
        <QuickSearchCard popular={popular} totalCount={totalCount} />
      </div>
    </div>
  );
}
