"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PhoneVisibility } from "@/lib/phone-visibility";
import type { Experience } from "@/lib/experience";
import { formatYearRange } from "@/lib/experience";

type Category = { slug: string; name: string };

export type ProfileFormInitial = {
  professions: string[];
  bio: string;
  showDistrict: boolean;
  phoneVisibility: PhoneVisibility;
  experiences: Experience[];
};

const CURRENT_YEAR = new Date().getFullYear();
const MAX_EXPERIENCES = 10;
const BIO_MIN = 30;
const BIO_MAX = 500;

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

type Props = {
  categories: Category[];
  initial: ProfileFormInitial;
  onSaved?: () => void;
};

export default function ProfileForm({ categories, initial, onSaved }: Props) {
  const router = useRouter();
  const [state, setState] = useState<ProfileFormInitial>(initial);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [loading, setLoading] = useState(false);

  function set<K extends keyof ProfileFormInitial>(
    key: K,
    value: ProfileFormInitial[K],
  ) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function addProfession(slug: string) {
    setState((s) =>
      s.professions.includes(slug) || s.professions.length >= 5
        ? s
        : { ...s, professions: [...s.professions, slug] },
    );
  }

  function removeProfession(slug: string) {
    setState((s) => ({
      ...s,
      professions: s.professions.filter((p) => p !== slug),
    }));
  }

  const bioLen = state.bio.trim().length;
  const bioValid = bioLen >= BIO_MIN;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    if (state.professions.length === 0) {
      setFieldErrors({ professions: ["En az bir meslek seç."] });
      return;
    }
    if (!bioValid) {
      setFieldErrors({ bio: [`Hakkımda en az ${BIO_MIN} karakter olmalı.`] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kaydedilemedi.");
        if (data.issues) setFieldErrors(data.issues);
        return;
      }
      setSuccess("Profil ayarların kaydedildi.");
      router.refresh();
      onSaved?.();
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section
        title="Meslekler"
        hint={`İlgili mesleği yazıp listeden seç. En fazla 5 meslek. Seçili: ${state.professions.length}/5`}
      >
        {fieldErrors.professions && (
          <p className="text-xs text-red-600">{fieldErrors.professions[0]}</p>
        )}
        <ProfessionAutocomplete
          categories={categories}
          selected={state.professions}
          onAdd={addProfession}
          onRemove={removeProfession}
        />
      </Section>

      <Section
        title="Hakkımda"
        hint="Zorunlu. Kendinden, deneyiminden ve çalışma saatlerinden kısaca bahset."
      >
        <textarea
          value={state.bio}
          onChange={(e) => set("bio", e.target.value)}
          rows={5}
          maxLength={BIO_MAX}
          className={inputCls}
          placeholder="Örn: 5 yıldır Pendik'te tesisat işleri yapıyorum. Akşam ve hafta sonu da çalışabilirim."
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span
            className={
              bioValid
                ? "text-ink-400"
                : "text-red-600"
            }
          >
            {bioValid
              ? "Yeterli."
              : `En az ${BIO_MIN} karakter (şu an ${bioLen}).`}
          </span>
          <span className="font-mono text-ink-400">
            {state.bio.length}/{BIO_MAX}
          </span>
        </div>
        {fieldErrors.bio && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.bio[0]}</p>
        )}
      </Section>

      <Section
        title="İş Deneyimi"
        hint="Opsiyonel — ama doldurulan iş bilgileri öne çıkmanı ve tercih edilmeni sağlar."
      >
        {fieldErrors.experiences && (
          <p className="text-xs text-red-600">{fieldErrors.experiences[0]}</p>
        )}
        <ExperienceList
          items={state.experiences}
          onChange={(next) => set("experiences", next)}
        />
      </Section>

      <Section
        title="Gizlilik Ayarları"
        hint="Profilin başkalarına göründüğünde hangi bilgiler paylaşılsın? Adın her zaman görünür."
      >
        <SettingRow
          label="Mahallemi göster"
          description="Kapalıysa sadece ilçe (Pendik) görünür. Açıksa mahallen de görünür."
          checked={state.showDistrict}
          onChange={(v) => set("showDistrict", v)}
        />
        <div className="border-t border-ink-100" />
        <SettingRow
          label="Telefonum herkese açık olsun"
          description="Açıksa giriş yapan herkes numaranı görür. Kapalıysa sadece platform içi mesajlaşma; istersen sohbet sırasında numaranı paylaşırsın."
          checked={state.phoneVisibility === "public"}
          onChange={(v) =>
            set("phoneVisibility", v ? "public" : "private")
          }
        />
      </Section>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-ink h-12 px-6 rounded-full text-[15px]"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "block w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/5";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6 shadow-sm">
      <div className="pb-3 mb-4 border-b border-ink-100">
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.005em",
            lineHeight: 1.3,
            margin: 0,
            color: "var(--color-ink-900)",
          }}
        >
          {title}
        </h2>
        {hint && (
          <p
            style={{
              marginTop: 4,
              marginBottom: 0,
              fontSize: 12.5,
              lineHeight: 1.5,
              color: "var(--color-ink-500)",
            }}
          >
            {hint}
          </p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ProfessionAutocomplete({
  categories,
  selected,
  onAdd,
  onRemove,
}: {
  categories: Category[];
  selected: string[];
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // "Mesleğim listede yok" öneri akışı
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestName, setSuggestName] = useState("");
  const [suggestNote, setSuggestNote] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestErr, setSuggestErr] = useState<string | null>(null);
  const [suggestDone, setSuggestDone] = useState(false);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const hasDiger = selectedSet.has("diger");

  const suggestions = useMemo(() => {
    const q = query.trim();
    const available = categories.filter((c) => !selectedSet.has(c.slug));
    if (!q) return available.slice(0, 6);
    const nq = normalize(q);
    return available.filter((c) => normalize(c.name).includes(nq)).slice(0, 6);
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
          </div>
        )}
      </div>

      {suggestOpen && !suggestDone && (
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

      {suggestDone && (
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
            {!hasDiger && categories.some((c) => c.slug === "diger") && (
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

function SettingRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 20,
        padding: "10px 0",
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 500,
            color: "var(--color-ink-900)",
            lineHeight: 1.35,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 12.5,
            color: "var(--color-ink-500)",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} ariaLabel={label} />
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        flex: "0 0 40px",
        width: 40,
        height: 22,
        borderRadius: 999,
        border: 0,
        padding: 0,
        background: checked
          ? "var(--color-ink-900)"
          : "var(--color-ink-200)",
        cursor: "pointer",
        transition: "background .15s ease",
        marginTop: 2,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          transition: "left .15s ease",
        }}
      />
    </button>
  );
}

function ExperienceList({
  items,
  onChange,
}: {
  items: Experience[];
  onChange: (next: Experience[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const canAdd = items.length < MAX_EXPERIENCES;

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function add(e: Experience) {
    onChange([e, ...items]);
    setAdding(false);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && !adding && (
        <p className="text-xs text-ink-500">Henüz deneyim eklemedin.</p>
      )}

      {items.map((e, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-3 rounded-lg border border-ink-100 bg-white p-3"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-900">
              {e.role}
              <span className="font-normal text-ink-500"> · {e.workplace}</span>
            </p>
            <p className="mt-0.5 font-mono text-xs text-ink-500">
              {formatYearRange(e)}
            </p>
            {e.description && (
              <p className="mt-1 text-xs text-ink-700 leading-relaxed">
                {e.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 text-xs text-ink-500 hover:text-red-600 transition"
          >
            Sil
          </button>
        </div>
      ))}

      {adding ? (
        <ExperienceEditor onSave={add} onCancel={() => setAdding(false)} />
      ) : canAdd ? (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full rounded-lg border border-dashed border-ink-200 px-3 py-2.5 text-sm text-ink-700 hover:border-ink-900 hover:text-ink-900 transition"
        >
          + Deneyim ekle
        </button>
      ) : (
        <p className="text-xs text-ink-500">
          Maksimum {MAX_EXPERIENCES} deneyime ulaştın.
        </p>
      )}
    </div>
  );
}

function ExperienceEditor({
  onSave,
  onCancel,
}: {
  onSave: (e: Experience) => void;
  onCancel: () => void;
}) {
  const [role, setRole] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [fromYear, setFromYear] = useState<number>(CURRENT_YEAR);
  const [toYear, setToYear] = useState<number | null>(null);
  const [ongoing, setOngoing] = useState(true);
  const [description, setDescription] = useState("");
  const [err, setErr] = useState<string | null>(null);

  function submit() {
    setErr(null);
    const r = role.trim();
    const w = workplace.trim();
    if (r.length < 2) return setErr("Görev en az 2 karakter.");
    if (w.length < 2) return setErr("İşyeri en az 2 karakter.");
    if (!ongoing && toYear !== null && toYear < fromYear) {
      return setErr("Bitiş yılı başlangıçtan önce olamaz.");
    }
    onSave({
      role: r,
      workplace: w,
      fromYear,
      toYear: ongoing ? null : (toYear ?? fromYear),
      description: description.trim() || undefined,
    });
  }

  const yearOptions: number[] = [];
  for (let y = CURRENT_YEAR; y >= 1980; y--) yearOptions.push(y);

  return (
    <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-3 space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Görev (örn. Garson)"
          className={inputCls}
          maxLength={80}
        />
        <input
          value={workplace}
          onChange={(e) => setWorkplace(e.target.value)}
          placeholder="İşyeri (örn. Pendik Pide)"
          className={inputCls}
          maxLength={80}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-ink-500 mb-1">Başlangıç yılı</label>
          <select
            value={fromYear}
            onChange={(e) => setFromYear(Number(e.target.value))}
            className={inputCls}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-ink-500 mb-1">Bitiş yılı</label>
          <select
            value={ongoing ? "ongoing" : String(toYear ?? CURRENT_YEAR)}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "ongoing") {
                setOngoing(true);
                setToYear(null);
              } else {
                setOngoing(false);
                setToYear(Number(v));
              }
            }}
            className={inputCls}
          >
            <option value="ongoing">Devam ediyor</option>
            {yearOptions.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        maxLength={300}
        placeholder="Kısa açıklama (opsiyonel)"
        className={inputCls}
      />

      {err && <p className="text-xs text-red-600">{err}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-full border border-ink-200 px-4 text-sm text-ink-700 hover:border-ink-900 transition"
        >
          İptal
        </button>
        <button
          type="button"
          onClick={submit}
          className="btn-ink h-9 px-4 rounded-full text-sm"
        >
          Ekle
        </button>
      </div>
    </div>
  );
}
