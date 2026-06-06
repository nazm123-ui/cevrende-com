"use client";

import { useState, useEffect } from "react";

type Suggestion = {
  id: string;
  suggestedName: string;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  resultName: string | null;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  user: { id: string; fullName: string; email: string };
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSuggestionsPage() {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [addToProfile, setAddToProfile] = useState(true);

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/category-suggestions");
      if (!res.ok) throw new Error("Öneriler yüklenemedi.");
      setItems(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  function startApprove(s: Suggestion) {
    setEditId(s.id);
    setEditName(s.suggestedName);
    setAddToProfile(true);
  }

  async function approve(id: string) {
    const name = editName.trim();
    if (name.length < 2) {
      showToast("Kategori adı en az 2 karakter olmalı.");
      return;
    }
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/category-suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", id, name, addToProfile }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Onaylanamadı.");
      setEditId(null);
      showToast(
        data.addedToProfile
          ? `"${name}" eklendi + öneren kişinin profiline işlendi.`
          : `"${name}" kategorisi eklendi.`,
      );
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Hata.");
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id: string) {
    const reason = window.prompt(
      "Reddetme nedeni (opsiyonel — öneren kişiye gösterilmez, sadece kayıt için):",
    );
    if (reason === null) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/category-suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", id, reason: reason || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Reddedilemedi.");
      showToast("Öneri reddedildi.");
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Hata.");
    } finally {
      setBusyId(null);
    }
  }

  const pending = items.filter((s) => s.status === "pending");
  const approved = items.filter((s) => s.status === "approved");
  const rejected = items.filter((s) => s.status === "rejected");

  return (
    <div className="page-fade">
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Yönetim · Öneriler
        </div>
        <h1 style={{ marginBottom: 6 }}>Meslek Önerileri</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Kullanıcıların eklenmesini istediği meslekler. Onaylayınca kategori
          oluşur, öneren kişiye mesaj + e-posta gider.
        </p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <div className="card card-pad">
          <div className="metric-label">Bekleyen</div>
          <div className="metric-row">
            <div className="metric-value num" style={{ color: "var(--accent)" }}>
              {pending.length}
            </div>
            <div className="metric-delta flat">inceleme bekliyor</div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="metric-label">Onaylanan</div>
          <div className="metric-row">
            <div className="metric-value num">{approved.length}</div>
            <div className="metric-delta flat">eklendi</div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="metric-label">Reddedilen</div>
          <div className="metric-row">
            <div className="metric-value num">{rejected.length}</div>
            <div className="metric-delta flat">uygun değil</div>
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

      {loading ? (
        <div className="card card-pad" style={{ color: "var(--muted)" }}>
          Yükleniyor…
        </div>
      ) : items.length === 0 ? (
        <div className="card card-pad" style={{ color: "var(--muted)" }}>
          Henüz öneri yok.
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          {items.map((s) => (
            <div
              key={s.id}
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {s.suggestedName}
                    <StatusBadge status={s.status} />
                  </div>
                  {s.note && (
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 13,
                        color: "var(--muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      “{s.note}”
                    </p>
                  )}
                  <p
                    className="mono"
                    style={{
                      margin: "6px 0 0",
                      fontSize: 11.5,
                      color: "var(--muted)",
                    }}
                  >
                    {s.user.fullName} · {s.user.email} · {fmtDate(s.createdAt)}
                    {s.status === "approved" && s.resultName
                      ? ` · → ${s.resultName}`
                      : ""}
                  </p>
                </div>

                {s.status === "pending" && editId !== s.id && (
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => startApprove(s)}
                      className="btn btn-primary btn-sm"
                      disabled={busyId === s.id}
                    >
                      Onayla
                    </button>
                    <button
                      type="button"
                      onClick={() => reject(s.id)}
                      className="btn btn-ghost btn-sm"
                      disabled={busyId === s.id}
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </div>

              {editId === s.id && (
                <div
                  style={{
                    background: "var(--surface-2, #f7f7f5)",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <label
                    style={{ fontSize: 12, color: "var(--muted)" }}
                  >
                    Kategori adı (düzeltebilirsin — slug otomatik üretilir)
                  </label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={50}
                    className="input"
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontSize: 14,
                    }}
                  />
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--ink)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={addToProfile}
                      onChange={(e) => setAddToProfile(e.target.checked)}
                    />
                    Öneren kişinin profiline otomatik ekle
                  </label>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="btn btn-ghost btn-sm"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="button"
                      onClick={() => approve(s.id)}
                      className="btn btn-primary btn-sm"
                      disabled={busyId === s.id}
                    >
                      {busyId === s.id ? "Ekleniyor…" : "Onayla ve ekle"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: Suggestion["status"] }) {
  const map = {
    pending: { label: "Bekliyor", bg: "#fef3c7", fg: "#92400e" },
    approved: { label: "Onaylandı", bg: "#dcfce7", fg: "#166534" },
    rejected: { label: "Reddedildi", bg: "#fee2e2", fg: "#991b1b" },
  } as const;
  const s = map[status];
  return (
    <span
      style={{
        marginLeft: 8,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
        verticalAlign: "middle",
      }}
    >
      {s.label}
    </span>
  );
}
