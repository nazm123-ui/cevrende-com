"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";
import { getInitials } from "@/lib/initials";

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  district: string;
  neighborhood: string | null;
  professions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  _count: {
    sentMessages: number;
    receivedMessages: number;
  };
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UsersTable({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  async function toggleActive(u: AdminUserRow) {
    if (u.isAdmin) return;
    setError(null);
    setBusyId(u.id);
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !u.isActive }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "İşlem başarısız.");
        return;
      }
      showToast(
        !u.isActive ? "Hesap aktif edildi." : "Hesap pasifleştirildi.",
      );
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(u: AdminUserRow) {
    if (u.isAdmin) return;
    if (
      !confirm(
        `${u.fullName} (${u.email}) hesabını kalıcı olarak silmek istiyor musun?\n\nBu işlem mesajları, talepleri ve raporları da siler. Geri alınamaz.`,
      )
    )
      return;
    setError(null);
    setBusyId(u.id);
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Silme başarısız.");
        return;
      }
      showToast("Kullanıcı silindi.");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  if (users.length === 0) {
    return <div className="empty">Sonuç yok.</div>;
  }

  return (
    <>
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

      <div className="card" style={{ overflow: "hidden" }}>
        {/* Header */}
        <div
          className="list-row head"
          style={{
            gridTemplateColumns: "1.6fr 1.2fr 1fr 0.7fr auto",
          }}
        >
          <div className="col">Kullanıcı</div>
          <div className="col">İletişim</div>
          <div className="col">Konum / Meslek</div>
          <div className="col">Etkinlik</div>
          <div className="col" style={{ textAlign: "right" }}>
            İşlem
          </div>
        </div>

        {/* Rows */}
        {users.map((u) => (
          <div
            key={u.id}
            className="list-row"
            style={{
              gridTemplateColumns: "1.6fr 1.2fr 1fr 0.7fr auto",
              opacity: u.isActive ? 1 : 0.65,
            }}
          >
            {/* Kullanıcı */}
            <div className="col col-name">
              <div
                className="avatar avatar-sm"
                style={{
                  background: u.isAdmin
                    ? "var(--ink)"
                    : u.professions.length > 0
                      ? "var(--accent)"
                      : "var(--surface-2)",
                  color:
                    u.isAdmin || u.professions.length > 0
                      ? "#fff"
                      : "var(--ink-2)",
                }}
              >
                {getInitials(u.fullName)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  className="nm"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  {u.fullName}
                  {u.isAdmin && (
                    <span className="tag tag-info" style={{ marginLeft: 4 }}>
                      Admin
                    </span>
                  )}
                  {!u.isActive && (
                    <span className="tag tag-danger">
                      <span className="tag-dot" />
                      Pasif
                    </span>
                  )}
                </div>
                <div className="sub">
                  {formatDate(u.createdAt)}{" "}
                  {u.professions.length > 0 && "· işçi"}
                </div>
              </div>
            </div>

            {/* İletişim */}
            <div className="col" style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {u.email}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 11.5,
                  color: "var(--muted)",
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {u.phone}
                {!u.isEmailVerified && (
                  <span
                    className="tag tag-muted"
                    style={{ fontSize: 10, marginLeft: 4 }}
                    title="E-posta doğrulanmamış"
                  >
                    e-posta ✗
                  </span>
                )}
                {!u.isPhoneVerified && (
                  <span
                    className="tag tag-muted"
                    style={{ fontSize: 10 }}
                    title="Telefon doğrulanmamış"
                  >
                    telefon ✗
                  </span>
                )}
              </div>
            </div>

            {/* Konum / Meslek */}
            <div className="col" style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink-2)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {u.neighborhood
                  ? `${u.neighborhood}, ${u.district}`
                  : u.district}
              </div>
              {u.professions.length > 0 && (
                <div
                  className="sub"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginTop: 2,
                  }}
                >
                  {u.professions.slice(0, 2).join(", ")}
                  {u.professions.length > 2 && " …"}
                </div>
              )}
            </div>

            {/* Etkinlik */}
            <div
              className="col mono"
              style={{ fontSize: 12, color: "var(--muted)" }}
            >
              {u._count.sentMessages + u._count.receivedMessages} mesaj
            </div>

            {/* İşlem */}
            <div
              className="col"
              style={{
                display: "flex",
                gap: 6,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => toggleActive(u)}
                disabled={busyId === u.id || u.isAdmin}
                className="btn btn-secondary btn-xs"
                title={u.isActive ? "Pasifleştir" : "Aktif et"}
              >
                {u.isActive ? "Pasifleştir" : "Aktif et"}
              </button>
              <button
                type="button"
                onClick={() => deleteUser(u)}
                disabled={busyId === u.id || u.isAdmin}
                className="btn btn-danger btn-xs"
                title="Hesabı sil"
              >
                <AdminIcon name="trash" size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </>
  );
}
