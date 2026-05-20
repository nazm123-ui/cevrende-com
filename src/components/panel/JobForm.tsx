"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { JOB_TYPES, SALARY_TYPES } from "@/lib/constants/job-types";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";

type Category = { slug: string; name: string };

export type JobFormInitial = {
  title: string;
  description: string;
  categorySlug: string;
  jobType: string;
  neighborhood: string;
  workDate: string; // YYYY-MM-DD or ""
  startTime: string;
  endTime: string;
  salaryAmount: string;
  salaryType: string;
  neededPeopleCount: number;
  experienceRequired: boolean;
  benefits: string[];
  mapLocationUrl: string;
};

const DEFAULTS: JobFormInitial = {
  title: "",
  description: "",
  categorySlug: "",
  jobType: "daily",
  neighborhood: "",
  workDate: "",
  startTime: "",
  endTime: "",
  salaryAmount: "",
  salaryType: "not_specified",
  neededPeopleCount: 1,
  experienceRequired: false,
  benefits: [],
  mapLocationUrl: "",
};

const BENEFITS = [
  { value: "meal", label: "Yemek" },
  { value: "transport", label: "Yol" },
  { value: "uniform", label: "Üniforma" },
] as const;

type Props = {
  categories: Category[];
  mode: "create" | "edit";
  jobId?: string;
  initial?: Partial<JobFormInitial>;
};

