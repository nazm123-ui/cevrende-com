"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Page = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  isPublished: boolean;
  order: number;
  updatedAt: string;
};

export default function CategoryPagesClient({ initial }: { initial: Page[] }) {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function togglePublish(p: Page) {
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/category-pages/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !p.isPublished }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        showToast(d.error || "Güncelleme başarısız.");
        return;
      }
      setPages((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, isPublished: !x.isPublished } : x)),
      );
      showToast(p.isPublished ? "Taslağa alındı." : "Yayınlandı.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(p: Page) {
    if (!confirm(`"${p.name}" sayfasını silmek istediğine emin misin? Bu geri alınamaz.`))
      return;
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/category-pages/${p.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        showToast(d.error || "Silme başarısız.");
        return;
      }
      setPages((prev) => prev.filter((x) => x.id !== p.id));
      showToast("Sayfa silindi.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-[1000px]">
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-ink-900">
            Kategori Sayfaları
          </h1>
          <p className="text-[14px] text-ink-500 mt-1">
            /pendik/… sayfalarını buradan yönet. {pages.length} sayfa.
          </p>
        </div>
        <Link
          href="/admin/sayfalar/yeni"
          className="btn-ink h-10 px-5 rounded-full text-[14px] whitespace-nowrap"
        >
          + Yeni sayfa
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {pages.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-3 rounded-[12px] border border-ink-100 bg-white px-4 py-3 flex-wrap"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[15px] font-medium text-ink-900">
                  {p.name}
                </span>
                <span
                  className={`inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium ${
                    p.isPublished
                      ? "bg-accent-50 text-accent-700"
                      : "bg-ink-100 text-ink-500"
                  }`}
                >
                  {p.isPublished ? "Yayında" : "Taslak"}
                </span>
              </div>
              <div className="font-mono text-[12.5px] text-ink-500 mt-0.5">
                /pendik/{p.slug} · {p.categorySlug}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/pendik/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] text-ink-500 hover:text-ink-900 transition px-2"
              >
                Önizle ↗
              </a>
              <button
                onClick={() => togglePublish(p)}
                disabled={busyId === p.id}
                className="text-[13px] text-ink-700 hover:text-ink-900 transition px-2 disabled:opacity-50"
              >
                {p.isPublished ? "Taslağa al" : "Yayınla"}
              </button>
              <Link
                href={`/admin/sayfalar/${p.id}`}
                className="btn-outline h-9 px-4 rounded-full text-[13px]"
              >
                Düzenle
              </Link>
              <button
                onClick={() => remove(p)}
                disabled={busyId === p.id}
                className="text-[13px] text-red-600 hover:text-red-700 transition px-2 disabled:opacity-50"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
        {pages.length === 0 && (
          <div className="text-center text-ink-500 text-[14px] py-12 border border-dashed border-ink-200 rounded-[12px]">
            Henüz sayfa yok. &quot;Yeni sayfa&quot; ile başla.
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink-900 text-white text-[13.5px] px-4 py-2.5 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
