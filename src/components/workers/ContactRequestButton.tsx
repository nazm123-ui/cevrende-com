"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  workerId: string;
  variant?: "primary" | "outline";
  label?: string;
};

export default function ContactRequestButton({
  workerId,
  variant = "primary",
  label = "İletişim talebi gönder",
}: Props) {
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
    const className =
      variant === "outline"
        ? "inline-flex items-center h-9 px-4 rounded-full border border-ink-200 text-[13px] font-medium text-ink-900 hover:border-ink-900 transition"
        : "btn-ink h-9 px-4 rounded-full text-[13px]";
    return (
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-[2px] p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[18px] bg-white border border-ink-100 p-8 shadow-[0_30px_80px_-20px_rgba(15,17,16,0.3)]"
      >
        <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 mb-2">
          Aramıza katıl
        </p>
        <h3 className="text-[22px] font-semibold tracking-[-0.012em] text-ink-900">
          İletişim talebi
        </h3>
        <p className="mt-2 text-[14px] text-ink-500">
          Hangi iş için iletişime geçmek istediğini kısaca yaz. Karşı taraf
          onaylarsa mesajlaşma açılır.
        </p>

        <label className="mt-5 block text-[13px] font-medium text-ink-700 mb-2">
          Kısa not (opsiyonel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Örn: Pendik'te bir dairenin boyası için ekibinize ihtiyacım var…"
          className="w-full resize-none rounded-[12px] border border-ink-200 bg-white px-3.5 py-3 text-[14px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
        />
        <p className="mt-1 text-right font-mono text-[11px] text-ink-400">
          {message.length}/500
        </p>

        {error && (
          <p className="mt-3 rounded-[10px] bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            className="inline-flex items-center h-10 px-4 rounded-full border border-ink-200 text-[13.5px] font-medium text-ink-700 hover:border-ink-700 transition"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={sending}
            className="btn-ink h-10 px-5 rounded-full text-[13.5px]"
          >
            {sending ? "Gönderiliyor..." : "Talebi gönder"}
          </button>
        </div>
      </form>
    </div>
  );
}
