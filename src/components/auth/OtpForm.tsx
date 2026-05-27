"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "./OtpInput";
import Spinner from "@/components/ui/Spinner";

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
    <div className="flex flex-col gap-3.5">
      {(needsPhone || needsEmail) && (
        <div className="flex items-center gap-2 text-[12px] text-ink-500">
          <StepBadge label="1. Telefon" active={step === "phone"} done={phoneDone} />
          <span className="text-ink-400">→</span>
          <StepBadge label="2. E-posta" active={step === "email"} done={emailDone} />
        </div>
      )}

      <div className="rounded-[12px] border border-ink-100 bg-brand-50 px-3.5 py-3 text-[13.5px] text-ink-700 leading-relaxed">
        {step === "phone" ? (
          <>
            <strong className="text-ink-900">{currentTarget}</strong>{" "}
            numarasına gönderilen 6 haneli SMS kodunu girin.
          </>
        ) : (
          <>
            <strong className="text-ink-900">{currentTarget}</strong>{" "}
            adresine gönderilen 6 haneli e-posta kodunu girin.
          </>
        )}
      </div>

      {currentDevOtp && (
        <div className="rounded-[12px] border border-amber-300 bg-amber-50 px-3.5 py-3 text-[13px] text-amber-900">
          <span className="font-semibold">DEV OTP ({step}):</span>{" "}
          <span className="font-mono text-[15px] tracking-[0.4em]">
            {currentDevOtp}
          </span>
          <p className="mt-1 text-[11.5px] text-amber-800">
            Üretimde bu kod gösterilmez; gerçek SMS/e-posta ile gönderilir.
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
    ? "bg-accent-600/10 text-accent-600 border-accent-600"
    : active
      ? "bg-ink-900/[0.06] text-ink-900 border-ink-200"
      : "bg-transparent text-ink-500 border-ink-100";
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-full border text-[12px] font-medium ${cls}`}
    >
      {done ? "✓ " : ""}
      {label}
    </span>
  );
}
