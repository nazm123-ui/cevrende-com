"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Variant = "ghost" | "primary" | "danger";

export function JobAction({
  jobId,
  action,
  label,
  loadingLabel,
  variant = "ghost",
  confirm,
}: {
  jobId: string;
  action: "extend" | "passivate" | "activate" | "delete";
  label: string;
  loadingLabel?: string;
  variant?: Variant;
  confirm?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (confirm && !window.confirm(confirm)) return;
    setError(null);
    setLoading(true);
    try {
      const url =
        action === "delete"
          ? `/api/jobs/${jobId}`
          : `/api/jobs/${jobId}/${action}`;
      const method = action === "delete" ? "DELETE" : "POST";

      const res = await fetch(url, { method });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "İşlem başarısız.");
        return;
      }
      router.refresh();
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={btnCls(variant)}
      >
        {loading ? (loadingLabel ?? "...") : label}
      </button>
      {error && <span className="text-xs text-red-600 ml-2">{error}</span>}
    </>
  );
}

function btnCls(variant: Variant): string {
  const base =
    "rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  switch (variant) {
    case "primary":
      return `${base} bg-brand-600 text-white hover:bg-brand-700`;
    case "danger":
      return `${base} border border-red-200 bg-white text-red-700 hover:bg-red-50`;
    default:
      return `${base} border border-ink-200 bg-white text-ink-700 hover:bg-ink-50`;
  }
}
