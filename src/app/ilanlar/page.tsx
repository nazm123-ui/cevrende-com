import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getActiveJobs, getActiveCategoriesWithCounts } from "@/lib/jobs";
import { canSeeFullContact, type Viewer } from "@/lib/masking";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";

export const metadata = {
  title: "İş İlanları — Cevrende.com",
  description:
    "Pendik ve çevresindeki güncel iş ilanlarını filtreleyerek görüntüleyin.",
};

type SearchParams = Promise<{
  kategori?: string;
  mahalle?: string;
  tip?: string;
  q?: string;
}>;

export default async function IlanlarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const [user, jobs, categories] = await Promise.all([
    getCurrentUser(),
    getActiveJobs({
      category: sp.kategori,
      neighborhood: sp.mahalle,
      jobType: sp.tip,
      q: sp.q,
    }),
    getActiveCategoriesWithCounts(),
  ]);

  const viewer: Viewer = user
    ? user.isPhoneVerified
      ? { kind: "verified", userId: user.id }
      : { kind: "unverified", userId: user.id }
    : { kind: "guest" };

  const canSeeFullEmployer = canSeeFullContact(viewer);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          İş İlanları
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Pendik ve mahallelerindeki güncel ilanlar.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white rounded-2xl border border-ink-100 p-4 shadow-sm">
            <JobFilters categories={categories} total={jobs.length} />
          </div>
        </div>

        <section>
          {!canSeeFullEmployer && (
            <div className="mb-4 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-900">
              <p>
                Ad soyad ve iletişim bilgileri{" "}
                <strong>güvenliğiniz için maskelendi</strong>.{" "}
                <Link href="/giris" className="underline font-semibold">
                  Giriş yap
                </Link>{" "}
                ya da{" "}
                <Link href="/kayit" className="underline font-semibold">
                  ücretsiz kayıt ol
                </Link>
                , telefon doğrulamasından sonra ilan verenlerle iletişime geçin.
              </p>
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="bg-white border border-ink-100 rounded-2xl p-10 text-center">
              <p className="text-ink-700 font-medium">Sonuç bulunamadı.</p>
              <p className="mt-1 text-sm text-ink-500">
                Filtreleri değiştirerek tekrar deneyin.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {jobs.map((j) => (
                <li key={j.id}>
                  <JobCard
                    job={j}
                    canSeeFullEmployer={canSeeFullEmployer}
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
