"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";
import type { PhoneVisibility } from "@/lib/phone-visibility";

type Category = { slug: string; name: string };

export type ProfileFormInitial = {
  professions: string[];
  bio: string;
  neighborhood: string;
  showName: boolean;
  showDistrict: boolean;
  phoneVisibility: PhoneVisibility;
};

type Props = {
  categories: Category[];
  initial: ProfileFormInitial;
};

export default function ProfileForm({ categories, initial }: Props) {
  const router = useRouter();
  const [state, setState] = useState<ProfileFormInitial>(initial);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [loading, setLoading] = useState(false);

  function toggleProfession(slug: string) {
    setState((s) => {
      const has = s.professions.includes(slug);
      if (has) return { ...s, professions: s.professions.filter((p) => p !== slug) };
      if (s.professions.length >= 5) return s;
      return { ...s, professions: [...s.professions, slug] };
    });
  }

  function set<K extends keyof ProfileFormInitial>(
    key: K,
    value: ProfileFormInitial[K],
  ) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
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
      setSuccess("Profilin kaydedildi.");
      router.refresh();
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
        hint={`En fazla 5 meslek seçebilirsin. Seçili: ${state.professions.length}/5`}
      >
        {fieldErrors.professions && (
          <p className="text-xs text-red-600">{fieldErrors.professions[0]}</p>
        )}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((c) => {
            const checked = state.professions.includes(c.slug);
            const disabled = !checked && state.professions.length >= 5;
            return (
              <label
                key={c.slug}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition ${
                  checked
                    ? "border-brand-500 bg-brand-50 text-brand-900"
                    : disabled
                      ? "border-ink-100 bg-ink-50 text-ink-400 cursor-not-allowed"
                      : "border-ink-200 bg-white text-ink-700 hover:border-brand-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleProfession(c.slug)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                {c.name}
              </label>
            );
          })}
        </div>
      </Section>

      <Section title="Hakkımda">
        <Field
          label="Kısa Tanıtım (opsiyonel)"
          hint="Deneyimin, çalışma saatlerin gibi bilgileri yaz. Max 500 karakter."
          errors={fieldErrors.bio}
        >
          <textarea
            value={state.bio}
            onChange={(e) => set("bio", e.target.value)}
            rows={5}
            maxLength={500}
            className={inputCls}
            placeholder="Örn: 5 yıl garson tecrübem var. Akşam ve hafta sonu çalışabilirim."
          />
          <p className="mt-1 text-xs text-ink-400">{state.bio.length}/500</p>
        </Field>

        <Field
          label="Mahalle (opsiyonel)"
          hint="Yakın iş ilanlarında öncelik kazanırsın."
          errors={fieldErrors.neighborhood}
        >
          <select
            value={state.neighborhood}
            onChange={(e) => set("neighborhood", e.target.value)}
            className={inputCls}
          >
            <option value="">Seçilmedi</option>
            {PENDIK_NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section
        title="Gizlilik Ayarları"
        hint="Profilin başkalarına göründüğünde hangi bilgiler paylaşılsın?"
      >
        <Toggle
          label="Adımı göster"
          description="Kapalıysa sadece baş harflerin görünür (örn: K.A.)."
          checked={state.showName}
          onChange={(v) => set("showName", v)}
        />
        <Toggle
          label="Mahallemi göster"
          description="Kapalıysa sadece ilçe görünür (Pendik)."
          checked={state.showDistrict}
          onChange={(v) => set("showDistrict", v)}
        />
        <div className="space-y-2 pt-1">
          <p className="text-sm font-medium text-ink-900">Telefon görünürlüğü</p>
          <PhoneRadio
            value="after_approval"
            current={state.phoneVisibility}
            onChange={(v) => set("phoneVisibility", v)}
            label="Sadece onayladığım kişiler görsün"
            desc="Önerilen. Önce mesajlaşır, istersen iletişim talebini kabul edip numaranı paylaşırsın."
          />
          <PhoneRadio
            value="public"
            current={state.phoneVisibility}
            onChange={(v) => set("phoneVisibility", v)}
            label="Herkes telefonumu görsün"
            desc="Acil işler için en hızlısı. Giriş yapmış kullanıcılar numaranı doğrudan görür."
          />
          <PhoneRadio
            value="private"
            current={state.phoneVisibility}
            onChange={(v) => set("phoneVisibility", v)}
            label="Telefonum hiç görünmesin"
            desc="Sadece platform üzerinden mesajlaşma. Kabul edilen taleplerde bile numara açılmaz."
          />
        </div>
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
          {loading ? "Kaydediliyor..." : "Profili Kaydet"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "block w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

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
    <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      <div>
        <h2 className="font-semibold text-ink-900">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-ink-500">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  errors,
  children,
}: {
  label: string;
  hint?: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}
      </label>
      {children}
      {hint && !errors && (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      )}
      {errors && <p className="mt-1 text-xs text-red-600">{errors[0]}</p>}
    </div>
  );
}

function PhoneRadio({
  value,
  current,
  onChange,
  label,
  desc,
}: {
  value: PhoneVisibility;
  current: PhoneVisibility;
  onChange: (v: PhoneVisibility) => void;
  label: string;
  desc: string;
}) {
  const checked = value === current;
  return (
    <label
      className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${
        checked
          ? "border-brand-500 bg-brand-50"
          : "border-ink-200 bg-white hover:border-ink-300"
      }`}
    >
      <input
        type="radio"
        name="phoneVisibility"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 h-4 w-4 border-ink-300 text-brand-600 focus:ring-brand-500"
      />
      <div>
        <p className={`text-sm font-medium ${checked ? "text-brand-900" : "text-ink-900"}`}>
          {label}
        </p>
        <p className="text-xs text-ink-600">{desc}</p>
      </div>
    </label>
  );
}

function Toggle({
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
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
      />
      <div>
        <p className="text-sm font-medium text-ink-900">{label}</p>
        <p className="text-xs text-ink-500">{description}</p>
      </div>
    </label>
  );
}
