import Link from "next/link";
import { maskName } from "@/lib/masking";
import { formatPhone } from "@/lib/format";
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
  const displayName =
    settings.showName || accepted
      ? worker.fullName
      : maskName(worker.fullName);
  const location =
    settings.showDistrict && worker.neighborhood
      ? `${worker.neighborhood}, ${worker.district}`
      : worker.district;

  const showPhoneInline = canContact && canSeePhone(settings, accepted);
  const professionNames = worker.professions
    .map((slug) => categoryNameBySlug.get(slug) ?? slug)
    .slice(0, 5);

  return (
    <article className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-ink-900 truncate">
            {displayName}
          </h3>
          <p className="mt-0.5 text-xs text-ink-500">{location}</p>
        </div>
        {showPhoneInline ? (
          <a
            href={`tel:${worker.phone}`}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
          >
            📞 {formatPhone(worker.phone)}
          </a>
        ) : (
          <span className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-500">
            {getPhoneVisibility(settings) === "private"
              ? "Mesajla iletişim"
              : "Onay sonrası iletişim"}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {professionNames.map((name) => (
          <span
            key={name}
            className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
          >
            {name}
          </span>
        ))}
      </div>

      {worker.bio && (
        <p className="mt-3 text-sm text-ink-700 line-clamp-3">{worker.bio}</p>
      )}

      <div className="mt-4 flex justify-end">
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
      <span className="text-xs text-ink-500">Bu senin profilin</span>
    );
  }
  if (!canContact) {
    return (
      <Link
        href="/giris"
        className="text-sm font-semibold text-brand-700 hover:underline"
      >
        İletişim için giriş yap →
      </Link>
    );
  }
  if (requestStatus === "accepted") {
    return (
      <Link
        href={`/panel/mesajlar/${worker.id}`}
        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
      >
        💬 Mesaj Gönder
      </Link>
    );
  }
  if (requestStatus === "pending") {
    return (
      <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
        ⏳ Onay bekleniyor
      </span>
    );
  }
  if (requestStatus === "declined") {
    return (
      <span className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-500">
        Talep reddedildi
      </span>
    );
  }
  return <ContactRequestButton workerId={worker.id} />;
}
