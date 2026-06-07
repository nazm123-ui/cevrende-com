"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "./OtpInput";
import Spinner from "@/components/ui/Spinner";

type Props = {
  userId: string;
  emailMasked?: string;
  initialDevEmailOtp?: string;
  redirectTo?: string;
};

export default function OtpForm({
  userId,
  emailMasked,
  initialDevEmailOtp,
  redirectTo = "/",
}: Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [devEmailOtp, setDevEmailOtp] = useState(initialDevEmailOtp);
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
      const res = await fetch("/api/auth/verify-email", {
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
        body: JSON.stringify({ userId, channel: "email" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kod gönderilemedi.");
        return;
      }
      if (data.devOtp) {
        setDevEmailOtp(data.devOtp);
      }
      setInfo("Yeni e-posta doğrulama kodu gönderildi.");
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="rounded-[12px] border border-ink-100 bg-brand-50 px-3.5 py-3 text-[13.5px] text-ink-700 leading-relaxed">
        <strong className="text-ink-900">{emailMasked}</strong>{" "}
        adresine gönderilen 6 haneli e-posta kodunu girin.
        <span className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-ink-500">
          <span aria-hidden>📩</span>
          <span>
            Kod birkaç dakika içinde gelmezse <strong className="text-ink-700">Spam / Gereksiz (Junk)</strong> klasörünü kontrol edin.
          </span>
        </span>
      </div>

      {devEmailOtp && (
        <div className="rounded-[12px] border border-amber-300 bg-amber-50 px-3.5 py-3 text-[13px] text-amber-900">
          <span className="font-semibold">DEV OTP:</span>{" "}
          <span className="font-mono text-[15px] tracking-[0.4em]">
            {devEmailOtp}
          </span>
          <p className="mt-1 text-[11.5px] text-amber-800">
            Üretimde bu kod gösterilmez; gerçek e-posta ile gönderilir.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[13px] font-medium text-ink-700 mb-3 tracking-[-0.005em] text-center">
            6 Haneli Doğrulama Kodu
          </label>
          <OtpInput value={code} onChange={setCode} length={6} />
        </div>

        {error && (
          <p className="rounded-[10px] bg-red-50 border border-red-100 px-3 py-2.5 text-[13.5px] text-red-700 m-0">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-[10px] bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-[13.5px] text-emerald-700 m-0">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="inline-flex items-center justify-center gap-2 w-full h-12 px-5 rounded-full bg-ink-900 text-white border border-ink-900 text-[15px] font-medium hover:bg-accent-600 hover:border-accent-600 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink-900 disabled:hover:border-ink-900"
        >
          {loading && <Spinner size={16} />}
          {loading ? "Doğrulanıyor..." : "Doğrula"}
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          className="w-full text-center bg-transparent border-0 py-2 text-[13.5px] text-ink-500 hover:text-ink-900 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {resending ? "Gönderiliyor..." : "Kodu tekrar gönder"}
        </button>
      </form>
    </div>
  );
}
