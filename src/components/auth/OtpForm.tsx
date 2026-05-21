"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  needsPhone: boolean;
  needsEmail: boolean;
  phoneMasked?: string;
  emailMasked?: string;
  initialDevPhoneOtp?: string;
  initialDevEmailOtp?: string;
  redirectTo?: string;
};

type Channel = "phone" | "email";

export default function OtpForm({
  userId,
  needsPhone,
  needsEmail,
  phoneMasked,
  emailMasked,
  initialDevPhoneOtp,
  initialDevEmailOtp,
  redirectTo = "/",
}: Props) {
  const router = useRouter();

  const initialStep: Channel = needsPhone ? "phone" : "email";
  const [step, setStep] = useState<Channel>(initialStep);
  const [phoneDone, setPhoneDone] = useState(!needsPhone);
  const [emailDone, setEmailDone] = useState(!needsEmail);

  const [code, setCode] = useState("");
  const [devPhoneOtp, setDevPhoneOtp] = useState(initialDevPhoneOtp);
  const [devEmailOtp, setDevEmailOtp] = useState(initialDevEmailOtp);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const currentDevOtp = step === "phone" ? devPhoneOtp : devEmailOtp;
  const currentTarget = step === "phone" ? phoneMasked : emailMasked;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const endpoint =
        step === "phone" ? "/api/auth/verify-phone" : "/api/auth/verify-email";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Doğrulama başarısız.");
        return;
      }

      if (step === "phone") setPhoneDone(true);
      else setEmailDone(true);

      if (data.complete) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      setCode("");
      setStep(data.nextStep as Channel);
      setInfo(
        data.nextStep === "email"
          ? "Telefon doğrulandı. Şimdi e-posta kodunu girin."
          : "E-posta doğrulandı. Şimdi telefon kodunu girin.",
      );
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
        body: JSON.stringify({ userId, channel: step }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kod gönderilemedi.");
        return;
      }
      if (data.devOtp) {
        if (step === "phone") setDevPhoneOtp(data.devOtp);
        else setDevEmailOtp(data.devOtp);
      }
      setInfo(
        step === "phone"
          ? "Yeni telefon doğrulama kodu gönderildi."
          : "Yeni e-posta doğrulama kodu gönderildi.",
      );
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="space-y-4">
      {(needsPhone || needsEmail) && (
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <StepBadge label="1. Telefon" active={step === "phone"} done={phoneDone} />
          <span>→</span>
          <StepBadge label="2. E-posta" active={step === "email"} done={emailDone} />
        </div>
      )}

      <div className="rounded-lg border border-ink-100 bg-ink-50 p-3 text-sm text-ink-700">
        {step === "phone" ? (
          <>
            <strong>{currentTarget}</strong> numarasına gönderilen 6 haneli SMS kodunu girin.
          </>
        ) : (
          <>
            <strong>{currentTarget}</strong> adresine gönderilen 6 haneli e-posta kodunu girin.
          </>
        )}
      </div>

      {currentDevOtp && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <span className="font-semibold">DEV OTP ({step}):</span>{" "}
          <span className="font-mono text-base tracking-widest">{currentDevOtp}</span>
          <p className="mt-1 text-xs text-amber-700">
            Üretim ortamında bu kod gösterilmeyecek, gerçek SMS/e-posta ile gönderilecek.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
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
    </div>
  );
}

function StepBadge({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  const cls = done
    ? "bg-green-100 text-green-800 border-green-300"
    : active
      ? "bg-brand-100 text-brand-800 border-brand-300"
      : "bg-ink-100 text-ink-500 border-ink-200";
  return (
    <span className={`rounded-full border px-2 py-0.5 font-medium ${cls}`}>
      {done ? "✓ " : ""}
      {label}
    </span>
  );
}
