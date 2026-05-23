import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getActiveWorkers, getProfessionCounts } from "@/lib/workers";
import { getRequestStatusMap } from "@/lib/contact-requests";
import WorkerCard from "@/components/workers/WorkerCard";
import WorkerFilters from "@/components/workers/WorkerFilters";

export const metadata = {
  title: "Pendik İşçi Arama — Temizlikçi, Tadilat, Çilingir Bul",
  description:
    "Pendik ve Tuzla'da mesleğe göre işçi ara. Profil doğrula, mesajla, aracısız iletişime geç. Yüzlerce usta listesi.",
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: workers.slice(0, 20).map((w, i) => ({
              "@type": "LocalBusiness",
              position: i + 1,
              name: w.fullName || "Profesyonel",
              areaServed: w.district || "Pendik",
              description: w.bio || "",
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 py-12 sm:py-16">
      <header className="mb-10">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
          Çevrendekiler
        </p>
        <h1 className="mt-3 text-[34px] sm:text-[42px] font-semibold tracking-[-0.025em] leading-[1.08] text-ink-900">
          Pendik, Tuzla, Kartal'da Güvenilir İşçi Ara
        </h1>
        <p className="mt-2 text-[16px] text-ink-500">
          <span className="font-mono text-ink-700">{workers.length}</span> kişi
          listeleniyor · meslek ve mahalleye göre süzebilirsin
        </p>
      </header>

      {!canContact && (
        <div className="mb-8 rounded-[14px] bg-[#f4f2eb] border border-ink-100 px-5 sm:px-7 py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-medium text-ink-900">
              İsim ve telefon detaylarını gizledik
            </p>
            <p className="mt-0.5 text-[14px] text-ink-500">
              Üyeler tam profili görür, mesaj yazabilir, talep gönderebilir.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/giris"
              className="inline-flex items-center h-10 px-4 rounded-full border border-ink-200 text-[14px] font-medium text-ink-900 hover:border-ink-900 transition"
            >
              Giriş
            </Link>
            <Link
              href="/kayit"
              className="btn-ink h-10 px-4 rounded-full text-[14px]"
            >
              Ücretsiz kayıt
            </Link>
          </div>
        </div>
      )}

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
      </div>
    </>
  );
}
