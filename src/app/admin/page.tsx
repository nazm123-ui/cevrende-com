import Link from "next/link";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Admin Paneli — Cevrende.com" };

export default async function AdminPage() {
  await requireAdmin();

  const [categoriesCount, usersCount, workersCount] = await Promise.all([
    prisma.jobCategory.count(),
    prisma.user.count(),
    prisma.user.count({ where: { professions: { isEmpty: false } } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          Admin Paneli
        </h1>
        <p className="mt-1 text-sm text-ink-500">Sistem yönetimi</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card
          href="/admin/kategoriler"
          title="Kategoriler"
          count={categoriesCount}
          color="blue"
        />
        <Card
          href="/iscilar"
          title="İşçi Profili Olanlar"
          count={workersCount}
          color="green"
        />
        <Card
          href="#"
          title="Toplam Kullanıcı"
          count={usersCount}
          color="amber"
        />
      </div>
    </div>
  );
}

function Card({
  href,
  title,
  count,
  color,
}: {
  href: string;
  title: string;
  count: number;
  color: string;
}) {
  const bgColors: Record<string, string> = {
    amber: "bg-amber-50 border-amber-200",
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
  };
  const textColors: Record<string, string> = {
    amber: "text-amber-900",
    blue: "text-blue-900",
    green: "text-green-900",
  };
  const numberColors: Record<string, string> = {
    amber: "text-amber-700",
    blue: "text-blue-700",
    green: "text-green-700",
  };

  return (
    <Link
      href={href}
      className={`rounded-2xl border p-5 transition hover:shadow-md ${bgColors[color]}`}
    >
      <p className={`text-sm font-medium ${textColors[color]}`}>{title}</p>
      <p className={`mt-2 text-3xl font-bold ${numberColors[color]}`}>
        {count}
      </p>
    </Link>
  );
}
