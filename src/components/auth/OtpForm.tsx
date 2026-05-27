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
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {(needsPhone || needsEmail) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "var(--color-ink-500)",
          }}
        >
          <StepBadge label="1. Telefon" active={step === "phone"} done={phoneDone} />
          <span style={{ color: "var(--color-ink-400)" }}>→</span>
          <StepBadge label="2. E-posta" active={step === "email"} done={emailDone} />
        </div>
      )}

      <div
        style={{
          borderRadius: 12,
          border: "1px solid var(--color-ink-100)",
          background: "#F4F2EB",
          padding: "12px 14px",
          fontSize: 13.5,
          color: "var(--color-ink-700)",
        }}
      >
        {step === "phone" ? (
          <>
            <strong style={{ color: "var(--color-ink-900)" }}>
              {currentTarget}
            </strong>{" "}
            numarasına gönderilen 6 haneli SMS kodunu girin.
          </>
        ) : (
          <>
            <strong style={{ color: "var(--color-ink-900)" }}>
              {currentTarget}
            </strong>{" "}
            adresine gönderilen 6 haneli e-posta kodunu girin.
          </>
        )}
      </div>

      {currentDevOtp && (
        <div
          style={{
            borderRadius: 12,
            border: "1px solid #fbbf24",
            background: "#fef3c7",
            padding: "12px 14px",
            fontSize: 13,
            color: "#78350f",
          }}
        >
          <span style={{ fontWeight: 600 }}>DEV OTP ({step}):</span>{" "}
          <span
            className="font-mono"
            style={{ fontSize: 15, letterSpacing: "0.4em" }}
          >
            {currentDevOtp}
          </span>
          <p style={{ marginTop: 4, fontSize: 11.5, color: "#92400e" }}>
            Üretimde bu kod gösterilmez; gerçek SMS/e-posta ile gönderilir.
          </p>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div>
          <label htmlFor="otp" style={labelStyle}>
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
            className="font-mono"
            style={{
              width: "100%",
              height: 56,
              padding: "0 12px",
              borderRadius: 12,
              border: "1px solid var(--color-ink-200)",
              background: "#fff",
              color: "var(--color-ink-900)",
              fontSize: 24,
              letterSpacing: "0.5em",
              textAlign: "center",
              outline: "none",
            }}
            placeholder="------"
          />
        </div>

        {error && (
          <p
            style={{
              borderRadius: 10,
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              padding: "10px 12px",
              fontSize: 13.5,
              color: "#b91c1c",
              margin: 0,
            }}
          >
            {error}
          </p>
        )}
        {info && (
          <p
            style={{
              borderRadius: 10,
              background: "#ecfdf5",
              border: "1px solid #d1fae5",
              padding: "10px 12px",
              fontSize: 13.5,
              color: "#047857",
              margin: 0,
            }}
          >
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          style={{
            ...btnPrimaryFull,
            opacity: loading || code.length !== 6 ? 0.5 : 1,
            cursor: loading || code.length !== 6 ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Doğrulanıyor..." : "Doğrula"}
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          style={{
            width: "100%",
            background: "none",
            border: 0,
            padding: 8,
            font: "inherit",
            fontSize: 13.5,
            color: "var(--color-ink-500)",
            cursor: resending ? "not-allowed" : "pointer",
            opacity: resending ? 0.5 : 1,
          }}
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
  const bg = done
    ? "rgba(31, 90, 69, 0.10)"
    : active
      ? "rgba(15, 17, 16, 0.06)"
      : "transparent";
  const color = done
    ? "var(--color-accent-600)"
    : active
      ? "var(--color-ink-900)"
      : "var(--color-ink-500)";
  const border = done
    ? "var(--color-accent-600)"
    : active
      ? "var(--color-ink-200)"
      : "var(--color-ink-100)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 24,
        padding: "0 10px",
        borderRadius: 999,
        border: `1px solid ${border}`,
        background: bg,
        color,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {done ? "✓ " : ""}
      {label}
    </span>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--color-ink-700)",
  marginBottom: 8,
  letterSpacing: "-0.005em",
};

const btnPrimaryFull: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: 48,
  padding: "0 22px",
  borderRadius: 999,
  background: "var(--color-ink-900)",
  color: "#fff",
  border: "1px solid var(--color-ink-900)",
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
};
