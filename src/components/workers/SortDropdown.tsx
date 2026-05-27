"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const SORT_OPTIONS = [
  { id: "newest", label: "Yeniden eskiye" },
  { id: "rating", label: "Puana göre" },
  { id: "near", label: "Yakına göre" },
];

export default function SortDropdown() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const current = params.get("siralama") ?? "newest";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString());
    if (e.target.value && e.target.value !== "newest")
      next.set("siralama", e.target.value);
    else next.delete("siralama");
    startTransition(() => {
      router.push(`/cevrendekiler${next.toString() ? `?${next}` : ""}`);
    });
  }

  return (
    <label className="inline-flex items-center gap-1.5 cursor-pointer">
      <span className="text-[13.5px] text-ink-500">Sırala:</span>
      <select
        value={current}
        onChange={onChange}
        aria-label="Sıralama"
        className="!h-auto !w-auto !p-0 !border-0 !bg-transparent !text-[13.5px] !text-ink-900 font-medium cursor-pointer focus:!shadow-none appearance-none pr-4"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%239a9a92' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          backgroundSize: "10px 10px",
        }}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
