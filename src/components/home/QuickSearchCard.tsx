"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";

type Profession = { slug: string; name: string; count: number };

type Props = {
  popular: Profession[];
  totalCount: number;
};

export default function QuickSearchCard({ popular, totalCount }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mahalle, setMahalle] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (mahalle) params.set("mahalle", mahalle);
    const qs = params.toString();
    router.push(`/iscilar${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="bg-white border border-ink-100 rounded-[14px] shadow-[0_8px_24px_-12px_rgba(15,17,16,0.10)] p-7">
      <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
        Hızlı arama
      </p>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Meslek, anahtar kelime…"
            className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-ink-200 bg-white text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
          />
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">
            <PinIcon />
          </span>
          <select
            value={mahalle}
            onChange={(e) => setMahalle(e.target.value)}
            className="w-full h-12 pl-11 pr-10 rounded-[12px] border border-ink-200 bg-white text-[15px] text-ink-900 outline-none transition appearance-none focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
          >
            <option value="">Tüm mahalleler</option>
            {PENDIK_NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
            <ChevronIcon />
          </span>
        </div>

        <button
          type="submit"
          className="h-12 rounded-[12px] bg-accent-600 text-white text-[15px] font-medium hover:bg-accent-700 transition"
        >
          Çevrendekileri ara
        </button>
      </form>

      {popular.length > 0 && (
        <>
          <div className="mt-6 border-t border-ink-100" />
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[13.5px] text-ink-500">Popüler</span>
            <span className="font-mono text-[12.5px] text-ink-400">
              {totalCount} kişi
            </span>
          </div>
          <div className="scroll-x mt-3">
            {popular.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() =>
                  router.push(`/iscilar?meslek=${encodeURIComponent(p.slug)}`)
                }
                className="shrink-0 inline-flex items-center h-10 px-4 rounded-full border border-ink-200 bg-white text-[14px] text-ink-700 hover:border-ink-900 hover:text-ink-900 transition"
              >
                {p.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
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
  );
}
