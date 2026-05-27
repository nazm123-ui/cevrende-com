"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";
import Icon from "@/components/ui/Icon";

const DISTRICTS = ["Tümü", "Pendik", "Tuzla", "Kartal"];

export default function TopFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const current = {
    q: params.get("q") ?? "",
    ilce: params.get("ilce") ?? "Tümü",
    mahalle: params.get("mahalle") ?? "",
  };

  function submit(formData: FormData) {
    const next = new URLSearchParams(params.toString());
    const q = (formData.get("q") as string)?.trim() || "";
    const ilce = (formData.get("ilce") as string) || "Tümü";
    const mahalle = (formData.get("mahalle") as string) || "";

    if (q) next.set("q", q);
    else next.delete("q");
    if (ilce && ilce !== "Tümü") next.set("ilce", ilce);
    else next.delete("ilce");
    if (mahalle) next.set("mahalle", mahalle);
    else next.delete("mahalle");

    startTransition(() => {
      router.push(`/cevrendekiler${next.toString() ? `?${next}` : ""}`);
    });
  }

  return (
    <form
      action={submit}
      className="bg-white border border-ink-100 rounded-[14px] p-3 sm:p-3.5 grid gap-2 sm:gap-2.5 grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center"
    >
      {/* Arama input */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none flex items-center">
          <Icon name="search" size={18} />
        </span>
        <input
          name="q"
          type="search"
          defaultValue={current.q}
          placeholder="İsim, yetkinlik, pozisyon…"
          aria-label="İsim, yetkinlik veya pozisyon ara"
          className="!h-11 !pl-10 !border-0 !bg-ink-50 focus:!bg-white"
        />
      </div>

      {/* İlçe */}
      <div className="relative">
        <select
          name="ilce"
          defaultValue={current.ilce}
          aria-label="İlçe seç"
          className="!h-11 !border-0 !bg-ink-50 !pl-3.5 !pr-9 appearance-none focus:!bg-white"
        >
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>

      {/* Mahalle */}
      <div className="relative">
        <select
          name="mahalle"
          defaultValue={current.mahalle}
          aria-label="Mahalle seç"
          className="!h-11 !border-0 !bg-ink-50 !pl-3.5 !pr-9 appearance-none focus:!bg-white"
        >
          <option value="">Tüm mahalleler</option>
          {PENDIK_NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>

      {/* Filtrele button */}
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full bg-accent-600 text-white text-[14px] font-medium border-0 hover:bg-accent-700 transition whitespace-nowrap"
      >
        <Icon name="filter" size={14} /> Filtrele
      </button>
    </form>
  );
}

function ChevronIcon() {
  return (
    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}
