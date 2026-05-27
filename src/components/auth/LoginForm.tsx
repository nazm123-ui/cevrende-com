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
        <h4
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 4,
            color: "var(--color-ink-900)",
          }}
        >
          Hesabını Doğrula
        </h4>
        <p
          style={{
            fontSize: 13.5,
            color: "var(--color-ink-500)",
            marginBottom: 20,
          }}
        >
          Devam etmek için eksik doğrulamaları tamamla.
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
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div>
        <label htmlFor="identifier" style={labelStyle}>
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
          style={inputStyle}
        />
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <label
            htmlFor="password"
            style={{ ...labelStyle, marginBottom: 0 }}
          >
            Şifre
          </label>
          <Link
            href="/sifre-sifirla"
            style={{
              fontSize: 12.5,
              color: "var(--color-ink-500)",
              textDecoration: "none",
            }}
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
          style={inputStyle}
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

      <button
        type="submit"
        disabled={loading}
        style={{
          ...btnPrimaryFull,
          marginTop: 8,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          color: "var(--color-ink-500)",
          margin: "8px 0 0",
        }}
      >
        Hesabın yok mu?{" "}
        <Link
          href="/kayit"
          style={{
            color: "var(--color-ink-900)",
            fontWeight: 500,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Kayıt ol
        </Link>
      </p>
    </form>
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid var(--color-ink-200)",
  background: "#fff",
  color: "var(--color-ink-900)",
  fontSize: 15,
  outline: "none",
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
