import Link from "next/link";
import { requireEmployer } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import JobForm from "@/components/panel/JobForm";

export const metadata = { title: "Yeni İlan — Cevrende.com" };

export default async function YeniIlanPage() {
  await requireEmployer();
  const categories = await prisma.jobCategory.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <Link href="/panel" className="text-sm text-brand-700 hover:underline">
        ← Panele Dön
      </Link>
      <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
        Yeni İlan Oluştur
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        İlan ücretsiz yayınlanır ve 30 gün boyunca aktif kalır.
      </p>

      <div className="mt-6">
        <JobForm categories={categories} mode="create" />
      </div>
    </div>
  );
}
