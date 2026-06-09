"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeTr } from "@/lib/normalize-tr";

export type Category = { slug: string; name: string };

// Geriye dönük uyumluluk: bazı bileşenler normalizeTr'i buradan import ediyor.
export { normalizeTr };

const inputCls =
  "block w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/5";

type Props = {
  categories: Category[];
  selected: string[];
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
  /**
   * "Mesleğim listede yok → bize öner" akışını göster. Bu akış
   * /api/category-suggestions'a POST atar ve giriş yapmış kullanıcı gerektirir;
   * kayıt ekranı gibi giriş yapılmamış yerlerde false geçilmeli.
   */
  allowSuggest?: boolean;
};

export default function ProfessionAutocomplete({
  categories,
  selected,
  onAdd,
  onRemove,
  allowSuggest = true,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // "Mesleğim listede yok" öneri akışı (yalnızca allowSuggest)
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestName, setSuggestName] = useState("");
  const [suggestNote, setSuggestNote] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestErr, setSuggestErr] = useState<string | null>(null);
  const [suggestDone, setSuggestDone] = useState(false);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const hasDiger = selectedSet.has("diger");
  const hasDigerCategory = categories.some((c) => c.slug === "diger");

  const suggestions = useMemo(() => {
    const q = query.trim();
    const available = categories.filter((c) => !selectedSet.has(c.slug));
    if (!q) return available.slice(0, 6);
    const nq = normalizeTr(q);
    return available
      .filter((c) => normalizeTr(c.name).includes(nq))
      .slice(0, 6);
  }, [query, categories, selectedSet]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => setHighlight(0), [query]);

  const selectedNames = selected.map(
    (slug) => categories.find((c) => c.slug === slug)?.name ?? slug,
  );

  const atMax = selected.length >= 5;

  function pick(slug: string) {
    onAdd(slug);
    setQuery("");
    setOpen(false);
  }

  function openSuggest() {
    setSuggestName(query.trim());
    setSuggestNote("");
    setSuggestErr(null);
    setSuggestDone(false);
    setSuggestOpen(true);
    setOpen(false);
  }

  async function submitSuggest() {
    const name = suggestName.trim();
    if (name.length < 2) {
      setSuggestErr("Meslek adı en az 2 karakter olmalı.");
      return;
    }
    setSuggestLoading(true);
    setSuggestErr(null);
    try {
      const res = await fetch("/api/category-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestedName: name,
          note: suggestNote.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSuggestErr(data.error || "Öneri gönderilemedi.");
        return;
      }
      setSuggestDone(true);
      setQuery("");
    } catch {
      setSuggestErr("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setSuggestLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(suggestions.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter" && suggestions[highlight]) {
      e.preventDefault();
      pick(suggestions[highlight].slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative" ref={wrapperRef}>
        <input
          type="text"
          value={query}
          disabled={atMax}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={
            atMax
              ? "Maksimum 5 meslek seçildi."
              : "Meslek ara (örn: tesisat, temizlik, boyacı)…"
          }
          className={inputCls}
        />
        {open && !atMax && suggestions.length > 0 && (
          <ul className="absolute z-20 left-0 right-0 top-full mt-2 rounded-[12px] border border-ink-100 bg-white shadow-[0_12px_28px_-12px_rgba(15,17,16,0.18)] overflow-hidden">
            {suggestions.map((s, i) => (
              <li key={s.slug}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => pick(s.slug)}
                  className={`w-full text-left px-4 py-2 text-[14px] transition ${
                    i === highlight
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

        {open && !atMax && query.trim().length >= 2 && suggestions.length === 0 && (
          <div className="absolute z-20 left-0 right-0 top-full mt-2 rounded-[12px] border border-ink-100 bg-white shadow-[0_12px_28px_-12px_rgba(15,17,16,0.18)] p-3">
            <p className="text-[13px] text-ink-700">
              <span className="font-medium">&ldquo;{query.trim()}&rdquo;</span> listede yok.
            </p>
            {allowSuggest ? (
              <>
                <button
                  type="button"
                  onClick={openSuggest}
                  className="mt-2 w-full btn-ink h-10 rounded-lg text-[14px]"
                >
                  Bu mesleği bize öner
                </button>
                <p className="mt-2 text-[12px] text-ink-500 leading-relaxed">
                  İncelendikten sonra kategoriye ekleyeceğiz ve sana haber vereceğiz.
                </p>
              </>
            ) : (
              <>
                {hasDigerCategory && !hasDiger && (
                  <button
                    type="button"
                    onClick={() => pick("diger")}
                    className="mt-2 w-full btn-ink h-10 rounded-lg text-[14px]"
                  >
                    &ldquo;Diğer&rdquo;i seç
                  </button>
                )}
                <p className="mt-2 text-[12px] text-ink-500 leading-relaxed">
                  Şimdilik &ldquo;Diğer&rdquo;i seçebilirsin. Kayıt olduktan sonra
                  profilinden mesleğini bize önerebilirsin.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {allowSuggest && suggestOpen && !suggestDone && (
        <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-3 space-y-2.5">
          <p className="text-[13px] font-medium text-ink-900">Meslek öner</p>
          <input
            type="text"
            value={suggestName}
            onChange={(e) => setSuggestName(e.target.value)}
            placeholder="Meslek adı (örn. Doğalgaz Tesisatçısı)"
            maxLength={60}
            className={inputCls}
          />
          <textarea
            value={suggestNote}
            onChange={(e) => setSuggestNote(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder="İstersen kısaca ne iş yaptığını yaz (opsiyonel)"
            className={inputCls}
          />
          {suggestErr && <p className="text-xs text-red-600">{suggestErr}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSuggestOpen(false)}
              className="h-9 rounded-full border border-ink-200 px-4 text-sm text-ink-700 hover:border-ink-900 transition"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={submitSuggest}
              disabled={suggestLoading}
              className="btn-ink h-9 px-4 rounded-full text-sm"
            >
              {suggestLoading ? "Gönderiliyor..." : "Gönder"}
            </button>
          </div>
        </div>
      )}

      {allowSuggest && suggestDone && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 space-y-2.5">
          <p className="text-[13px] font-medium text-green-800">
            Önerini aldık ✓
          </p>
          <p className="text-[12.5px] text-green-700 leading-relaxed">
            Meslek incelenip eklenince sana mesaj ve e-posta ile haber vereceğiz.
            Bu sırada profilini yayında tutmak için &ldquo;Diğer&rdquo; kategorisini
            ekleyebilirsin — meslek eklenince güncelleriz.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {!hasDiger && hasDigerCategory && (
              <button
                type="button"
                onClick={() => {
                  onAdd("diger");
                  setSuggestDone(false);
                  setSuggestOpen(false);
                }}
                className="h-9 rounded-full border border-ink-300 px-4 text-sm text-ink-800 hover:border-ink-900 transition"
              >
                &ldquo;Diğer&rdquo;i ekle
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSuggestDone(false);
                setSuggestOpen(false);
              }}
              className="btn-ink h-9 px-4 rounded-full text-sm"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedNames.map((name, i) => (
            <span
              key={selected[i]}
              className="inline-flex items-center gap-1.5 h-8 pl-3 pr-1.5 rounded-full bg-ink-900 text-white text-[13px]"
            >
              {name}
              <button
                type="button"
                onClick={() => onRemove(selected[i])}
                aria-label={`${name} kaldır`}
                className="inline-flex items-center justify-center h-6 w-6 rounded-full hover:bg-white/15 transition"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
