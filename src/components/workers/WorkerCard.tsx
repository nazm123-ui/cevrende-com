import Link from "next/link";
import { maskName, maskPhone } from "@/lib/masking";
import { formatPhone, formatRelative } from "@/lib/format";
import { canSeePhone, getPhoneVisibility } from "@/lib/phone-visibility";
import type { WorkerListItem } from "@/lib/workers";
import type { ContactRequestStatus } from "@/lib/contact-requests";
import ContactRequestButton from "@/components/workers/ContactRequestButton";

type Props = {
  worker: WorkerListItem;
  categoryNameBySlug: Map<string, string>;
  canContact: boolean;
  requestStatus: ContactRequestStatus | null;
  isSelf: boolean;
};

export default function WorkerCard({
  worker,
  categoryNameBySlug,
  canContact,
  requestStatus,
  isSelf,
}: Props) {
  const settings = worker.workerSettings;
  const accepted = requestStatus === "accepted";

  // Logged-out: always mask name regardless of showName
  const displayName = canContact
    ? settings.showName || accepted
      ? worker.fullName
      : maskName(worker.fullName)
    : maskName(worker.fullName);

  const location =
    settings.showDistrict && worker.neighborhood
      ? `${worker.neighborhood}, ${worker.district}`
      : worker.district;

  const phoneVisibility = getPhoneVisibility(settings);
  const showFullPhoneInline = canContact && canSeePhone(settings, accepted);
  // Logged-out: only show masked phone preview if worker is public
  const showTeaserPhone = !canContact && phoneVisibility === "public";

  const professionNames = worker.professions
    .map((slug) => categoryNameBySlug.get(slug) ?? slug)
    .slice(0, 5);

  return (
    <article className="group bg-white border border-ink-100 rounded-[14px] p-6 hover:border-ink-700 transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
          <span className="font-mono">{formatRelative(worker.createdAt)}</span>
          <span className="text-ink-300">·</span>
          <span className="inline-flex items-center gap-1">
            <PinIcon /> {location}
          </span>
        </div>
        {showFullPhoneInline ? (
          <a
            href={`tel:${worker.phone}`}
            className="font-mono text-[12.5px] text-ink-900 hover:text-accent-600 transition"
          >
            {formatPhone(worker.phone)}
          </a>
        ) : showTeaserPhone ? (
          <span className="font-mono text-[12.5px] text-ink-400">
            {maskPhone(worker.phone)}
          </span>
        ) : (
          <span className="text-[12px] text-ink-400">
            {phoneVisibility === "private"
              ? "Sadece mesaj"
              : "Onay sonrası"}
          </span>
        )}
      </div>

      <h3 className="text-[18px] font-medium tracking-[-0.012em] text-ink-900">
        {displayName}
      </h3>

      {worker.bio && canContact && (
        <p className="mt-2 text-[14.5px] text-ink-500 leading-relaxed line-clamp-2">
          {worker.bio}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {professionNames.map((name) => (
          <span
            key={name}
            className="inline-flex items-center h-7 px-3 rounded-full bg-[#f4f2eb] text-[12.5px] text-ink-700"
          >
            {name}
          </span>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-end">
        {renderAction({ canContact, isSelf, requestStatus, worker })}
      </div>
    </article>
  );
}

function renderAction({
  canContact,
  isSelf,
  requestStatus,
  worker,
}: {
  canContact: boolean;
  isSelf: boolean;
  requestStatus: ContactRequestStatus | null;
  worker: WorkerListItem;
}) {
  if (isSelf) {
    return (
      <Link
        href="/panel/profil"
        className="text-[13.5px] text-ink-500 hover:text-ink-900 transition"
      >
        Profilini düzenle →
      </Link>
    );
  }
  if (!canContact) {
    return (
      <Link
        href="/kayit"
        className="btn-ink h-9 px-4 rounded-full text-[13px]"
      >
        Detayları gör · Ücretsiz kayıt
      </Link>
    );
  }
  if (requestStatus === "accepted") {
    return (
      <Link
        href={`/panel/mesajlar/${worker.id}`}
        className="btn-ink h-9 px-4 rounded-full text-[13px]"
      >
        Mesaj gönder
      </Link>
    );
  }
  if (requestStatus === "pending") {
    return (
      <span className="text-[13px] text-ink-500">⏳ Onay bekleniyor</span>
    );
  }
  if (requestStatus === "declined") {
    return <span className="text-[13px] text-ink-400">Talep reddedildi</span>;
  }
  return <ContactRequestButton workerId={worker.id} />;
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
