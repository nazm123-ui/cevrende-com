"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Category = {
  id: string;
  slug: string;
  name: string;
  order: number;
  isActive: boolean;
  createdAt: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Kategoriler yüklenemedi.");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newName || !newSlug) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, slug: newSlug }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kategori oluşturulamadı.");
      }
      const newCategory = (await res.json()).category;
      setCategories((prev) => [...prev, newCategory]);
      setNewName("");
      setNewSlug("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateCategory(id: string) {
    if (!editName) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (!res.ok) throw new Error("Kategori güncellenemedi.");
      const updated = (await res.json()).category;
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleCategory(id: string) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle" }),
      });
      if (!res.ok) throw new Error("Kategori durumu değiştirilemedi.");
      const updated = (await res.json()).category;
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <Link href="/admin" className="text-sm text-brand-700 hover:underline">
        ← Admin'e Dön
      </Link>

      <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
        Kategoriler
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Toplamda {categories.length} kategori.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          {loading ? (
            <p className="text-sm text-ink-500">Yükleniyor...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-ink-500">Kategori yok.</p>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-lg border border-ink-200 bg-white p-4"
                >
                  {editingId === cat.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 rounded border border-ink-200 px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => updateCategory(cat.id)}
                        disabled={submitting}
                        className="px-3 py-1 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:bg-ink-200"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        disabled={submitting}
                        className="px-3 py-1 rounded bg-ink-200 text-ink-700 text-sm font-medium hover:bg-ink-300 transition"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-ink-900">{cat.name}</p>
                        <p className="text-xs text-ink-500">{cat.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditName(cat.name);
                          }}
                          disabled={submitting}
                          className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition disabled:bg-ink-200"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => toggleCategory(cat.id)}
                          disabled={submitting}
                          className={`px-3 py-1 rounded text-sm font-medium transition disabled:bg-ink-200 ${
                            cat.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {cat.isActive ? "Aktif" : "Pasif"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={addCategory}
          className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm h-fit"
        >
          <h2 className="font-semibold text-ink-900 mb-4">Yeni Kategori</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1">
                Adı
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Örn: Garson"
                className="w-full rounded border border-ink-200 px-2 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="Örn: garson"
                className="w-full rounded border border-ink-200 px-2 py-2 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newName || !newSlug}
              className="w-full btn-ink h-10 rounded-full text-[14px]"
            >
              {submitting ? "Kaydediliyor..." : "Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