export default function JobForm({ categories, mode, jobId, initial }: Props) {
  const router = useRouter();
  const [state, setState] = useState<JobFormInitial>({
    ...DEFAULTS,
    ...(initial ?? {}),
  });
  const [error, setError] = useState<string | null>(null);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [loading, setLoading] = useState(false);

  function set<K extends keyof JobFormInitial>(key: K, value: JobFormInitial[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function toggleBenefit(value: string) {
    setState((s) => ({
      ...s,
      benefits: s.benefits.includes(value)
        ? s.benefits.filter((b) => b !== value)
        : [...s.benefits, value],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPendingNotice(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const body = {
        title: state.title,
        description: state.description,
        categorySlug: state.categorySlug,
        jobType: state.jobType,
        neighborhood: state.neighborhood,
        workDate: state.workDate || undefined,
        startTime: state.startTime || undefined,
        endTime: state.endTime || undefined,
        salaryAmount: state.salaryAmount || null,
        salaryType: state.salaryType,
        neededPeopleCount: state.neededPeopleCount,
        experienceRequired: state.experienceRequired,
        benefits: state.benefits,
        mapLocationUrl: state.mapLocationUrl || undefined,
      };

      const url = mode === "create" ? "/api/jobs" : `/api/jobs/${jobId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "İşlem başarısız.");
        if (data.issues) setFieldErrors(data.issues);
        return;
      }
      if (data.pendingReview) {
        setPendingNotice(
          "İlanınız kaydedildi ancak içerik filtresi nedeniyle admin onayı bekleniyor. Onaylandığında yayına alınacaktır.",
        );
        // Kullanıcı bilgilendirilsin, sonra yönlendir
        setTimeout(() => {
          router.push("/panel");
          router.refresh();
        }, 1500);
        return;
      }
      router.push("/panel");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section title="Temel Bilgiler">
        <Field label="İş Başlığı" required errors={fieldErrors.title}>
          <input
            value={state.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Örn: Akşam servisi için garson aranıyor"
            className={inputCls}
            required
          />
        </Field>

        <Field
          label="İş Açıklaması"
          required
          errors={fieldErrors.description}
          hint="Aranan kişi, görev tanımı ve önemli detayları yazın."
        >
          <textarea
            value={state.description}
            onChange={(e) => set("description", e.target.value)}
            rows={6}
            className={inputCls}
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kategori" required errors={fieldErrors.categorySlug}>
            <select
              value={state.categorySlug}
              onChange={(e) => set("categorySlug", e.target.value)}
              className={inputCls}
              required
            >
              <option value="" disabled>
                Kategori seçin
              </option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="İş Tipi" required errors={fieldErrors.jobType}>
            <select
              value={state.jobType}
              onChange={(e) => set("jobType", e.target.value)}
              className={inputCls}
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Konum">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="İl">
            <input value="İstanbul" disabled className={inputDisabled} />
          </Field>
          <Field label="İlçe">
            <input value="Pendik" disabled className={inputDisabled} />
          </Field>
          <Field label="Mahalle" required errors={fieldErrors.neighborhood}>
            <select
              value={state.neighborhood}
              onChange={(e) => set("neighborhood", e.target.value)}
              className={inputCls}
              required
            >
              <option value="" disabled>
                Seçin
              </option>
              {PENDIK_NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Harita Bağlantısı (opsiyonel)"
          hint="Google Maps'ten paylaş bağlantısı yapıştırabilirsiniz."
          errors={fieldErrors.mapLocationUrl}
        >
          <input
            type="url"
            value={state.mapLocationUrl}
            onChange={(e) => set("mapLocationUrl", e.target.value)}
            placeholder="https://maps.google.com/..."
            className={inputCls}
          />
        </Field>
      </Section>

      <Section title="Çalışma Bilgileri">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Çalışma Tarihi (opsiyonel)" errors={fieldErrors.workDate}>
            <input
              type="date"
              value={state.workDate}
              onChange={(e) => set("workDate", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Başlangıç Saati" errors={fieldErrors.startTime}>
            <input
              type="time"
              value={state.startTime}
              onChange={(e) => set("startTime", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Bitiş Saati" errors={fieldErrors.endTime}>
            <input
              type="time"
              value={state.endTime}
              onChange={(e) => set("endTime", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Ücret Tutarı (TL)" errors={fieldErrors.salaryAmount}>
            <input
              type="number"
              min={0}
              value={state.salaryAmount}
              onChange={(e) => set("salaryAmount", e.target.value)}
              placeholder="Boş bırakabilirsiniz"
              className={inputCls}
            />
          </Field>
          <Field label="Ödeme Tipi" errors={fieldErrors.salaryType}>
            <select
              value={state.salaryType}
              onChange={(e) => set("salaryType", e.target.value)}
              className={inputCls}
            >
              {SALARY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Aranan Kişi Sayısı"
            errors={fieldErrors.neededPeopleCount}
          >
            <input
              type="number"
              min={1}
              max={50}
              value={state.neededPeopleCount}
              onChange={(e) =>
                set("neededPeopleCount", Number(e.target.value) || 1)
              }
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Ek Bilgiler">
          <div className="grid gap-2 sm:grid-cols-2">
            <Checkbox
              label="Deneyim Gerekli"
              checked={state.experienceRequired}
              onChange={(v) => set("experienceRequired", v)}
            />
            {BENEFITS.map((b) => (
              <Checkbox
                key={b.value}
                label={`${b.label} Desteği`}
                checked={state.benefits.includes(b.value)}
                onChange={() => toggleBenefit(b.value)}
              />
            ))}
          </div>
        </Field>
      </Section>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {pendingNotice && (
        <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-900">
          {pendingNotice}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
        <Link
          href="/panel"
          className="rounded-lg border border-ink-200 px-5 py-2.5 text-center font-medium text-ink-700 hover:bg-ink-50 transition"
        >
          İptal
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 transition disabled:bg-ink-200 disabled:cursor-not-allowed"
        >
          {loading
            ? "Kaydediliyor..."
            : mode === "create"
              ? "İlanı Yayınla"
              : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "block w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const inputDisabled =
  "block w-full rounded-lg border border-ink-100 bg-ink-50 px-3 py-2 text-sm text-ink-500";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      <h2 className="font-semibold text-ink-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  errors,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}
        {required && <span className="text-accent-600 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !errors && (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      )}
      {errors && (
        <p className="mt-1 text-xs text-red-600">{errors[0]}</p>
      )}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}
