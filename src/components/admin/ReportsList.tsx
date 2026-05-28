"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ReportsList({ reports }: { reports: AdminReport[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warnTarget, setWarnTarget] = useState<{
    userId: string;
    name: string;
  } | null>(null);

  async function resolve(report: AdminReport) {
    const note = prompt("Çözüm notu (isteğe bağlı):");
    if (note === null) return;
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
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-ink-200 bg-white p-10 text-center text-[14px] text-ink-500">
        Bu kategoride rapor yok.
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

      <ul className="space-y-3">
        {reports.map((r) => (
          <li
            key={r.id}
            className="rounded-[14px] border border-ink-100 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center h-5 px-2 rounded-full text-[10.5px] font-medium ${
                      r.status === "open"
                        ? "bg-warn-500/10 text-warn-500 border border-warn-500/30"
                        : "bg-accent-50 text-accent-700 border border-accent-100"
                    }`}
                  >
                    {r.status === "open" ? "Açık" : "Çözüldü"}
                  </span>
                  <span className="font-mono text-[11.5px] text-ink-500">
                    {new Date(r.createdAt).toLocaleString("tr-TR")}
                  </span>
                </div>
                <p className="mt-2 text-[14px] text-ink-900">
                  <span className="text-ink-500">Sebep:</span>{" "}
                  <span className="font-medium">{r.reason}</span>
                </p>
                <p className="mt-1 text-[13px] text-ink-500">
                  Raporlayan:{" "}
                  <span className="text-ink-900">
                    {r.reportedBy.fullName}
                  </span>{" "}
                  ({r.reportedBy.email})
                </p>
              </div>

              <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                {r.status === "open" ? (
                  <button
                    type="button"
                    onClick={() => resolve(r)}
                    disabled={busyId === r.id}
                    className="btn-ink h-9 px-3.5 rounded-full text-[13px] disabled:opacity-50"
                  >
                    Çözüldü işaretle
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => reopen(r)}
                    disabled={busyId === r.id}
                    className="inline-flex items-center h-9 px-3.5 rounded-full border border-ink-200 text-[13px] font-medium text-ink-900 hover:border-ink-900 transition disabled:opacity-50"
                  >
                    Tekrar aç
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(r)}
                  disabled={busyId === r.id}
                  className="inline-flex items-center h-9 px-3.5 rounded-full border border-red-200 text-[13px] font-medium text-red-700 hover:bg-red-50 transition disabled:opacity-50"
                >
                  Sil
                </button>
              </div>
            </div>

            {r.message ? (
              <div className="mt-4 rounded-[12px] border border-ink-100 bg-ink-50/60 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-500">
                    Raporlanan mesaj
                  </p>
                  {!r.message.sender.isActive && (
                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full bg-red-100 text-red-700 text-[11px] font-medium">
                      Gönderici pasif
                    </span>
                  )}
                  {r.message.sender.openReportCount > 1 && (
                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full bg-warn-500/10 text-warn-500 border border-warn-500/30 text-[11px] font-medium">
                      Bu kişiye karşı {r.message.sender.openReportCount} açık
                      rapor
                    </span>
                  )}
                </div>
                <p className="text-[13.5px] text-ink-500">
                  <span className="text-ink-900 font-medium">
                    {r.message.sender.fullName}
                  </span>{" "}
                  ({r.message.sender.email}) →{" "}
                  <span className="text-ink-900 font-medium">
                    {r.message.recipient.fullName}
                  </span>{" "}
                  ·{" "}
                  <span className="font-mono">
                    {new Date(r.message.createdAt).toLocaleString("tr-TR")}
                  </span>
                </p>
                <p className="mt-2 text-[14px] text-ink-900 whitespace-pre-wrap break-words">
                  {r.message.content}
                </p>

                <div className="mt-4 flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      setWarnTarget({
                        userId: r.message!.sender.id,
                        name: r.message!.sender.fullName,
                      })
                    }
                    disabled={busyId === r.id}
                    className="inline-flex items-center h-8 px-3 rounded-full border border-warn-500/40 text-[12.5px] font-medium text-warn-500 hover:bg-warn-500/10 transition disabled:opacity-50"
                  >
                    Göndericiyi uyar (mail)
                  </button>
                  {r.message.sender.isActive ? (
                    <button
                      type="button"
                      onClick={() => toggleActive(r, false)}
                      disabled={busyId === r.id}
                      className="inline-flex items-center h-8 px-3 rounded-full border border-red-200 text-[12.5px] font-medium text-red-700 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      Hesabı pasifleştir
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleActive(r, true)}
                      disabled={busyId === r.id}
                      className="inline-flex items-center h-8 px-3 rounded-full border border-ink-200 text-[12.5px] font-medium text-ink-700 hover:border-ink-900 transition disabled:opacity-50"
                    >
                      Hesabı tekrar aktif et
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-[13px] text-ink-400 italic">
                Mesaj silinmiş.
              </p>
            )}

            {r.status === "resolved" && r.resolvedNote && (
              <p className="mt-3 text-[13px] text-ink-500">
                <span className="font-medium text-ink-700">Çözüm notu:</span>{" "}
                {r.resolvedNote}
              </p>
            )}
          </li>
        ))}
      </ul>

      {warnTarget && (
        <WarnModal
          target={warnTarget}
          onClose={() => setWarnTarget(null)}
          onError={(msg) => setError(msg)}
          onDone={() => {
            setWarnTarget(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function WarnModal({
  target,
  onClose,
  onError,
  onDone,
}: {
  target: { userId: string; name: string };
  onClose: () => void;
  onError: (msg: string) => void;
  onDone: () => void;
}) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    const trimmed = note.trim();
    if (trimmed.length < 10) {
      onError("Uyarı en az 10 karakter olmalı.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/admin/users/${target.userId}/warn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        onError(data.error || "Uyarı gönderilemedi.");
        return;
      }
      onDone();
    } catch {
      onError("Bağlantı hatası.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4">
      <div className="w-full max-w-md rounded-[14px] bg-white p-5 shadow-lg">
        <h3 className="text-[16px] font-semibold text-ink-900">
          {target.name} için uyarı
        </h3>
        <p className="mt-1 text-[13px] text-ink-500">
          Kullanıcının kayıtlı e-posta adresine gönderilir.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Uyarı metni — kullanıcı bunu okuyacak."
          rows={5}
          className="mt-3 w-full p-3 border border-ink-200 rounded-[10px] text-[14px] resize-none focus:border-ink-900 outline-none"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="inline-flex items-center h-9 px-4 rounded-full border border-ink-200 text-[13px] font-medium text-ink-700 hover:border-ink-900 transition disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={send}
            disabled={sending || note.trim().length < 10}
            className="btn-ink h-9 px-4 rounded-full text-[13px] disabled:opacity-50"
          >
            {sending ? "Gönderiliyor..." : "Gönder"}
          </button>
        </div>
      </div>
    </div>
  );
}
