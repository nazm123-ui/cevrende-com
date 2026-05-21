"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OtpForm from "./OtpForm";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [needsVerification, setNeedsVerification] = useState(false);
  const [userId, setUserId] = useState("");
  const [needsPhone, setNeedsPhone] = useState(false);
  const [needsEmail, setNeedsEmail] = useState(false);
  const [devPhoneOtp, setDevPhoneOtp] = useState<string | undefined>();
  const [devEmailOtp, setDevEmailOtp] = useState<string | undefined>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsVerification && data.userId) {
          setUserId(data.userId);
          setNeedsPhone(data.needsPhoneVerification ?? false);
          setNeedsEmail(data.needsEmailVerification ?? false);
          setDevPhoneOtp(data.devPhoneOtp);
          setDevEmailOtp(data.devEmailOtp);
          setNeedsVerification(true);
          return;
        }
        setError(data.error || "Giriş başarısız.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (needsVerification) {
    return (
      <div>
        <h2 className="text-xl font-bold text-ink-900 mb-1">
          Hesabını Doğrula
        </h2>
        <p className="text-sm text-ink-500 mb-6">
          Hesabın henüz tamamen doğrulanmamış. Devam etmek için eksik doğrulamaları tamamla.
        </p>
        <OtpForm
          userId={userId}
          needsPhone={needsPhone}
          needsEmail={needsEmail}
          initialDevPhoneOtp={devPhoneOtp}
          initialDevEmailOtp={devEmailOtp}
          redirectTo="/"
        />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-ink-700"
        >
          E-posta veya Telefon
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-ink-200 px-3 py-2 text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-ink-700"
        >
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-ink-200 px-3 py-2 text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 transition disabled:bg-ink-200 disabled:cursor-not-allowed"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>

      <p className="text-center text-sm text-ink-500">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="text-brand-700 font-medium hover:underline">
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
