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
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ fontSize: 28, margin: 0 }}>✓</p>
        <p
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--color-ink-900)",
            marginTop: 10,
            marginBottom: 4,
          }}
        >
          Şifren başarıyla değiştirildi.
        </p>
        <p style={{ fontSize: 13.5, color: "var(--color-ink-500)" }}>
          Giriş sayfasına yönlendiriliyorsun…
        </p>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <form
        onSubmit={resetPassword}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div
          style={{
            borderRadius: 12,
            border: "1px solid var(--color-ink-100)",
            background: "#F4F2EB",
            padding: "12px 14px",
          }}
        >
          <p
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              color: "var(--color-ink-900)",
              margin: 0,
            }}
          >
            {email}
          </p>
          <p
            style={{
              marginTop: 4,
              fontSize: 12.5,
              color: "var(--color-ink-500)",
            }}
          >
            adresine 6 haneli kod gönderildi. 10 dakika geçerli.
          </p>
          {devCode && (
            <p
              className="font-mono"
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "var(--color-accent-600)",
              }}
            >
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

        {error && <ErrorBlock>{error}</ErrorBlock>}

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
          style={{
            background: "none",
            border: 0,
            padding: 8,
            font: "inherit",
            cursor: "pointer",
            color: "var(--color-ink-500)",
            fontSize: 13.5,
            textAlign: "center",
            width: "100%",
          }}
        >
          ← Farklı bir e-posta dene
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={requestReset}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <Field
        label="E-posta"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        placeholder="ornek@mail.com"
      />

      {error && <ErrorBlock>{error}</ErrorBlock>}

      <button
        type="submit"
        disabled={loading || !email}
        style={{
          ...btnPrimaryFull,
          marginTop: 8,
          opacity: loading || !email ? 0.5 : 1,
          cursor: loading || !email ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Gönderiliyor..." : "Sıfırlama Kodu Gönder"}
      </button>

      <div
        style={{
          height: 1,
          background: "var(--color-ink-100)",
          margin: "10px 0",
        }}
      />

      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          color: "var(--color-ink-500)",
          margin: 0,
        }}
      >
        Hatırladın mı?{" "}
        <Link
          href="/giris"
          style={{
            color: "var(--color-ink-900)",
            fontWeight: 500,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Giriş yap
        </Link>
      </p>
    </form>
  );
}

function ErrorBlock({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </p>
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
      <label htmlFor={name} style={labelStyle}>
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
        style={inputStyle}
      />
      {hint && (
        <p
          style={{
            marginTop: 6,
            fontSize: 12.5,
            color: "var(--color-ink-500)",
          }}
        >
          {hint}
        </p>
      )}
    </div>
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
