import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getActiveWorkers, getProfessionCounts } from "@/lib/workers";
import { getEnabledDistricts, formatDistrictListTr } from "@/lib/districts";
import WorkerCard from "@/components/workers/WorkerCard";
import TopFilterBar from "@/components/workers/TopFilterBar";
import CategorySidebar from "@/components/workers/CategorySidebar";
import SortDropdown from "@/components/workers/SortDropdown";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const districts = await getEnabledDistricts();
  const label = formatDistrictListTr(districts.map((d) => d.name));
  return {
    title: `Çevrendekiler — ${label}'te Hizmet Verenler`,
    description: `${label} ve çevresinde mesleğe göre hizmet veren ara. Profil incele, doğrudan mesajla, aracısız iletişime geç.`,
    // Filtre parametreleri (?meslek, ?ilce, ?mahalle, ?q, ?siralama) sınırsız
    // URL varyasyonu üretir; hepsi parametresiz sayfaya konsolide edilir.
    alternates: { canonical: "/cevrendekiler" },
  };
}

type SearchParams = Promise<{
  meslek?: string;
  ilce?: string;
  mahalle?: string;
  q?: string;
  siralama?: string;
}>;

export default async function CevrendekilerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const districtsAll = await getEnabledDistricts();
  // sp.ilce slug, ilçe adına çevir
  const selectedDistrict = sp.ilce
    ? districtsAll.find((d) => d.slug === sp.ilce)
    : null;

  const [user, workerResult, professions, categories] = await Promise.all([
    getCurrentUser(),
    getActiveWorkers({
      profession: sp.meslek,
      district: selectedDistrict?.name,
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
  const districts = districtsAll;
  const { workers, widenedToDistrict } = workerResult;

  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));
  const canContact = !!user && user.isEmailVerified;
  const hasActiveFilters = !!(sp.meslek || sp.ilce || sp.mahalle || sp.q);
  // Mahalle aranıp sonuç çıkmayınca ilçe geneline genişlettiysek bildir.
  const districtLabel = selectedDistrict?.name ?? "ilçe";

  // Sayfa başlığı/tanıtımı — seçili meslek varsa ona göre uyarlanır.
  const areaLabel =
    selectedDistrict?.name ?? formatDistrictListTr(districtsAll.map((d) => d.name));
  const activeCategoryName = sp.meslek
    ? categoryNameBySlug.get(sp.meslek) ?? null
    : null;
  const pageHeading = activeCategoryName
    ? `${areaLabel}'te ${activeCategoryName}`
    : `${areaLabel}'te Hizmet Verenler`;
  const pageIntro = activeCategoryName
    ? `${areaLabel} ve çevresinde ${activeCategoryName.toLocaleLowerCase("tr")} arıyorsan müsait kişileri incele, doğrudan mesajla — aracı ve komisyon yok.`
    : `${areaLabel} ve çevresindeki hizmet verenleri meslek ve mahalleye göre filtrele, profil incele, doğrudan iletişime geç.`;

  return (
    <div className="page">
      {/* Sayfa başlığı + arama/filtre */}
      <section className="pt-8 pb-6">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <h1 className="u-balance text-[24px] sm:text-[30px] font-semibold tracking-[-0.02em] leading-[1.15] mb-1.5">
            {pageHeading}
          </h1>
          <p className="text-[14.5px] text-ink-500 leading-relaxed max-w-[640px] mb-5">
            {pageIntro}
          </p>
          <TopFilterBar
            districts={districts.map((d) => ({
              slug: d.slug,
              name: d.name,
              neighborhoods: d.neighborhoods,
            }))}
            categories={categories}
          />
        </div>
      </section>

      {/* Ana içerik — sidebar + listings */}
      <section className="pt-2 pb-24">
        <div
          className="mx-auto max-w-[1200px] px-5 sm:px-6 listings-grid"
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
            {widenedToDistrict && (
              <div className="mb-4 flex items-start gap-3 rounded-[12px] border border-accent-100 bg-accent-50 px-4 py-3 text-[13.5px] text-ink-700">
                <InfoIcon />
                <span>
                  <strong className="font-semibold">{sp.mahalle}</strong>{" "}
                  mahallesinde bu kriterlere uygun kimseyi bulamadık. Bunun
                  yerine <strong className="font-semibold">{districtLabel}</strong>{" "}
                  genelindeki sonuçları gösteriyoruz.
                </span>
              </div>
            )}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4 text-[13.5px] text-ink-500">
              <span>
                <span className="font-mono text-ink-700">{workers.length}</span>{" "}
                sonuç
              </span>
              <SortDropdown />
            </div>

            {workers.length === 0 ? (
              <div className="px-6 py-20 text-center border border-dashed border-ink-200 rounded-[14px] flex flex-col items-center gap-3">
                <EmptyIcon />
                <div className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium mt-2">
                  Sonuç yok
                </div>
                <h3>Bu filtrelerle kimseyi bulamadık.</h3>
                <p className="text-ink-500 text-[14px] max-w-md">
                  Filtreleri sıfırla veya farklı bir mahalleyi dene.
                </p>
                {hasActiveFilters && (
                  <Link
                    href="/cevrendekiler"
                    className="btn-outline h-10 px-5 rounded-full text-[14px] mt-2"
                  >
                    Filtreleri sıfırla
                  </Link>
                )}
              </div>
            ) : (
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
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

function InfoIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[2px] shrink-0 text-accent-600"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-ink-50 border border-ink-100 text-ink-400">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </span>
  );
}
