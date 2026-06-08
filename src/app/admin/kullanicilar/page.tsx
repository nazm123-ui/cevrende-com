import Link from "next/link";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import { getEnabledDistricts } from "@/lib/districts";
import { getPublicUrl } from "@/lib/r2";
import AdminIcon from "@/components/admin/AdminIcon";
import UsersTable from "@/components/admin/UsersTable";
import AddUserDialog from "@/components/admin/AddUserDialog";

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

  const [users, totalCount, workerCount, inactiveCount, categories, districts] =
    await Promise.all([
      prisma.user.findMany({
        where: filters.length ? { AND: filters } : undefined,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          district: true,
          neighborhood: true,
          professions: true,
          bio: true,
          isActive: true,
          isAvailable: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          workerSettings: true,
          profilePhotoKey: true,
          createdAt: true,
          _count: {
            select: { sentMessages: true, receivedMessages: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.user.count(),
      prisma.user.count({ where: { professions: { isEmpty: false } } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.jobCategory.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: { slug: true, name: true },
      }),
      getEnabledDistricts(),
    ]);

  const districtOptions = districts.map((d) => ({
    name: d.name,
    neighborhoods: d.neighborhoods,
  }));

  const enriched = users.map(({ workerSettings, profilePhotoKey, ...u }) => {
    const ws =
      workerSettings && typeof workerSettings === "object"
        ? (workerSettings as Record<string, unknown>)
        : {};
    return {
      ...u,
      createdAt: u.createdAt.toISOString(),
      isAdmin: isAdminEmail(u.email),
      showDistrict: ws.showDistrict === true,
      phoneVisibility: ws.phoneVisibility === "public" ? "public" : "private",
      profilePhotoUrl: profilePhotoKey ? getPublicUrl(profilePhotoKey) : null,
    } as const;
  });

  return (
    <div className="page-fade">
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Yönetim · Kullanıcılar
          </div>
          <h1 style={{ marginBottom: 6 }}>Kullanıcılar</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            {users.length} sonuç {users.length === 200 ? "(en yeni 200)" : ""} ·
            Toplam {totalCount}
          </p>
        </div>
        <AddUserDialog categories={categories} districts={districtOptions} />
      </div>

      {/* Quick stats */}
      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <div className="card card-pad">
          <div className="metric-label">Toplam Kullanıcı</div>
          <div className="metric-row">
            <div className="metric-value num">{totalCount}</div>
            <div className="metric-delta flat">kayıtlı hesap</div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="metric-label">İşçi Profili</div>
          <div className="metric-row">
            <div className="metric-value num">{workerCount}</div>
            <div className="metric-delta flat">profession dolu</div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="metric-label">Pasif Hesap</div>
          <div className="metric-row">
            <div
              className="metric-value num"
              style={{
                color: inactiveCount > 0 ? "var(--danger)" : "var(--ink)",
              }}
            >
              {inactiveCount}
            </div>
            <div className="metric-delta flat">erişim engelli</div>
          </div>
        </div>
      </div>

      {/* Search + filter */}
      <form
        action="/admin/kullanicilar"
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div
          className="search"
          style={{ flex: "1 1 280px", maxWidth: "none", width: "auto" }}
        >
          <AdminIcon name="search" size={15} color="var(--muted)" />
          <input
            name="q"
            defaultValue={q}
            placeholder="İsim, e-posta veya telefon ile ara…"
          />
        </div>
        <select name="filter" defaultValue={filter} className="select" style={{ width: 240 }}>
          <option value="all">Hepsi</option>
          <option value="workers">Sadece işçi profili olanlar</option>
          <option value="inactive">Sadece pasif hesaplar</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Filtrele
        </button>
      </form>

      {/* Filter chips */}
      <div
        className="row"
        style={{ gap: 8, marginBottom: 18, flexWrap: "wrap" }}
      >
        <FilterChip
          href="/admin/kullanicilar"
          active={filter === "all" && !q}
        >
          Hepsi <span className="chip-count">{totalCount}</span>
        </FilterChip>
        <FilterChip
          href="/admin/kullanicilar?filter=workers"
          active={filter === "workers"}
        >
          İşçiler <span className="chip-count">{workerCount}</span>
        </FilterChip>
        <FilterChip
          href="/admin/kullanicilar?filter=inactive"
          active={filter === "inactive"}
        >
          Pasif <span className="chip-count">{inactiveCount}</span>
        </FilterChip>
      </div>

      <UsersTable
        users={enriched}
        categories={categories}
        districts={districtOptions}
      />
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={"chip" + (active ? " is-active" : "")}>
      {children}
    </Link>
  );
}
