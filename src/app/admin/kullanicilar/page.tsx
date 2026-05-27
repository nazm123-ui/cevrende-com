import Link from "next/link";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import UsersTable from "@/components/admin/UsersTable";

export const metadata = { title: "Kullanıcılar — Admin" };

type SearchParams = Promise<{
  q?: string;
  filter?: "all" | "workers" | "inactive";
}>;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const filter = sp.filter ?? "all";

  const filters: Record<string, unknown>[] = [];
  if (q) {
    filters.push({
      OR: [
        { fullName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ],
    });
  }
  if (filter === "workers") {
    filters.push({ professions: { isEmpty: false } });
  } else if (filter === "inactive") {
    filters.push({ isActive: false });
  }

  const users = await prisma.user.findMany({
    where: filters.length ? { AND: filters } : undefined,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      district: true,
      neighborhood: true,
      professions: true,
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
      _count: {
        select: {
          sentMessages: true,
          receivedMessages: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Mark admins so the UI can hide destructive actions
  const enriched = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    isAdmin: isAdminEmail(u.email),
  }));

  const total = await prisma.user.count();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-[13px] text-ink-500 hover:text-ink-900 transition"
        >
          ← Admin paneli
        </Link>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          Kullanıcılar
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {users.length} / {total} gösteriliyor (en yeni 200)
        </p>
      </div>

      <form className="mb-5 flex flex-col sm:flex-row gap-2" action="/admin/kullanicilar">
        <input
          name="q"
          defaultValue={q}
          placeholder="İsim, e-posta veya telefon ile ara…"
          className="flex-1 h-11 px-4 rounded-[12px] border border-ink-200 bg-white text-[14.5px] text-ink-900 outline-none focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
        />
        <select
          name="filter"
          defaultValue={filter}
          className="h-11 px-3.5 rounded-[12px] border border-ink-200 bg-white text-[14.5px] text-ink-900 outline-none focus:border-ink-900"
        >
          <option value="all">Hepsi</option>
          <option value="workers">Sadece işçi profili olanlar</option>
          <option value="inactive">Sadece pasif hesaplar</option>
        </select>
        <button
          type="submit"
          className="btn-ink h-11 px-5 rounded-[12px] text-[14.5px]"
        >
          Filtrele
        </button>
      </form>

      <UsersTable users={enriched} />
    </div>
  );
}
