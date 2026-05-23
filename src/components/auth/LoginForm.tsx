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
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="identifier"
          className="block text-[13px] font-medium text-ink-700 mb-1.5"
        >
          E-posta veya telefon
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="ornek@mail.com"
          className="block w-full h-12 px-3.5 rounded-[12px] border border-ink-200 bg-white text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-ink-700"
          >
            Şifre
          </label>
          <Link
            href="/sifre-sifirla"
            className="text-[12.5px] text-ink-500 hover:text-ink-900 transition"
          >
            Şifremi unuttum
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full h-12 px-3.5 rounded-[12px] border border-ink-200 bg-white text-[15px] text-ink-900 outline-none transition focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5"
        />
      </div>

      {error && (
        <p className="rounded-[10px] bg-red-50 border border-red-100 px-3 py-2.5 text-[13.5px] text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-ink h-12 rounded-full text-[15px]"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>

      <p className="text-center text-[13.5px] text-ink-500 pt-1">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="text-ink-900 font-medium hover:text-accent-600 transition">
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
