"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Icon from "@/components/ui/Icon";
import { normalizeTr } from "@/components/forms/ProfessionAutocomplete";

type DistrictOption = {
  slug: string;
  name: string;
  neighborhoods: string[];
};

type Category = { slug: string; name: string };

type Props = {
  districts: DistrictOption[];
  categories: Category[];
};

export default function TopFilterBar({ districts, categories }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const multi = districts.length > 1;
  const single = !multi ? districts[0] : null;

  const [q, setQ] = useState(params.get("q") ?? "");
  const [ilce, setIlce] = useState(params.get("ilce") ?? "");
  const [mahalle, setMahalle] = useState(params.get("mahalle") ?? "");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  // -1: hiçbiri seçili değil → Enter serbest metin (bio dahil) araması yapar.
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeDistrict = useMemo(() => {
    if (single) return single;
    return districts.find((d) => d.slug === ilce) ?? null;
  }, [districts, single, ilce]);

  const mahalleOptions = activeDistrict?.neighborhoods ?? [];

  const suggestions = useMemo(() => {
    const query = q.trim();
    if (!query) return [];
    const nq = normalizeTr(query);
    return categories
      .filter((c) => normalizeTr(c.name).includes(nq))
      .slice(0, 6);
  }, [q, categories]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => setHighlightIdx(-1), [q]);

  function pushParams(next: URLSearchParams) {
    startTransition(() => {
      router.push(`/cevrendekiler${next.toString() ? `?${next}` : ""}`);
    });
  }

  function goToCategory(slug: string) {
    const next = new URLSearchParams(params.toString());
    next.set("meslek", slug);
    next.delete("q");
    if (ilce) next.set("ilce", ilce);
    else next.delete("ilce");
    if (mahalle) next.set("mahalle", mahalle);
    else next.delete("mahalle");
    setSuggestionsOpen(false);
    pushParams(next);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Yalnızca kullanıcı bir öneriyi bilerek seçtiyse kategoriye git;
    // aksi halde serbest metin araması yap (bio dahil tüm metni tarar).
    if (suggestionsOpen && highlightIdx >= 0 && suggestions[highlightIdx]) {
      goToCategory(suggestions[highlightIdx].slug);
      return;
    }
    const next = new URLSearchParams(params.toString());
    const query = q.trim();
    if (query) {
      next.set("q", query);
      // Serbest metin araması kategoriden bağımsız olsun: takılı kalan
      // kategori filtresini temizle ki kişi hangi kategoride olursa olsun bulunsun.
      next.delete("meslek");
    } else {
      next.delete("q");
    }
    if (ilce) next.set("ilce", ilce);
    else next.delete("ilce");
    if (mahalle) next.set("mahalle", mahalle);
    else next.delete("mahalle");
    setSuggestionsOpen(false);
    pushParams(next);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestionsOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
    }
  }

  // Grid: multi-ilçede 4 sütun (q, ilçe, mahalle, btn); tekli ilçede 3 sütun
  const gridCls = multi
    ? "sm:grid-cols-[1.5fr_0.9fr_0.9fr_auto]"
    : "sm:grid-cols-[1.6fr_1fr_auto]";

  return (
    <form
      onSubmit={submit}
      className={`bg-white border border-ink-100 rounded-[14px] p-3 sm:p-3.5 grid gap-2 sm:gap-2.5 grid-cols-1 ${gridCls} sm:items-center`}
      autoComplete="off"
    >
      {/* Arama input */}
      <div className="relative" ref={wrapperRef}>
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none flex items-center">
          <Icon name="search" size={18} />
        </span>
        <input
          name="q"
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSuggestionsOpen(true);
          }}
          onFocus={() => q && setSuggestionsOpen(true)}
          onKeyDown={onInputKeyDown}
          placeholder="İsim, hizmet, meslek…"
          aria-label="İsim, hizmet veya meslek ara"
          role="combobox"
          aria-expanded={suggestionsOpen && suggestions.length > 0}
          aria-autocomplete="list"
          aria-controls="topbar-suggestions"
          className="!h-11 !pl-10 !border-0 !bg-ink-50 focus:!bg-white"
        />
        {suggestionsOpen && suggestions.length > 0 && (
          <ul
            id="topbar-suggestions"
            role="listbox"
            className="absolute z-30 left-0 right-0 top-full mt-2 rounded-[12px] border border-ink-100 bg-white shadow-[0_12px_28px_-12px_rgba(15,17,16,0.18)] overflow-hidden"
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
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* İlçe (sadece 2+ ilçe aktifse) */}
      {multi && (
        <div className="relative">
          <select
            name="ilce"
            value={ilce}
            onChange={(e) => {
              setIlce(e.target.value);
              setMahalle("");
            }}
            aria-label="İlçe seç"
            className="!h-11 !border-0 !bg-ink-50 !pl-3.5 !pr-9 appearance-none focus:!bg-white"
          >
            <option value="">Tüm ilçeler</option>
            {districts.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      )}

      {/* Mahalle */}
      <div className="relative">
        <select
          name="mahalle"
          value={mahalle}
          onChange={(e) => setMahalle(e.target.value)}
          aria-label="Mahalle seç"
          className="!h-11 !border-0 !bg-ink-50 !pl-3.5 !pr-9 appearance-none focus:!bg-white"
        >
          <option value="">Tüm mahalleler</option>
          {multi && !activeDistrict
            ? null
            : mahalleOptions.map((n) => (
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
