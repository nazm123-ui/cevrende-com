import Link from "next/link";
import { formatPhone, formatRelative } from "@/lib/format";
import { canSeePhone } from "@/lib/phone-visibility";
import type { WorkerListItem } from "@/lib/workers";

type Props = {
  worker: WorkerListItem;
  categoryNameBySlug: Map<string, string>;
  canContact: boolean;
  isSelf: boolean;
};

export default function WorkerCard({
  worker,
  categoryNameBySlug,
  canContact,
  isSelf,
}: Props) {
  const settings = worker.workerSettings;

  const location =
    settings.showDistrict && worker.neighborhood
      ? `${worker.neighborhood}, ${worker.district}`
      : worker.district;

  const showFullPhone = canSeePhone(settings);

  const professionNames = worker.professions
    .map((slug) => categoryNameBySlug.get(slug) ?? slug)
    .slice(0, 3);

  const initials = getInitials(worker.fullName);

  return (
    <article
      style={{
        padding: "22px 26px",
        background: "#fff",
        border: "1px solid var(--color-ink-100)",
        borderRadius: 14,
        transition: "border-color .15s ease",
      }}
      className="hover:!border-ink-900"
    >
      {/* Üst meta */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--color-ink-500)",
            fontSize: 13,
            flexWrap: "wrap",
          }}
        >
          <span className="font-mono">{formatRelative(worker.createdAt)}</span>
          <span style={{ color: "var(--color-ink-400)" }}>·</span>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <PinIcon /> {location}
          </span>
        </div>
        {!showFullPhone && (
          <span style={{ fontSize: 12, color: "var(--color-ink-400)" }}>
            Sadece mesaj
          </span>
        )}
      </div>

      {/* Avatar + name + bio + chips — tıklanır alan, profile gider */}
      <Link
        href={`/cevrendekiler/${worker.id}`}
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#F4F2EB",
            color: "var(--color-ink-900)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            flex: "0 0 52px",
            border: "1px solid var(--color-ink-200)",
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "-0.015em",
              color: "var(--color-ink-900)",
              margin: 0,
            }}
          >
            {worker.fullName}
          </h3>
          {worker.bio && (
            <p
              style={{
                fontSize: 14,
                color: "var(--color-ink-500)",
                marginTop: 4,
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {worker.bio}
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            {professionNames.map((name) => (
              <span
                key={name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 26,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: "#F4F2EB",
                  fontSize: 12,
                  color: "var(--color-ink-700)",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div
        style={{
          height: 1,
          background: "var(--color-ink-100)",
          margin: "20px 0 16px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {renderAction({
          canContact,
          isSelf,
          worker,
          showFullPhone,
        })}
      </div>
    </article>
  );
}

function getInitials(name: string): string {
  const cleaned = name.replace(/\*+/g, "").trim();
  if (!cleaned) return "··";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const btnPrimarySm: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  height: 36,
  padding: "0 14px",
  borderRadius: 999,
  background: "var(--color-ink-900)",
  color: "#fff",
  border: "1px solid var(--color-ink-900)",
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: "-0.005em",
  whiteSpace: "nowrap",
  cursor: "pointer",
  textDecoration: "none",
};

const btnSecondarySm: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  height: 36,
  padding: "0 14px",
  borderRadius: 999,
  background: "transparent",
  color: "var(--color-ink-900)",
  border: "1px solid var(--color-ink-200)",
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: "-0.005em",
  whiteSpace: "nowrap",
  cursor: "pointer",
  textDecoration: "none",
};

function renderAction({
  canContact,
  isSelf,
  worker,
  showFullPhone,
}: {
  canContact: boolean;
  isSelf: boolean;
  worker: WorkerListItem;
  showFullPhone: boolean;
}) {
  if (isSelf) {
    return (
      <Link
        href="/panel/profil"
        style={{
          fontSize: 13,
          color: "var(--color-ink-500)",
          textDecoration: "none",
        }}
      >
        Profilini düzenle →
      </Link>
    );
  }

  if (!canContact) {
    return (
      <Link href="/kayit" style={btnPrimarySm}>
        Ücretsiz kayıt ol
      </Link>
    );
  }

  return (
    <>
      <Link href={`/panel/mesajlar/${worker.id}`} style={btnSecondarySm}>
        Mesaj gönder
      </Link>
      {showFullPhone && (
        <a href={`tel:${worker.phone}`} style={btnPrimarySm}>
          <PhoneIcon /> {formatPhone(worker.phone)}
        </a>
      )}
    </>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--color-ink-400)" }}
    >
      <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}
