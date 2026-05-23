"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";

type Profession = { slug: string; name: string; count: number };

export default function WorkerFilters({
  professions,
  total,
}: {
  professions: Profession[];
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = {
    meslek: params.get("meslek") ?? "",
    mahalle: params.get("mahalle") ?? "",
    q: params.get("q") ?? "",
  };

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    // Fire-and-forget analytics log for non-empty filter actions
    if (value) {
      const payload: Record<string, string> = {};
      if (key === "q") payload.query = value;
      if (key === "meslek") payload.professionSlug = value;
      if (key === "mahalle") payload.neighborhood = value;
      fetch("/api/search/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
    startTransition(() => {
      router.push(`/iscilar${next.toString() ? `?${next}` : ""}`);
    });
  }

  function reset() {
    startTransition(() => {
      router.push("/iscilar");
    });
  }

  const hasFilter = current.meslek || current.mahalle || current.q;

  const activeFilterCount =
    (current.meslek ? 1 : 0) + (current.mahalle ? 1 : 0) + (current.q ? 1 : 0);

  return (
    <div>
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden w-full flex items-center justify-between h-12 px-4 rounded-[12px] border border-ink-200 bg-white text-[14.5px] font-medium text-ink-900 mb-4"
      >
        <span className="inline-flex items-center gap-2">
          <FilterIcon /> Filtrele
          {activeFilterCount > 0 && (
            <span
              className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-accent-600 text-[11px] font-semibold"
              style={{ color: "#ffffff" }}
            >
              {activeFilterCount}
            </span>
          )}
        </span>
        <span className={`transition ${mobileOpen ? "rotate-180" : ""}`}>
          <ChevronIcon />
        </span>
      </button>

      <div className={`${mobileOpen ? "block" : "hidden"} lg:block`}>
      <p className="hidden lg:block font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium mb-4">
        Filtrele
      </p>

      <SearchField
        defaultValue={current.q}
        onSubmit={(v) => updateParam("q", v)}
      />

      <div className="mt-6">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium mb-3">
          Meslekler
        </p>
        <div className="flex flex-col">
          <CategoryRow
            label="Tüm meslekler"
            count={total}
            active={!current.meslek}
            onClick={() => updateParam("meslek", "")}
          />
          {professions.map((p) => (
            <CategoryRow
              key={p.slug}
              label={p.name}
              count={p.count}
              active={current.meslek === p.slug}
              onClick={() => updateParam("meslek", p.slug)}
            />
          ))}
        </div>
      </div>

      <div className="mt-7 pt-7 border-t border-ink-100">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium mb-3">
          Mahalle
        </p>
        <select
          value={current.mahalle}
          onChange={(e) => updateParam("mahalle", e.target.value)}
          className="w-full h-11 px-3.5 rounded-[12px] border border-ink-200 bg-white text-[14px] text-ink-900 outline-none transition focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
        >
          <option value="">Tüm mahalleler</option>
          {PENDIK_NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {(hasFilter || isPending) && (
        <button
          type="button"
          onClick={reset}
          className="mt-6 text-[13px] text-ink-500 hover:text-ink-900 transition"
        >
          {isPending ? "Yükleniyor…" : "Filtreleri temizle"}
        </button>
      )}
      </div>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18M6 12h12M10 18h4" />
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CategoryRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left ${
        active
          ? "bg-ink-900/[0.04] text-ink-900 font-medium"
          : "text-ink-700 hover:bg-ink-900/[0.02]"
      }`}
    >
      <span className="text-[14.5px] tracking-tight">{label}</span>
      <span className="font-mono text-[12.5px] text-ink-400">{count}</span>
    </button>
  );
}

function SearchField({
  defaultValue,
  onSubmit,
}: {
  defaultValue: string;
  onSubmit: (v: string) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit((fd.get("q") as string) ?? "");
      }}
    >
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
          <svg
            width="16"
            height="16"
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
        </span>
        <input
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="İsim, tanıtım…"
          className="w-full h-11 pl-10 pr-3 rounded-[12px] border border-ink-200 bg-white text-[14px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
        />
      </div>
    </form>
  );
}
