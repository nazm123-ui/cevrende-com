"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  initialDevOtp?: string;
  redirectTo?: string;
};

export default function OtpForm({
  userId,
  initialDevOtp,
  redirectTo = "/",
}: Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | undefined>(initialDevOtp);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Doğrulama başarısız.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kod gönderilemedi.");
        return;
      }
      if (data.devOtp) setDevOtp(data.devOtp);
      setInfo("Yeni doğrulama kodu gönderildi.");
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {devOtp && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <span className="font-semibold">DEV OTP:</span>{" "}
          <span className="font-mono text-base tracking-widest">{devOtp}</span>
          <p className="mt-1 text-xs text-amber-700">
            Üretim ortamında bu kod gösterilmeyecek, SMS ile gönderilecek.
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-ink-700"
        >
          6 Haneli Doğrulama Kodu
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="mt-1 block w-full rounded-lg border border-ink-200 px-3 py-2 text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="------"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {info && (
        <p className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 transition disabled:bg-ink-200 disabled:cursor-not-allowed"
      >
        {loading ? "Doğrulanıyor..." : "Doğrula"}
      </button>

      <button
        type="button"
        onClick={onResend}
        disabled={resending}
        className="w-full text-sm text-brand-700 hover:underline disabled:opacity-50"
      >
        {resending ? "Gönderiliyor..." : "Kodu tekrar gönder"}
      </button>
    </form>
  );
}
