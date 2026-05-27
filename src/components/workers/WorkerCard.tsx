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
    <article className="px-6 py-5 bg-white border border-ink-100 rounded-[14px] transition hover:border-ink-700">
      <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
        <div className="flex items-center gap-2 text-ink-500 text-[13px] flex-wrap">
          <span className="font-mono">{formatRelative(worker.createdAt)}</span>
          <span className="text-ink-400">·</span>
          <span className="inline-flex items-center gap-1">
            <PinIcon /> {location}
          </span>
        </div>
        {!showFullPhone && (
          <span className="text-[12px] text-ink-500">Sadece mesaj</span>
        )}
      </div>

      <Link
        href={`/cevrendekiler/${worker.id}`}
        className="flex gap-4 items-start rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-50 border border-ink-200 text-ink-900 text-[18px] font-medium tracking-[-0.01em] shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] font-medium tracking-[-0.015em] text-ink-900 m-0">
            {worker.fullName}
          </h3>
          {worker.bio && (
            <p
              className="text-[14px] text-ink-500 mt-1 leading-[1.5]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {worker.bio}
            </p>
          )}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {professionNames.map((name) => (
              <span
                key={name}
                className="inline-flex items-center h-[26px] px-2.5 rounded-full bg-brand-50 text-[12px] text-ink-700"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="h-px bg-ink-100 mt-5 mb-4" />

      <div className="flex justify-end gap-2.5 flex-wrap items-center">
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
        className="text-[13px] text-ink-500 hover:text-ink-900 transition"
      >
        Profilini düzenle →
      </Link>
    );
  }

  if (!canContact) {
    return (
      <Link
        href="/kayit"
        className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-full bg-ink-900 text-white border border-ink-900 text-[13px] font-medium hover:bg-accent-600 hover:border-accent-600 transition"
      >
        Ücretsiz kayıt ol
      </Link>
    );
  }

  return (
    <>
      <Link
        href={`/panel/mesajlar/${worker.id}`}
        className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-full border border-ink-200 text-ink-900 text-[13px] font-medium hover:border-ink-900 transition"
      >
        Mesaj gönder
      </Link>
      {showFullPhone && (
        <a
          href={`tel:${worker.phone}`}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-full bg-ink-900 text-white border border-ink-900 text-[13px] font-medium hover:bg-accent-600 hover:border-accent-600 transition"
        >
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
      className="text-ink-400"
    >
      <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}
