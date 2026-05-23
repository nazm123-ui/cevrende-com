import Link from "next/link";
import { requireVerifiedUser } from "@/lib/require-auth";
import {
  getIncomingRequests,
  getOutgoingRequests,
} from "@/lib/contact-requests";
import { formatPhone } from "@/lib/format";
import IncomingRequestActions from "@/components/requests/IncomingRequestActions";

export const metadata = { title: "İletişim Talepleri — Cevrende.com" };

export default async function TaleplerPage() {
  const user = await requireVerifiedUser();

  const [incoming, outgoing] = await Promise.all([
    getIncomingRequests(user.id),
    getOutgoingRequests(user.id),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          İletişim Talepleri
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Sana gelen teklifler ve gönderdiğin talepler.
        </p>
      </header>

      <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
            Gelen Talepler
          </h2>

          {incoming.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center text-sm text-ink-500">
              Henüz sana gelen talep yok.
            </p>
          ) : (
            <ul className="space-y-3">
              {incoming.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-900">
                        {r.fromUserName}
                      </p>
                      <p className="text-xs text-ink-500">
                        {r.fromUserNeighborhood
                          ? `${r.fromUserNeighborhood}, ${r.fromUserDistrict}`
                          : r.fromUserDistrict}{" "}
                        ·{" "}
                        {new Intl.DateTimeFormat("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  {r.message && (
                    <p className="mt-3 rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-700 whitespace-pre-wrap break-words">
                      {r.message}
                    </p>
                  )}

                  {r.status === "pending" && (
                    <div className="mt-3 flex justify-end">
                      <IncomingRequestActions requestId={r.id} />
                    </div>
                  )}

                  {r.status === "accepted" && (
                    <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                      {r.fromUserPhone && (
                        <a
                          href={`tel:${r.fromUserPhone}`}
                          className="inline-flex items-center h-9 px-4 rounded-full border border-ink-200 text-[13px] font-mono text-ink-900 hover:border-ink-900 transition"
                        >
                          📞 {formatPhone(r.fromUserPhone)}
                        </a>
                      )}
                      <Link
                        href={`/panel/mesajlar/${r.fromUserId}`}
                        className="btn-ink h-9 px-4 rounded-full text-[13px]"
                      >
                        💬 Sohbeti aç
                      </Link>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
          Gönderdiğim Talepler
        </h2>

        {outgoing.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center text-sm text-ink-500">
            Henüz talep göndermedin.{" "}
            <Link href="/iscilar" className="font-semibold text-brand-700 hover:underline">
              Çevrendekileri keşfet →
            </Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {outgoing.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900">{r.toWorkerName}</p>
                    <p className="text-xs text-ink-500">
                      {new Intl.DateTimeFormat("tr-TR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                {r.message && (
                  <p className="mt-3 rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-700 whitespace-pre-wrap break-words">
                    {r.message}
                  </p>
                )}

                {r.status === "accepted" && (
                  <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                    {r.toWorkerPhone && (
                      <a
                        href={`tel:${r.toWorkerPhone}`}
                        className="inline-flex items-center h-9 px-4 rounded-full border border-ink-200 text-[13px] font-mono text-ink-900 hover:border-ink-900 transition"
                      >
                        📞 {formatPhone(r.toWorkerPhone)}
                      </a>
                    )}
                    <Link
                      href={`/panel/mesajlar/${r.toWorkerId}`}
                      className="btn-ink h-9 px-4 rounded-full text-[13px]"
                    >
                      💬 Mesajlaş
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "pending") {
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        ⏳ Bekliyor
      </span>
    );
  }
  if (status === "accepted") {
    return (
      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
        ✓ Kabul edildi
      </span>
    );
  }
  return (
    <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">
      Reddedildi
    </span>
  );
}
