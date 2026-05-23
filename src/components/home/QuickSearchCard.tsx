"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";

type Profession = { slug: string; name: string; count: number };
type Category = { slug: string; name: string };

type Props = {
  popular: Profession[];
  totalCount: number;
  allCategories: Category[];
};

function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

export default function QuickSearchCard({
  popular,
  totalCount,
  allCategories,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mahalle, setMahalle] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const nq = normalize(q);
    return allCategories
      .filter((c) => normalize(c.name).includes(nq))
      .slice(0, 6);
  }, [query, allCategories]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setHighlightIdx(0);
  }, [query]);

  function goToCategory(slug: string) {
    const params = new URLSearchParams();
    params.set("meslek", slug);
    if (mahalle) params.set("mahalle", mahalle);
    fetch("/api/search/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        professionSlug: slug,
        neighborhood: mahalle || null,
      }),
      keepalive: true,
    }).catch(() => {});
    router.push(`/iscilar?${params.toString()}`);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (suggestionsOpen && suggestions[highlightIdx]) {
      goToCategory(suggestions[highlightIdx].slug);
      return;
    }
    const params = new URLSearchParams();
    const q = query.trim();
    if (q) params.set("q", q);
    if (mahalle) params.set("mahalle", mahalle);
    if (q || mahalle) {
      fetch("/api/search/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q || null, neighborhood: mahalle || null }),
        keepalive: true,
      }).catch(() => {});
    }
    const qs = params.toString();
    router.push(`/iscilar${qs ? `?${qs}` : ""}`);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestionsOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx(
        (i) => (i - 1 + suggestions.length) % suggestions.length,
      );
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
    }
  }

  return (
    <div className="bg-white border border-ink-100 rounded-[14px] shadow-[0_8px_24px_-12px_rgba(15,17,16,0.10)] p-5 sm:p-7">
      <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
        Hızlı arama
      </p>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-3" autoComplete="off">
        <div className="relative" ref={wrapperRef}>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSuggestionsOpen(true);
            }}
            onFocus={() => query && setSuggestionsOpen(true)}
            onKeyDown={onInputKeyDown}
            placeholder="Meslek, anahtar kelime…"
            role="combobox"
            aria-expanded={suggestionsOpen && suggestions.length > 0}
            aria-autocomplete="list"
            aria-controls="qs-suggestions"
            className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-ink-200 bg-white text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
          />
          {suggestionsOpen && suggestions.length > 0 && (
            <ul
              id="qs-suggestions"
              role="listbox"
              className="absolute z-20 left-0 right-0 top-full mt-2 rounded-[12px] border border-ink-100 bg-white shadow-[0_12px_28px_-12px_rgba(15,17,16,0.18)] overflow-hidden"
            >
              {suggestions.map((s, i) => (
                <li key={s.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === highlightIdx}
                    onMouseEnter={() => setHighlightIdx(i)}
                    onClick={() => goToCategory(s.slug)}
                    className={`w-full text-left px-4 py-2.5 text-[14.5px] transition ${
                      i === highlightIdx
                        ? "bg-ink-900/[0.04] text-ink-900"
                        : "text-ink-700 hover:bg-ink-900/[0.02]"
                    }`}
                  >
                    {highlightMatch(s.name, query)}
                  </button>
                </li>
              ))}
            </ul>
          )}
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
                onClick={() => {
                  fetch("/api/search/log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ professionSlug: p.slug }),
                    keepalive: true,
                  }).catch(() => {});
                  router.push(`/iscilar?meslek=${encodeURIComponent(p.slug)}`);
                }}
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

function highlightMatch(name: string, query: string) {
  const q = query.trim();
  if (!q) return name;
  const nq = normalize(q);
  const nn = normalize(name);
  const idx = nn.indexOf(nq);
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <span className="font-semibold text-ink-900">
        {name.slice(idx, idx + q.length)}
      </span>
      {name.slice(idx + q.length)}
    </>
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
