"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { formatPhone } from "@/lib/format";

interface Props {
  workerId: string;
  workerPhone: string;
  showFullPhone: boolean;
  canContact: boolean;
  isSelf: boolean;
  initialSaved?: boolean;
}

export default function WorkerContactCard({
  workerId,
  workerPhone,
  showFullPhone,
  canContact,
  isSelf,
  initialSaved = false,
}: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [savingBusy, setSavingBusy] = useState(false);

  async function toggleSaved() {
    if (savingBusy) return;
    const next = !saved;
    setSaved(next);
    setSavingBusy(true);
    try {
      const res = await fetch("/api/saved-profiles", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedUserId: workerId }),
      });
      if (!res.ok) {
        setSaved(!next);
      }
    } catch {
      setSaved(!next);
    } finally {
      setSavingBusy(false);
    }
  }

  if (isSelf) {
    return (
      <div style={cardStyle}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Bu profil sana ait
        </div>
        <Link href="/panel/profil" style={btnPrimaryFull}>
          Profilini düzenle
        </Link>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        İletişim
      </div>

      {showFullPhone ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--color-ink-900)",
            }}
          >
            <Icon name="phone" size={16} />
            <span
              className="font-mono"
              style={{ fontSize: 16, letterSpacing: "0.02em" }}
            >
              {formatPhone(workerPhone)}
            </span>
          </div>
          <a
            href={`tel:${workerPhone.replace(/\s/g, "")}`}
            style={{ ...btnAccentFull, marginTop: 18 }}
          >
            Şimdi ara
          </a>
          {canContact && (
            <button
              onClick={() => router.push(`/panel/mesajlar/${workerId}`)}
              style={{ ...btnSecondaryFull, marginTop: 8 }}
            >
              Mesaj gönder
            </button>
          )}
          {!canContact && (
            <Link href="/kayit" style={{ ...btnSecondaryFull, marginTop: 8 }}>
              Mesaj göndermek için kayıt ol
            </Link>
          )}
        </>
      ) : (
        <>
          {canContact ? (
            <button
              onClick={() => router.push(`/panel/mesajlar/${workerId}`)}
              style={btnPrimaryFull}
            >
              Mesaj gönder
            </button>
          ) : (
            <Link href="/kayit" style={btnPrimaryFull}>
              Ücretsiz kayıt — mesajlaş
            </Link>
          )}
          <p
            style={{
              marginTop: 12,
              fontSize: 12.5,
              color: "var(--color-ink-500)",
              lineHeight: 1.5,
            }}
          >
            Bu profil sadece platform içi mesajlaşma kabul ediyor. Telefon, profil sahibinin tercihiyle paylaşılmıyor.
          </p>
        </>
      )}

      {canContact && (
        <>
          <div className="divider" style={{ margin: "20px 0" }} />
          <button
            onClick={toggleSaved}
            disabled={savingBusy}
            style={{
              width: "100%",
              background: "none",
              border: 0,
              padding: 8,
              font: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: saved
                ? "var(--color-accent-600)"
                : "var(--color-ink-500)",
              cursor: savingBusy ? "wait" : "pointer",
              fontSize: 14,
            }}
          >
            <Icon name={saved ? "bookmark-filled" : "bookmark"} size={15} />
            {saved ? "Kaydedildi" : "Profili kaydet"}
          </button>
        </>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: 24,
  background: "#fff",
  border: "1px solid var(--color-ink-100)",
  borderRadius: 14,
  boxShadow:
    "0 1px 0 rgba(15,17,16,.02), 0 8px 24px -12px rgba(15,17,16,.10)",
};

const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  height: 48,
  padding: "0 22px",
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 500,
  letterSpacing: "-0.005em",
  whiteSpace: "nowrap",
  cursor: "pointer",
  textDecoration: "none",
  border: "1px solid transparent",
};

const btnPrimaryFull: React.CSSProperties = {
  ...btnBase,
  background: "var(--color-ink-900)",
  color: "#fff",
  borderColor: "var(--color-ink-900)",
};

const btnAccentFull: React.CSSProperties = {
  ...btnBase,
  background: "var(--color-accent-600)",
  color: "#fff",
  borderColor: "var(--color-accent-600)",
};

const btnSecondaryFull: React.CSSProperties = {
  ...btnBase,
  background: "transparent",
  color: "var(--color-ink-900)",
  borderColor: "var(--color-ink-200)",
};
