"use client";

import { useState } from "react";
import Link from "next/link";
import OtpForm from "./OtpForm";

type Role = "employer" | "worker";

export default function RegisterForm() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [userId, setUserId] = useState<string>("");
  const [devOtp, setDevOtp] = useState<string | undefined>();

  const [role, setRole] = useState<Role>("worker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          fullName,
          email,
          phone,
          password,
          neighborhood,
          acceptTerms,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kayıt başarısız.");
        if (data.issues) setFieldErrors(data.issues);
        return;
      }
      setUserId(data.userId);
      setDevOtp(data.devOtp);
      setStep("otp");
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <div>
        <h2 className="text-xl font-bold text-ink-900 mb-1">
          Telefonunu doğrula
        </h2>
        <p className="text-sm text-ink-500 mb-6">
          {phone} numarasına gönderilen 6 haneli kodu gir.
        </p>
        <OtpForm userId={userId} initialDevOtp={devOtp} redirectTo="/" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <p className="block text-sm font-medium text-ink-700 mb-2">
          Hesap Tipi
        </p>
        <div className="grid grid-cols-2 gap-3">
          <RoleCard
            checked={role === "worker"}
            onSelect={() => setRole("worker")}
            title="İş Arayan"
            desc="İlanlara göz at, işverenle iletişime geç."
          />
          <RoleCard
            checked={role === "employer"}
            onSelect={() => setRole("employer")}
            title="İşveren"
            desc="Ücretsiz ilan ver, çalışanını bul."
          />
        </div>
      </div>

      <Field
        label="Ad Soyad"
        name="fullName"
        value={fullName}
        onChange={setFullName}
        autoComplete="name"
        errors={fieldErrors.fullName}
      />

      <Field
        label="E-posta"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        errors={fieldErrors.email}
      />

      <Field
        label="Telefon"
        name="phone"
        type="tel"
        value={phone}
        onChange={setPhone}
        placeholder="05XXXXXXXXX"
        autoComplete="tel"
        errors={fieldErrors.phone}
      />

      <Field
        label="Şifre"
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        errors={fieldErrors.password}
        hint="En az 6 karakter."
      />

      <Field
        label="Mahalle (opsiyonel)"
        name="neighborhood"
        value={neighborhood}
        onChange={setNeighborhood}
        placeholder="Örn: Kaynarca, Yenişehir..."
        errors={fieldErrors.neighborhood}
      />

      <label className="flex items-start gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
        />
        <span>
          <Link
            href="/kullanim-kosullari"
            className="text-brand-700 underline"
          >
            Kullanım Koşulları
          </Link>
          ’nı ve{" "}
          <Link href="/gizlilik" className="text-brand-700 underline">
            Gizlilik Politikası
          </Link>
          ’nı kabul ediyorum.
        </span>
      </label>
      {fieldErrors.acceptTerms && (
        <p className="text-xs text-red-600">{fieldErrors.acceptTerms[0]}</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !acceptTerms}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 transition disabled:bg-ink-200 disabled:cursor-not-allowed"
      >
        {loading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
      </button>

      <p className="text-center text-sm text-ink-500">
        Hesabın var mı?{" "}
        <Link href="/giris" className="text-brand-700 font-medium hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}

function RoleCard({
  checked,
  onSelect,
  title,
  desc,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left rounded-xl border-2 p-4 transition ${
        checked
          ? "border-brand-500 bg-brand-50"
          : "border-ink-200 bg-white hover:border-ink-300"
      }`}
    >
      <p
        className={`font-semibold ${
          checked ? "text-brand-700" : "text-ink-900"
        }`}
      >
        {title}
      </p>
      <p className="text-xs text-ink-500 mt-1">{desc}</p>
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  errors,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  errors?: string[];
  hint?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-ink-700"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1 block w-full rounded-lg border border-ink-200 px-3 py-2 text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
      {hint && !errors && (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      )}
      {errors && (
        <p className="mt-1 text-xs text-red-600">{errors[0]}</p>
      )}
    </div>
  );
}
