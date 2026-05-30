"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPhone } from "@/lib/format";

type Props = {
  initial: {
    fullName: string;
    email: string;
    phone: string;
    district: string;
    neighborhood: string;
  };
  neighborhoods: string[];
};

export default function AccountForm({ initial, neighborhoods }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initial.fullName);
  const [neighborhood, setNeighborhood] = useState(initial.neighborhood || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});

  const dirty =
    fullName.trim() !== initial.fullName ||
    neighborhood !== (initial.neighborhood || "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, neighborhood }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kaydedilemedi.");
        if (data.issues) setFieldErrors(data.issues);
        return;
      }
      setSuccess("Hesap bilgilerin güncellendi.");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Ad Soyad" errors={fieldErrors.fullName}>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          maxLength={80}
          className={inputCls}
          placeholder="Adınız ve soyadınız"
        />
      </Field>

      <Field label="Mahalle" errors={fieldErrors.neighborhood}>
        <select
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className={inputCls}
        >
          <option value="">Mahalle seç</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>

      <Field label="E-posta" hint="E-posta değişikliği için destekle iletişime geç.">
        <input
          value={initial.email}
          readOnly
          className={`${inputCls} bg-ink-50 text-ink-500 cursor-not-allowed`}
        />
      </Field>

      <Field label="Telefon" hint="Telefon değişikliği için destekle iletişime geç.">
        <input
          value={formatPhone(initial.phone)}
          readOnly
          className={`${inputCls} bg-ink-50 text-ink-500 cursor-not-allowed font-mono`}
        />
      </Field>

      <Field label="İlçe">
        <input
          value={initial.district}
          readOnly
          className={`${inputCls} bg-ink-50 text-ink-500 cursor-not-allowed`}
        />
      </Field>

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
          disabled={loading || !dirty}
          className="btn-ink h-12 px-6 rounded-full text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "block w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-[14.5px] text-ink-900 outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/5";

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
      <label className="block text-sm font-medium text-ink-700 mb-1.5">
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
