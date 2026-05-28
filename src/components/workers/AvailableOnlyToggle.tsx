"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function AvailableOnlyToggle() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const checked = params.get("musait") === "1";

  function toggle() {
    const next = new URLSearchParams(params.toString());
    if (checked) next.delete("musait");
    else next.set("musait", "1");
    startTransition(() => {
      router.push(`/cevrendekiler${next.toString() ? `?${next}` : ""}`);
    });
  }

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[13.5px] text-ink-700 hover:text-ink-900 transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={toggle}
        className="w-4 h-4 accent-emerald-600 cursor-pointer"
      />
      Sadece müsait olanlar
    </label>
  );
}
