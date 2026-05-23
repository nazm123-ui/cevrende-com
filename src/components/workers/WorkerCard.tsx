import Link from "next/link";
import { maskName } from "@/lib/masking";
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

  // Name: worker's showName decision applies to everyone (logged in or out).
  // After acceptance, name is also revealed.
  const displayName =
    settings.showName || accepted
      ? worker.fullName
      : maskName(worker.fullName);

  const location =
    settings.showDistrict && worker.neighborhood
      ? `${worker.neighborhood}, ${worker.district}`
      : worker.district;

  const phoneVisibility = getPhoneVisibility(settings);
  // Phone follows the worker's choice:
  // - "public": always visible (also to non-members — urgent jobs)
  // - "after_approval": only after accepted contact (requires login)
  // - "private": never
  const showFullPhone = canSeePhone(settings, accepted);

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
        {!showFullPhone && (
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

      {worker.bio && (
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

      <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-end gap-2">
        {renderAction({
          canContact,
          isSelf,
          requestStatus,
          worker,
          showFullPhone,
        })}
      </div>
    </article>
  );
}

function renderAction({
  canContact,
  isSelf,
  requestStatus,
  worker,
  showFullPhone,
}: {
  canContact: boolean;
  isSelf: boolean;
  requestStatus: ContactRequestStatus | null;
  worker: WorkerListItem;
  showFullPhone: boolean;
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

  // Public phone (or revealed via acceptance): phone number becomes the primary CTA
  if (showFullPhone) {
    return (
      <>
        {renderSecondary({ canContact, requestStatus, worker })}
        <a
          href={`tel:${worker.phone}`}
          className="btn-ink h-9 px-4 rounded-full text-[13px] font-mono tracking-tight"
        >
          <PhoneIcon /> {formatPhone(worker.phone)}
        </a>
      </>
    );
  }

  // Phone not public — fall back to messaging-first flow
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

function renderSecondary({
  canContact,
  requestStatus,
  worker,
}: {
  canContact: boolean;
  requestStatus: ContactRequestStatus | null;
  worker: WorkerListItem;
}) {
  const outlineCls =
    "inline-flex items-center h-9 px-4 rounded-full border border-ink-200 text-[13px] font-medium text-ink-900 hover:border-ink-900 transition";

  if (!canContact) {
    return (
      <Link href="/kayit" className={outlineCls}>
        Mesajlaş · Kayıt
      </Link>
    );
  }
  if (requestStatus === "accepted") {
    return (
      <Link href={`/panel/mesajlar/${worker.id}`} className={outlineCls}>
        Mesaj gönder
      </Link>
    );
  }
  if (requestStatus === "pending") {
    return (
      <span className="text-[12.5px] text-ink-500">⏳ Onay bekleniyor</span>
    );
  }
  if (requestStatus === "declined") {
    return null;
  }
  return (
    <ContactRequestButton
      workerId={worker.id}
      variant="outline"
      label="Mesajlaş"
    />
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
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
