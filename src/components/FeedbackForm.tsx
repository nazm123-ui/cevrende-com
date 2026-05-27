"use client";

import { useState } from "react";

type Topic = "bug" | "suggestion" | "other";

export default function FeedbackForm({
  defaultEmail = "",
}: {
  defaultEmail?: string;
}) {
  const [topic, setTopic] = useState<Topic>("suggestion");
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gönderilemedi.");
        return;
      }
      setSent(true);
      setMessage("");
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div
        style={{
          padding: "32px 28px",
          border: "1px solid var(--color-ink-100)",
          borderRadius: 14,
          background: "#fff",
          textAlign: "center",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Teşekkürler
        </div>
        <h3 style={{ margin: "0 0 8px" }}>Geri bildirimin alındı</h3>
        <p
          style={{
            color: "var(--color-ink-500)",
            fontSize: 14.5,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Ekibimiz mesajını okuyacak. Eğer cevap gerekiyorsa belirttiğin
          e-postadan dönüş yapacağız.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 20 }}
        >
          Yeni bildirim gönder
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        padding: 28,
        border: "1px solid var(--color-ink-100)",
        borderRadius: 14,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 8,
            color: "var(--color-ink-900)",
          }}
        >
          Konu
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {([
            ["bug", "Hata bildirimi"],
            ["suggestion", "Öneri"],
            ["other", "Diğer"],
          ] as const).map(([key, label]) => {
            const active = topic === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTopic(key)}
                style={{
                  height: 36,
                  padding: "0 16px",
                  borderRadius: 999,
                  border: active
                    ? "1px solid var(--color-ink-900)"
                    : "1px solid var(--color-ink-200)",
                  background: active ? "var(--color-ink-900)" : "transparent",
                  color: active ? "#fff" : "var(--color-ink-900)",
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="fb-email"
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 6,
            color: "var(--color-ink-900)",
          }}
        >
          E-posta
        </label>
        <input
          id="fb-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@email.com"
          style={{
            width: "100%",
            height: 44,
            padding: "0 14px",
            border: "1px solid var(--color-ink-200)",
            borderRadius: 10,
            fontSize: 14.5,
            background: "#fff",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="fb-msg"
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 6,
            color: "var(--color-ink-900)",
          }}
        >
          Mesaj
        </label>
        <textarea
          id="fb-msg"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          placeholder="Detayları yaz: ne yapmaya çalıştın, ne oldu, ne beklemiştin..."
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid var(--color-ink-200)",
            borderRadius: 10,
            fontSize: 14.5,
            background: "#fff",
            resize: "vertical",
            fontFamily: "inherit",
            lineHeight: 1.55,
          }}
        />
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 12,
            color: "var(--color-ink-400)",
          }}
        >
          {message.length}/2000
        </p>
      </div>

      {error && (
        <p
          style={{
            margin: 0,
            padding: "10px 14px",
            background: "rgba(178, 58, 58, 0.08)",
            border: "1px solid rgba(178, 58, 58, 0.2)",
            borderRadius: 10,
            color: "#B23A3A",
            fontSize: 13.5,
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || message.trim().length < 10}
        className="btn btn-primary"
        style={{
          height: 48,
          opacity: loading || message.trim().length < 10 ? 0.5 : 1,
          cursor:
            loading || message.trim().length < 10 ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
