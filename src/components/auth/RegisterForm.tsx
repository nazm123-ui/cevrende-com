"use client";

import { useState } from "react";
import Link from "next/link";
import OtpForm from "./OtpForm";

export default function RegisterForm() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [userId, setUserId] = useState<string>("");
  const [devPhoneOtp, setDevPhoneOtp] = useState<string | undefined>();
  const [devEmailOtp, setDevEmailOtp] = useState<string | undefined>();
  const [needsPhone, setNeedsPhone] = useState(true);
  const [needsEmail, setNeedsEmail] = useState(true);

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
      setDevPhoneOtp(data.devPhoneOtp);
      setDevEmailOtp(data.devEmailOtp);
      setNeedsPhone(data.needsPhoneVerification ?? true);
      setNeedsEmail(data.needsEmailVerification ?? true);
      setStep("otp");
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    const phoneMasked = maskPhone(phone);
    const emailMasked = maskEmail(email);
    return (
      <div>
        <h2 className="text-xl font-bold text-ink-900 mb-1">
          Hesabını Doğrula
        </h2>
        <p className="text-sm text-ink-500 mb-6">
          Telefonuna SMS, e-postana doğrulama kodu gönderildi. İkisini de gir.
        </p>
        <OtpForm
          userId={userId}
          needsPhone={needsPhone}
          needsEmail={needsEmail}
          phoneMasked={phoneMasked}
          emailMasked={emailMasked}
          initialDevPhoneOtp={devPhoneOtp}
          initialDevEmailOtp={devEmailOtp}
          redirectTo="/"
        />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field
        label="Ad Soyad"
        name="fullName"
        value={fullName}
        onChange={setFullName}
        autoComplete="name"
        placeholder="Örn: Ahmet Yılmaz"
        errors={fieldErrors.fullName}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="E-posta"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="ornek@mail.com"
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
      </div>

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
        label="Mahalle"
        name="neighborhood"
        value={neighborhood}
        onChange={setNeighborhood}
        placeholder="Örn: Kaynarca, Yenişehir..."
        errors={fieldErrors.neighborhood}
        hint="İsteğe bağlı. Yakındaki kişilerle eşleşmen daha kolay olur."
      />

      <label className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-3 text-sm text-ink-700 cursor-pointer">
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
        className="w-full rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 transition disabled:bg-ink-200 disabled:cursor-not-allowed"
      >
        {loading ? "Kayıt oluşturuluyor..." : "Hesabımı Oluştur"}
      </button>

      <p className="text-center text-sm text-ink-500 pt-1">
        Hesabın var mı?{" "}
        <Link href="/giris" className="text-brand-700 font-medium hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return digits.slice(0, 3) + "****" + digits.slice(-2);
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${local[1]}***@${domain}`;
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
        className="block text-sm font-medium text-ink-800 mb-1.5"
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
        className={`block w-full rounded-xl border bg-white px-3.5 py-2.5 text-ink-900 outline-none transition placeholder:text-ink-300 focus:ring-2 focus:ring-brand-100 ${
          errors
            ? "border-red-300 focus:border-red-500"
            : "border-ink-200 focus:border-brand-500"
        }`}
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
