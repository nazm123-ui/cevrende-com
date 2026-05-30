"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import OtpForm from "./OtpForm";
import Spinner from "@/components/ui/Spinner";

type EnabledDistrict = {
  slug: string;
  name: string;
  neighborhoods: string[];
};

type Props = {
  districts: EnabledDistrict[];
};

export default function RegisterForm({ districts }: Props) {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [userId, setUserId] = useState<string>("");
  const [devEmailOtp, setDevEmailOtp] = useState<string | undefined>();

  const singleDistrict = districts.length === 1 ? districts[0] : null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [districtSlug, setDistrictSlug] = useState(singleDistrict?.slug ?? "");
  const [neighborhood, setNeighborhood] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const activeNeighborhoods = useMemo(() => {
    const d = districts.find((x) => x.slug === districtSlug);
    return d ? d.neighborhoods : [];
  }, [districts, districtSlug]);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          confirmPassword,
          districtSlug,
          neighborhood,
          acceptTerms,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.issues) {
          setFieldErrors(data.issues);
          setError(null);
        } else {
          setError(data.error || "Kayıt başarısız.");
        }
        return;
      }
      setUserId(data.userId);
      setDevEmailOtp(data.devEmailOtp);
      setStep("otp");
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    const emailMasked = maskEmail(email);
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
            lineHeight: 1.55,
          }}
        >
          E-postana 6 haneli doğrulama kodu gönderildi.
        </p>
        <OtpForm
          userId={userId}
          emailMasked={emailMasked}
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
      <Field
        label="Ad Soyad"
        name="fullName"
        value={fullName}
        onChange={setFullName}
        autoComplete="name"
        placeholder="Örn: Ahmet Yılmaz"
        errors={fieldErrors.fullName}
      />

      <div className="register-email-phone-grid">
        <Field
          label="E-posta"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="ornek@mail.com"
          errors={fieldErrors.email}
        />
        <Field
          label="Telefon"
          name="phone"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="0555 555 55 55"
          autoComplete="tel"
          errors={fieldErrors.phone}
          hint="+90, 0 veya 5 ile başlayabilir."
        />
      </div>

      {!singleDistrict && (
        <Field
          label="İlçe"
          name="districtSlug"
          type="select"
          value={districtSlug}
          onChange={(v) => {
            setDistrictSlug(v);
            setNeighborhood("");
          }}
          options={districts.map((d) => ({ value: d.slug, label: d.name }))}
          placeholder="İlçe seç"
          errors={fieldErrors.districtSlug}
        />
      )}

      <Field
        label="Mahalle"
        name="neighborhood"
        type="select"
        value={neighborhood}
        onChange={setNeighborhood}
        options={activeNeighborhoods.map((n) => ({ value: n, label: n }))}
        placeholder={districtSlug ? "Mahalle seç" : "Önce ilçe seç"}
        errors={fieldErrors.neighborhood}
        hint={
          singleDistrict
            ? "Yakındaki kişilerle eşleşmen kolaylaşır."
            : `${activeNeighborhoods.length} mahalle`
        }
      />

      <div>
        <Field
          label="Şifre"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          errors={fieldErrors.password}
        />
        <PasswordChecklist value={password} />
      </div>

      <Field
        label="Şifre tekrar"
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        errors={fieldErrors.confirmPassword}
      />

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          borderRadius: 12,
          border: "1px solid var(--color-ink-100)",
          background: "#FAFAF7",
          padding: "12px 14px",
          fontSize: 13.5,
          color: "var(--color-ink-700)",
          cursor: "pointer",
          lineHeight: 1.5,
        }}
      >
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          style={{
            marginTop: 3,
            height: 16,
            width: 16,
            flex: "0 0 16px",
            accentColor: "var(--color-accent-600)",
          }}
        />
        <span>
          <Link
            href="/kullanim-kosullari"
            style={{
              color: "var(--color-ink-900)",
              textDecoration: "underline",
            }}
          >
            Kullanım Koşulları
          </Link>
          'nı ve{" "}
          <Link
            href="/gizlilik"
            style={{
              color: "var(--color-ink-900)",
              textDecoration: "underline",
            }}
          >
            Gizlilik Politikası
          </Link>
          'nı kabul ediyorum.
        </span>
      </label>
      {fieldErrors.acceptTerms && (
        <p style={{ fontSize: 12, color: "#b91c1c", margin: 0 }}>
          {fieldErrors.acceptTerms[0]}
        </p>
      )}

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
        disabled={loading || !acceptTerms}
        className="mt-1 inline-flex items-center justify-center gap-2 w-full h-12 px-5 rounded-full bg-ink-900 text-white border border-ink-900 text-[15px] font-medium hover:bg-accent-600 hover:border-accent-600 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink-900 disabled:hover:border-ink-900"
      >
        {loading && <Spinner size={16} />}
        {loading ? "Hesap oluşturuluyor..." : "Hesap oluştur"}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          color: "var(--color-ink-500)",
          margin: "8px 0 0",
        }}
      >
        Zaten hesabın var mı?{" "}
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

function PasswordChecklist({ value }: { value: string }) {
  const rules = [
    { label: "En az 8 karakter", test: value.length >= 8 },
    {
      label: "1 büyük harf (Türkçe dahil)",
      test: /[A-ZĞÜŞİÖÇ]/.test(value),
    },
    { label: "1 sayı", test: /\d/.test(value) },
    {
      label: "1 noktalama veya özel karakter",
      test: /[^A-Za-z0-9ğüşıöçĞÜŞİÖÇ]/.test(value),
    },
  ];
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: "8px 0 0",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {rules.map((r) => (
        <li
          key={r.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12.5,
            color: r.test
              ? "var(--color-ink-900)"
              : "var(--color-ink-400)",
            transition: "color .12s ease",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              width: 12,
              justifyContent: "center",
              fontFamily: "monospace",
            }}
          >
            {r.test ? "✓" : "·"}
          </span>
          {r.label}
        </li>
      ))}
    </ul>
  );
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${local[1]}***@${domain}`;
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  errors?: string[];
  hint?: string;
  options?: { value: string; label: string }[];
};

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  errors,
  hint,
  options,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={name} style={labelStyle}>
        {label}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...inputStyle,
            borderColor: errors ? "#fca5a5" : "var(--color-ink-200)",
          }}
        >
          <option value="">{placeholder ?? "Seç"}</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            ...inputStyle,
            borderColor: errors ? "#fca5a5" : "var(--color-ink-200)",
          }}
        />
      )}
      {hint && !errors && (
        <p
          style={{
            marginTop: 6,
            fontSize: 12.5,
            color: "var(--color-ink-500)",
            lineHeight: 1.5,
          }}
        >
          {hint}
        </p>
      )}
      {errors && (
        <p
          style={{
            marginTop: 6,
            fontSize: 12.5,
            color: "#b91c1c",
          }}
        >
          {errors[0]}
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

