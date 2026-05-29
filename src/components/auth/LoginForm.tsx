"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OtpForm from "./OtpForm";
import Spinner from "@/components/ui/Spinner";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [needsVerification, setNeedsVerification] = useState(false);
  const [userId, setUserId] = useState("");
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
        <h4 className="text-[16px] font-semibold text-ink-900 mb-1">
          Hesabını Doğrula
        </h4>
        <p className="text-[13.5px] text-ink-500 mb-5">
          Devam etmek için e-postandaki kodu gir.
        </p>
        <OtpForm
          userId={userId}
          initialDevEmailOtp={devEmailOtp}
          redirectTo="/"
        />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      <div>
        <label
          htmlFor="identifier"
          className="block text-[13px] font-medium text-ink-700 mb-2 tracking-[-0.005em]"
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
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-ink-700 tracking-[-0.005em]"
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
        />
      </div>

      {error && (
        <p className="rounded-[10px] bg-red-50 border border-red-100 px-3 py-2.5 text-[13.5px] text-red-700 m-0">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex items-center justify-center gap-2 w-full h-12 px-5 rounded-full bg-ink-900 text-white border border-ink-900 text-[15px] font-medium hover:bg-accent-600 hover:border-accent-600 transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-ink-900 disabled:hover:border-ink-900"
      >
        {loading && <Spinner size={16} />}
        {loading ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>

      <p className="text-center text-[14px] text-ink-500 mt-2 mb-0">
        Hesabın yok mu?{" "}
        <Link
          href="/kayit"
          className="text-ink-900 font-medium underline underline-offset-[3px] hover:text-accent-600 transition"
        >
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
