"use client";

import { useMemo, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";

type District = {
  id: string;
  slug: string;
  name: string;
  isEnabled: boolean;
  order: number;
  neighborhoods: string[];
};

type Props = {
  initialDistricts: District[];
};

export default function DistrictsClient({ initialDistricts }: Props) {
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [toast, setToast] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return districts.filter((d) => {
      if (filter === "enabled" && !d.isEnabled) return false;
      if (filter === "disabled" && d.isEnabled) return false;
      if (q && !d.name.toLowerCase().includes(q) && !d.slug.includes(q))
        return false;
      return true;
    });
  }, [districts, query, filter]);

  const enabledCount = districts.filter((d) => d.isEnabled).length;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function toggleEnabled(d: District) {
    setBusyId(d.id);
    try {
      const res = await fetch(`/api/admin/districts/${d.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: !d.isEnabled }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Güncelleme başarısız.");
        return;
      }
      const updated = (await res.json()) as District;
      setDistricts((prev) =>
        prev.map((x) => (x.id === updated.id ? updated : x)),
      );
      showToast(
        updated.isEnabled
          ? `${updated.name} açıldı.`
          : `${updated.name} kapatıldı.`,
      );
    } catch {
      showToast("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(d: District) {
    setEditingId(d.id);
    setEditText(d.neighborhoods.join("\n"));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  async function saveEdit(d: District) {
    setBusyId(d.id);
    const neighborhoods = editText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const res = await fetch(`/api/admin/districts/${d.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ neighborhoods }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Kayıt başarısız.");
        return;
      }
      const updated = (await res.json()) as District;
      setDistricts((prev) =>
        prev.map((x) => (x.id === updated.id ? updated : x)),
      );
      cancelEdit();
      showToast(`${updated.name}: ${neighborhoods.length} mahalle güncellendi.`);
    } catch {
      showToast("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="page">
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">İlçeler</h1>
          <p className="page-sub">
            Hizmet verdiğin ilçeleri aç/kapa. Kapalı ilçelerden kayıt
            kabul edilmez, dropdown'larda görünmez.
          </p>
        </div>
        <div className="page-stats">
          <div className="stat">
            <div className="stat-num num">{enabledCount}</div>
            <div className="stat-label">Aktif</div>
          </div>
          <div className="stat">
            <div className="stat-num num">{districts.length}</div>
            <div className="stat-label">Toplam</div>
          </div>
        </div>
      </div>

      <div
        className="filter-bar"
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 320 }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
              pointerEvents: "none",
            }}
          >
            <AdminIcon name="search" size={15} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İlçe ara…"
            aria-label="İlçe ara"
            style={{ paddingLeft: 36 }}
          />
        </div>

        <div className="tabs" role="tablist" style={{ display: "flex", gap: 4 }}>
          {(
            [
              { key: "all", label: "Tümü" },
              { key: "enabled", label: "Aktif" },
              { key: "disabled", label: "Kapalı" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              className={"btn btn-sm " + (filter === t.key ? "btn-primary" : "btn-ghost")}
              role="tab"
              aria-selected={filter === t.key}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>
            Eşleşen ilçe yok.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filtered.map((d, idx) => {
              const isEditing = editingId === d.id;
              const isBusy = busyId === d.id;
              return (
                <div
                  key={d.id}
                  style={{
                    padding: "14px 18px",
                    borderTop: idx === 0 ? "none" : "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    background: d.isEnabled ? "transparent" : "var(--bg-soft, #FAFAF7)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        flex: "1 1 200px",
                        minWidth: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: d.isEnabled
                            ? "#22c55e"
                            : "var(--border)",
                          flexShrink: 0,
                        }}
                        aria-hidden
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: "var(--ink)",
                          }}
                        >
                          {d.name}
                        </div>
                        <div
                          className="mono"
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                          }}
                        >
                          /{d.slug} — {d.neighborhoods.length} mahalle
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => (isEditing ? cancelEdit() : startEdit(d))}
                        disabled={isBusy}
                        className="btn btn-sm btn-ghost"
                      >
                        <AdminIcon name="edit" size={14} />
                        {isEditing ? "İptal" : "Mahalleler"}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleEnabled(d)}
                        disabled={isBusy}
                        className={
                          "btn btn-sm " + (d.isEnabled ? "btn-ghost" : "btn-primary")
                        }
                        aria-label={d.isEnabled ? "Kapat" : "Aç"}
                      >
                        {isBusy
                          ? "…"
                          : d.isEnabled
                            ? "Kapat"
                            : "Aç"}
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        paddingTop: 6,
                      }}
                    >
                      <label
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                        }}
                      >
                        Mahalleler (her satıra bir mahalle)
                      </label>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={Math.min(
                          12,
                          Math.max(4, editText.split("\n").length),
                        )}
                        style={{
                          width: "100%",
                          fontFamily: "ui-monospace, monospace",
                          fontSize: 13,
                          padding: 10,
                        }}
                      />
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="btn btn-sm btn-ghost"
                          disabled={isBusy}
                        >
                          Vazgeç
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEdit(d)}
                          className="btn btn-sm btn-primary"
                          disabled={isBusy}
                        >
                          {isBusy ? "Kaydediliyor…" : "Kaydet"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 999,
            fontSize: 13,
            boxShadow: "0 4px 24px rgba(0,0,0,.15)",
            zIndex: 100,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
