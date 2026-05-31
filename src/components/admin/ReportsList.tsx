"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";
import { getInitials } from "@/lib/initials";
import {
  WARNING_CATEGORIES,
  WARNING_TEMPLATES,
  type WarningCategory,
} from "@/lib/warning-templates";

type UserMini = { id: string; fullName: string; email: string };

type SenderInfo = UserMini & {
  isActive: boolean;
  openReportCount: number;
};

export type AdminReport = {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
  resolvedNote: string | null;
  reportedBy: UserMini;
  message: {
    id: string;
    content: string;
    createdAt: string;
    sender: SenderInfo;
    recipient: UserMini;
  } | null;
};

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export default function ReportsList({ reports }: { reports: AdminReport[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [warnTarget, setWarnTarget] = useState<{
    reportId: string;
    userId: string;
    name: string;
  } | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  async function resolve(report: AdminReport, note: string) {
    setError(null);
    setBusyId(report.id);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved", resolvedNote: note }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "İşlem başarısız.");
        return;
      }
      showToast("Rapor çözüldü olarak işaretlendi.");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  async function reopen(report: AdminReport) {
    setError(null);
    setBusyId(report.id);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "open" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "İşlem başarısız.");
        return;
      }
      showToast("Rapor tekrar açıldı.");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(report: AdminReport) {
    if (!confirm("Bu raporu silmek istediğine emin misin?")) return;
    setError(null);
    setBusyId(report.id);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Silinemedi.");
        return;
      }
      showToast("Rapor silindi.");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(report: AdminReport, makeActive: boolean) {
    if (!report.message) return;
    const sender = report.message.sender;
    const msg = makeActive
      ? `${sender.fullName} hesabını tekrar aktif et?`
      : `${sender.fullName} hesabını pasifleştir? Kullanıcı giriş yapamaz, profili listelerden kaybolur.`;
    if (!confirm(msg)) return;
    setError(null);
    setBusyId(report.id);
    try {
      const res = await fetch(`/api/admin/users/${sender.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: makeActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "İşlem başarısız.");
        return;
      }
      showToast(
        makeActive ? "Hesap tekrar aktif edildi." : "Hesap pasifleştirildi.",
      );
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  if (reports.length === 0) {
    return (
      <>
        {error && (
          <div
            className="card card-pad"
            style={{ marginBottom: 14, borderColor: "var(--danger)" }}
          >
            <span style={{ color: "var(--danger)", fontSize: 13 }}>
              {error}
            </span>
          </div>
        )}
        <div className="empty">Bu kategoride rapor yok.</div>
      </>
    );
  }

  return (
    <div className="stack-md">
      {error && (
        <div
          className="card card-pad"
          style={{ borderColor: "var(--danger)" }}
        >
          <span style={{ color: "var(--danger)", fontSize: 13 }}>{error}</span>
        </div>
      )}

      {reports.map((r) => (
        <ReportCard
          key={r.id}
          r={r}
          busy={busyId === r.id}
          onResolve={(note) => resolve(r, note)}
          onReopen={() => reopen(r)}
          onDelete={() => remove(r)}
          onToggleActive={(makeActive) => toggleActive(r, makeActive)}
          onWarn={(target) => setWarnTarget(target)}
        />
      ))}

      {warnTarget && (
        <WarnModal
          target={warnTarget}
          onClose={() => setWarnTarget(null)}
          onError={(msg) => setError(msg)}
          onDone={(category) => {
            setWarnTarget(null);
            showToast(`Uyarı gönderildi (${category}).`);
            router.refresh();
          }}
        />
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}

function ReportCard({
  r,
  busy,
  onResolve,
  onReopen,
  onDelete,
  onToggleActive,
  onWarn,
}: {
  r: AdminReport;
  busy: boolean;
  onResolve: (note: string) => void;
  onReopen: () => void;
  onDelete: () => void;
  onToggleActive: (makeActive: boolean) => void;
  onWarn: (target: { reportId: string; userId: string; name: string }) => void;
}) {
  const isOpen = r.status === "open";

  return (
    <div className="report">
      {/* Head */}
      <div className="report-head">
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <span
            className="mono"
            style={{ fontSize: 11.5, color: "var(--muted)" }}
          >
            #{shortId(r.id)}
          </span>
          <span className="tag tag-muted">{r.reason.slice(0, 40)}</span>
          {isOpen ? (
            <span className="tag tag-warn">
              <span className="tag-dot" />
              Açık
            </span>
          ) : (
            <span className="tag tag-ok">
              <span className="tag-dot" />
              Çözüldü
            </span>
          )}
          {r.message && !r.message.sender.isActive && (
            <span className="tag tag-danger">
              <span className="tag-dot" />
              Gönderici pasif
            </span>
          )}
        </div>
        <div
          className="mono"
          style={{ fontSize: 11.5, color: "var(--muted)" }}
        >
          {formatWhen(r.createdAt)}
        </div>
      </div>

      {/* Body */}
      <div className="report-body">
        {/* Sol: Raporu açan */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Raporu açan
          </div>
          <div className="row" style={{ gap: 10, marginBottom: 14 }}>
            <div
              className="avatar avatar-sm"
              style={{
                background: "var(--surface-2)",
                color: "var(--ink-2)",
              }}
            >
              {getInitials(r.reportedBy.fullName)}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>
                {r.reportedBy.fullName}
              </div>
              <div
                className="mono"
                style={{ fontSize: 11.5, color: "var(--muted)" }}
              >
                {r.reportedBy.email}
              </div>
            </div>
          </div>

          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Sebep
          </div>
          <div
            className="row"
            style={{
              padding: "10px 12px",
              border: "1px solid var(--line)",
              borderRadius: 10,
              background: "#fff",
              fontSize: 13,
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <AdminIcon name="alert" size={13} color="var(--muted)" />
            <span style={{ color: "var(--ink-2)", lineHeight: 1.5 }}>
              {r.reason}
            </span>
          </div>

          {r.status === "resolved" && r.resolvedNote && (
            <>
              <div
                className="eyebrow"
                style={{ marginTop: 14, marginBottom: 10 }}
              >
                Çözüm notu
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  background: "var(--accent-soft)",
                  fontSize: 13,
                  color: "var(--accent)",
                  lineHeight: 1.5,
                }}
              >
                {r.resolvedNote}
              </div>
            </>
          )}
        </div>

        {/* Sağ: Rapor edilen + mesaj */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Rapor edilen
          </div>
          {r.message ? (
            <>
              <div className="row" style={{ gap: 10, marginBottom: 14 }}>
                <div
                  className="avatar avatar-sm"
                  style={{
                    background: "var(--warn-soft)",
                    color: "var(--warn)",
                  }}
                >
                  {getInitials(r.message.sender.fullName)}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {r.message.sender.fullName}
                    {r.message.sender.openReportCount > 1 && (
                      <span
                        className="mono"
                        style={{
                          fontSize: 11,
                          color: "var(--warn)",
                          background: "var(--warn-soft)",
                          padding: "1px 7px",
                          borderRadius: 999,
                        }}
                      >
                        {r.message.sender.openReportCount} açık rapor
                      </span>
                    )}
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 11.5, color: "var(--muted)" }}
                  >
                    {r.message.sender.email}
                  </div>
                </div>
              </div>

              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Mesaj içeriği
              </div>
              <div className="report-msg">
                <div className="who">
                  <AdminIcon name="msg" size={11} />
                  <span>
                    {r.message.sender.fullName} →{" "}
                    {r.message.recipient.fullName} ·{" "}
                    {formatWhen(r.message.createdAt)}
                  </span>
                </div>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  &ldquo;{r.message.content}&rdquo;
                </div>
              </div>
            </>
          ) : (
            <div className="empty" style={{ padding: 24 }}>
              Mesaj silinmiş.
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="report-actions">
        {isOpen ? (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onDelete}
              disabled={busy}
            >
              <AdminIcon name="trash" size={13} /> Sil
            </button>
            {r.message && (
              <>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    onWarn({
                      reportId: r.id,
                      userId: r.message!.sender.id,
                      name: r.message!.sender.fullName,
                    })
                  }
                  disabled={busy}
                >
                  <AdminIcon name="alert" size={13} /> Uyarı gönder
                </button>
                {r.message.sender.isActive ? (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onToggleActive(false)}
                    disabled={busy}
                  >
                    <AdminIcon name="ban" size={13} /> Hesabı pasifleştir
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onToggleActive(true)}
                    disabled={busy}
                  >
                    <AdminIcon name="check" size={13} /> Aktif et
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                const note = prompt("Çözüm notu (isteğe bağlı):") ?? "";
                onResolve(note);
              }}
              disabled={busy}
            >
              <AdminIcon name="check" size={13} /> Çözüldü
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onDelete}
              disabled={busy}
            >
              <AdminIcon name="trash" size={13} /> Sil
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onReopen}
              disabled={busy}
            >
              Tekrar aç
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function WarnModal({
  target,
  onClose,
  onError,
  onDone,
}: {
  target: { reportId: string; userId: string; name: string };
  onClose: () => void;
  onError: (msg: string) => void;
  onDone: (categoryLabel: string) => void;
}) {
  const [category, setCategory] = useState<WarningCategory>("hakaret");
  const [customNote, setCustomNote] = useState("");
  const [sending, setSending] = useState(false);

  const template = useMemo(() => WARNING_TEMPLATES[category], [category]);

  async function send() {
    setSending(true);
    try {
      const res = await fetch("/api/admin/warn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: target.reportId,
          category,
          customNote: customNote.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        onError(data.error || "Uyarı gönderilemedi.");
        return;
      }
      onDone(template.label);
    } catch {
      onError("Bağlantı hatası.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 17, 16, 0.4)",
        padding: 16,
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 540,
          padding: 22,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ fontSize: 16, marginBottom: 4 }}>
          {target.name} için uyarı gönder
        </h3>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
          Sistem mesajı + email birlikte gönderilir, rapor otomatik çözülür,
          kullanıcının uyarı sayacı artar.
        </p>

        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--muted)",
            display: "block",
            marginBottom: 6,
          }}
        >
          İhlal kategorisi
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as WarningCategory)}
          className="!h-10"
          style={{ marginBottom: 16 }}
        >
          {WARNING_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        <div
          style={{
            background: "#FAFAF7",
            border: "1px solid var(--color-ink-100, #ECEAE2)",
            borderRadius: 10,
            padding: 12,
            fontSize: 12.5,
            lineHeight: 1.55,
            color: "var(--ink, #2A2A28)",
            marginBottom: 16,
            whiteSpace: "pre-wrap",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 12 }}>
            Önizleme (sohbete düşecek):
          </div>
          {template.systemMessage}
        </div>

        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--muted)",
            display: "block",
            marginBottom: 6,
          }}
        >
          Ek yönetim notu (opsiyonel, max 400 karakter)
        </label>
        <textarea
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value.slice(0, 400))}
          placeholder="Boş bırakılırsa sadece şablon gönderilir."
          rows={3}
          className="textarea"
          style={{ marginBottom: 16 }}
        />

        <div
          className="row"
          style={{ justifyContent: "flex-end", gap: 8 }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="btn btn-ghost btn-sm"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="btn btn-primary btn-sm"
          >
            {sending ? "Gönderiliyor..." : "Uyarıyı gönder"}
          </button>
        </div>
      </div>
    </div>
  );
}
