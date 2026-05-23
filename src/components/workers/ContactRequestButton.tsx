"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  workerId: string;
};

export default function ContactRequestButton({ workerId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toWorkerId: workerId, message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Talep gönderilemedi.");
        return;
      }
      setOpen(false);
      setMessage("");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
      >
        ✉️ Teklif Gönder
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-ink-900">
          İletişim Talebi
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          Hangi iş için iletişime geçmek istediğini kısaca yaz. Karşı taraf
          onaylarsa mesajlaşma açılır.
        </p>

        <label className="mt-4 block text-xs font-medium text-ink-700">
          Kısa not (opsiyonel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Örn: Pendik'te bir dairenin boyası için ekibinize ihtiyacım var..."
          className="mt-1 w-full resize-none rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-1 text-right text-[10px] text-ink-500">
          {message.length}/500
        </p>

        {error && (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={sending}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:bg-ink-200 disabled:cursor-not-allowed"
          >
            {sending ? "Gönderiliyor..." : "Talep Gönder"}
          </button>
        </div>
      </form>
    </div>
  );
}
