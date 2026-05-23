"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "İstek başarısız.");
        return;
      }
      setDevCode(data.devCode);
      setStep("reset");
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== password2) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Şifre sıfırlanamadı.");
        return;
      }
      setStep("done");
      setTimeout(() => router.push("/giris"), 1500);
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "done") {
    return (
      <div className="text-center space-y-3">
        <p className="text-2xl">✅</p>
        <p className="text-base font-semibold text-ink-900">
          Şifren başarıyla değiştirildi.
        </p>
        <p className="text-sm text-ink-500">Giriş sayfasına yönlendiriliyorsun…</p>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <form onSubmit={resetPassword} className="space-y-4">
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900">
          <p className="font-semibold">{email}</p>
          <p className="mt-0.5 text-xs">
            adresine 6 haneli kod gönderildi. 10 dakika geçerli.
          </p>
          {devCode && (
            <p className="mt-1 text-xs font-mono text-brand-700">
              DEV kod: {devCode}
            </p>
          )}
        </div>

        <Field
          label="Doğrulama Kodu"
          name="code"
          value={code}
          onChange={setCode}
          placeholder="6 haneli kod"
          autoComplete="one-time-code"
        />

        <Field
          label="Yeni Şifre"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          hint="En az 6 karakter."
        />

        <Field
          label="Yeni Şifre (Tekrar)"
          name="password2"
          type="password"
          value={password2}
          onChange={setPassword2}
          autoComplete="new-password"
        />

        {error && (
          <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-ink h-12 rounded-full text-[15px]"
        >
          {loading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
        </button>

        <button
          type="button"
          onClick={() => {
            setStep("email");
            setCode("");
            setPassword("");
            setPassword2("");
            setError(null);
          }}
          className="block w-full text-center text-sm text-ink-500 hover:text-brand-700"
        >
          ← Farklı bir e-posta dene
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={requestReset} className="space-y-4">
      <Field
        label="E-posta"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        placeholder="ornek@mail.com"
      />

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full btn-ink h-12 rounded-full text-[15px]"
      >
        {loading ? "Gönderiliyor..." : "Sıfırlama Kodu Gönder"}
      </button>

      <p className="text-center text-sm text-ink-500 pt-1">
        Hatırladın mı?{" "}
        <Link href="/giris" className="text-brand-700 font-medium hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
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
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[14px] font-medium text-ink-900 mb-1.5"
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
        className="block w-full h-12 px-3.5 rounded-[12px] border border-ink-200 bg-white text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
      />
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
