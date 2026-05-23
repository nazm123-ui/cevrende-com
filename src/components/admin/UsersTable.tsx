"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    receivedRequests: number;
  };
};

export default function UsersTable({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    ) {
      return;
    }
    setError(null);
    setBusyId(u.id);
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Silme başarısız.");
        return;
      }
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  if (users.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-ink-200 bg-white p-10 text-center text-[14px] text-ink-500">
        Sonuç yok.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className={`rounded-[12px] border bg-white p-4 ${
              u.isActive ? "border-ink-100" : "border-ink-200 bg-ink-50/50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[15px] font-semibold text-ink-900 truncate">
                    {u.fullName}
                  </p>
                  {u.isAdmin && <Pill tone="brand">Admin</Pill>}
                  {!u.isActive && <Pill tone="warn">Pasif</Pill>}
                  {u.professions.length > 0 && <Pill tone="ok">İşçi</Pill>}
                  {!u.isEmailVerified && <Pill tone="muted">E-posta ✗</Pill>}
                  {!u.isPhoneVerified && <Pill tone="muted">Telefon ✗</Pill>}
                </div>
                <p className="mt-1 text-[13px] text-ink-500 break-all">
                  {u.email} · {u.phone}
                </p>
                <p className="mt-0.5 text-[13px] text-ink-500">
                  {u.neighborhood ? `${u.neighborhood}, ${u.district}` : u.district}
                  {u.professions.length > 0 && (
                    <> · {u.professions.slice(0, 3).join(", ")}{u.professions.length > 3 ? "…" : ""}</>
                  )}
                </p>
                <p className="mt-1.5 font-mono text-[11.5px] text-ink-400">
                  Kayıt: {new Date(u.createdAt).toLocaleDateString("tr-TR")} ·
                  Mesaj: {u._count.sentMessages + u._count.receivedMessages} ·
                  Talep al: {u._count.receivedRequests}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleActive(u)}
                  disabled={busyId === u.id || u.isAdmin}
                  className="inline-flex items-center h-9 px-3.5 rounded-full border border-ink-200 text-[13px] font-medium text-ink-900 hover:border-ink-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {u.isActive ? "Pasif yap" : "Aktif yap"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteUser(u)}
                  disabled={busyId === u.id || u.isAdmin}
                  className="inline-flex items-center h-9 px-3.5 rounded-full border border-red-200 text-[13px] font-medium text-red-700 hover:bg-red-50 hover:border-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sil
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "brand" | "warn" | "ok" | "muted";
}) {
  const cls = {
    brand: "bg-ink-900 text-white",
    warn: "bg-warn-500/10 text-warn-500 border border-warn-500/30",
    ok: "bg-accent-50 text-accent-700 border border-accent-100",
    muted: "bg-ink-100 text-ink-500",
  }[tone];
  return (
    <span
      className={`inline-flex items-center h-5 px-2 rounded-full text-[10.5px] font-medium tracking-tight ${cls}`}
      style={tone === "brand" ? { color: "#ffffff" } : undefined}
    >
      {children}
    </span>
  );
}
