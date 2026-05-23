"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  requestId: string;
};

export default function IncomingRequestActions({ requestId }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<"accepted" | "declined" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function respond(decision: "accepted" | "declined") {
    setBusy(decision);
    setError(null);
    try {
      const res = await fetch(`/api/contact-requests/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "İşlem başarısız.");
        return;
      }
      router.refresh();
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {error && <p className="text-xs text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => respond("declined")}
          disabled={busy !== null}
          className="inline-flex items-center h-9 px-4 rounded-full border border-ink-200 text-[13px] font-medium text-ink-700 hover:border-ink-900 transition disabled:opacity-50"
        >
          {busy === "declined" ? "..." : "Reddet"}
        </button>
        <button
          type="button"
          onClick={() => respond("accepted")}
          disabled={busy !== null}
          className="btn-ink h-9 px-4 rounded-full text-[13px] disabled:opacity-50"
        >
          {busy === "accepted" ? "..." : "✓ Kabul Et"}
        </button>
      </div>
    </div>
  );
}
