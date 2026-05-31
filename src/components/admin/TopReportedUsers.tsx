"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getInitials } from "@/lib/initials";

type TopUser = {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  warningCount: number;
  lastWarnedAt: string | null;
  totalReports: number;
  openReports: number;
};

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

export default function TopReportedUsers({ users }: { users: TopUser[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleActive(user: TopUser) {
    const makeActive = !user.isActive;
    const msg = makeActive
      ? `${user.fullName} hesabını tekrar aktif et?`
      : `${user.fullName} hesabını pasifleştir? Kullanıcı giriş yapamaz ve listelerden kaybolur.`;
    if (!confirm(msg)) return;
    setBusyId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: makeActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "İşlem başarısız.");
        return;
      }
      router.refresh();
    } catch {
      alert("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="card card-pad" style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, margin: 0 }}>Çok rapor edilen kullanıcılar</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "4px 0 0" }}>
            Aldıkları toplam rapor sayısına göre sıralı (top 10). 3+ açık raporu
            olan kullanıcı kırmızı işaretli görünür.
          </p>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13.5,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left" }}>
              <Th>Kullanıcı</Th>
              <Th align="center">Toplam rapor</Th>
              <Th align="center">Açık</Th>
              <Th align="center">Uyarı sayısı</Th>
              <Th>Son uyarı</Th>
              <Th>Durum</Th>
              <Th align="right">İşlem</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isCritical = u.openReports >= 3 || u.warningCount >= 3;
              return (
                <tr
                  key={u.id}
                  style={{
                    borderTop: "1px solid var(--color-ink-100, #ECEAE2)",
                    background: isCritical ? "#FEF2F2" : "transparent",
                  }}
                >
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "#F4F2EB",
                          border: "1px solid var(--color-ink-200, #DAD7CC)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {getInitials(u.fullName)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{u.fullName}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td align="center">
                    <span
                      className="mono"
                      style={{
                        fontWeight: 600,
                        color: isCritical ? "#B23A3A" : "inherit",
                      }}
                    >
                      {u.totalReports}
                    </span>
                  </Td>
                  <Td align="center">
                    {u.openReports > 0 ? (
                      <span className="tag tag-warn">{u.openReports}</span>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>0</span>
                    )}
                  </Td>
                  <Td align="center">
                    <span
                      className="mono"
                      style={{
                        color: u.warningCount >= 3 ? "#B23A3A" : "inherit",
                        fontWeight: u.warningCount > 0 ? 600 : 400,
                      }}
                    >
                      {u.warningCount}
                    </span>
                  </Td>
                  <Td>
                    <span
                      style={{
                        fontSize: 12.5,
                        color: "var(--muted)",
                      }}
                    >
                      {formatWhen(u.lastWarnedAt)}
                    </span>
                  </Td>
                  <Td>
                    {u.isActive ? (
                      <span className="tag tag-ok">
                        <span className="tag-dot" />
                        Aktif
                      </span>
                    ) : (
                      <span className="tag tag-muted">
                        <span className="tag-dot" />
                        Pasif
                      </span>
                    )}
                  </Td>
                  <Td align="right">
                    <button
                      type="button"
                      onClick={() => toggleActive(u)}
                      disabled={busyId === u.id}
                      className={
                        u.isActive
                          ? "btn btn-secondary btn-sm"
                          : "btn btn-primary btn-sm"
                      }
                    >
                      {busyId === u.id
                        ? "..."
                        : u.isActive
                          ? "Pasifleştir"
                          : "Aktif et"}
                    </button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "10px 8px",
        fontSize: 11.5,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: "var(--muted)",
        borderBottom: "1px solid var(--color-ink-100, #ECEAE2)",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <td
      style={{
        textAlign: align,
        padding: "12px 8px",
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}
