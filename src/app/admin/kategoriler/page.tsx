"use client";

import { useState, useEffect } from "react";
import AdminIcon from "@/components/admin/AdminIcon";

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
  const [toast, setToast] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

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
    setError(null);
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
      showToast(`"${newCategory.name}" eklendi.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateCategory(id: string) {
    if (!editName) return;
    setSubmitting(true);
    setError(null);
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
      showToast("Kategori adı güncellendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleCategory(id: string) {
    setSubmitting(true);
    setError(null);
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
      showToast(updated.isActive ? "Aktif edildi." : "Pasifleştirildi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.length - activeCount;

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
            Yönetim · Kategoriler
          </div>
          <h1 style={{ marginBottom: 6 }}>Meslek Kategorileri</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Toplam {categories.length} kategori · {activeCount} aktif ·{" "}
            {inactiveCount} pasif
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <div className="card card-pad">
          <div className="metric-label">Toplam</div>
          <div className="metric-row">
            <div className="metric-value num">{categories.length}</div>
            <div className="metric-delta flat">kategori</div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="metric-label">Aktif</div>
          <div className="metric-row">
            <div
              className="metric-value num"
              style={{ color: "var(--accent)" }}
            >
              {activeCount}
            </div>
            <div className="metric-delta flat">kullanıma açık</div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="metric-label">Pasif</div>
          <div className="metric-row">
            <div className="metric-value num">{inactiveCount}</div>
            <div className="metric-delta flat">gizli</div>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="card card-pad"
          style={{
            borderColor: "var(--danger)",
            color: "var(--danger)",
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-2-1">
        {/* Left: list */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div
            className="list-row head"
            style={{ gridTemplateColumns: "1fr 1fr auto" }}
          >
            <div className="col">Ad</div>
            <div className="col">Slug</div>
            <div className="col" style={{ textAlign: "right" }}>
              İşlem
            </div>
          </div>

          {loading ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              Yükleniyor…
            </div>
          ) : categories.length === 0 ? (
            <div className="empty">Henüz kategori yok.</div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="list-row"
                style={{ gridTemplateColumns: "1fr 1fr auto" }}
              >
                <div className="col col-name">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input"
                        style={{ height: 32 }}
                      />
                    ) : (
                      <div className="nm">
                        {cat.name}
                        {!cat.isActive && (
                          <span
                            className="tag tag-muted"
                            style={{ marginLeft: 8 }}
                          >
                            <span className="tag-dot" />
                            pasif
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col">
                  <code
                    className="mono"
                    style={{ fontSize: 12, color: "var(--muted)" }}
                  >
                    {cat.slug}
                  </code>
                </div>

                <div
                  className="col"
                  style={{
                    display: "flex",
                    gap: 6,
                    justifyContent: "flex-end",
                  }}
                >
                  {editingId === cat.id ? (
                    <>
                      <button
                        onClick={() => updateCategory(cat.id)}
                        disabled={submitting}
                        className="btn btn-primary btn-xs"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        disabled={submitting}
                        className="btn btn-ghost btn-xs"
                      >
                        İptal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditName(cat.name);
                        }}
                        disabled={submitting}
                        className="btn btn-ghost btn-xs"
                        title="Düzenle"
                      >
                        <AdminIcon name="edit" size={12} />
                      </button>
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        disabled={submitting}
                        className="btn btn-secondary btn-xs"
                      >
                        {cat.isActive ? "Pasifleştir" : "Aktif et"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: add form */}
        <form onSubmit={addCategory} className="card card-pad">
          <h3 style={{ fontSize: 15, marginBottom: 4 }}>Yeni kategori</h3>
          <p
            style={{
              fontSize: 12.5,
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            URL'lerde kullanılacak slug otomatik üretilmez, manuel gir.
          </p>

          <div className="stack-sm" style={{ gap: 14 }}>
            <div>
              <label className="label">Adı</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Örn: Garson"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Slug</label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) =>
                  setNewSlug(
                    e.target.value
                      .toLocaleLowerCase("tr")
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  )
                }
                placeholder="ornek-slug"
                className="input mono"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newName || !newSlug}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              <AdminIcon name="plus" size={14} />
              {submitting ? "Ekleniyor…" : "Ekle"}
            </button>
          </div>
        </form>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
