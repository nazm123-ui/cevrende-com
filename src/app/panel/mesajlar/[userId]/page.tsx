import Link from "next/link";
import { notFound } from "next/navigation";
import { requireVerifiedUser } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { getThread, markThreadAsRead } from "@/lib/messages";
import { canMessageWorker, hasEstablishedContact } from "@/lib/contact-requests";
import { maskName } from "@/lib/masking";
import { formatPhone } from "@/lib/format";
import { canSeePhone, type WorkerSettings as WS } from "@/lib/phone-visibility";
import ChatThread, { type ChatMessage } from "@/components/messages/ChatThread";

type WorkerSettings = WS & { showName?: boolean };

export const metadata = { title: "Sohbet — Cevrende.com" };

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId: otherUserId } = await params;
  const me = await requireVerifiedUser();

  if (otherUserId === me.id) notFound();

  const other = await prisma.user.findUnique({
    where: { id: otherUserId },
    select: {
      id: true,
      fullName: true,
      phone: true,
      professions: true,
      isActive: true,
      workerSettings: true,
    },
  });
  if (!other || !other.isActive) notFound();

  const otherIsWorker = other.professions.length > 0;

  if (otherIsWorker) {
    const allowed = await canMessageWorker(me.id, otherUserId);
    if (!allowed) {
      return (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <h1 className="text-lg font-semibold text-amber-900">
              Mesajlaşma henüz açılmadı
            </h1>
            <p className="mt-2 text-sm text-amber-800">
              Bu işçiyle mesajlaşmak için önce iletişim talebi gönder ve
              işçinin onayını bekle.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/iscilar"
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                İşçilere dön
              </Link>
              <Link
                href="/panel/talepler"
                className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-white"
              >
                Taleplerim
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  const settings = (other.workerSettings ?? {}) as WorkerSettings;

  const contactAccepted = await hasEstablishedContact(me.id, otherUserId);

  const displayName =
    otherIsWorker && !settings.showName && !contactAccepted
      ? maskName(other.fullName)
      : other.fullName;

  await markThreadAsRead(me.id, otherUserId);
  const messages = await getThread(me.id, otherUserId);

  const initial: ChatMessage[] = messages.map((m) => ({
    id: m.id,
    senderId: m.senderId,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    read: m.read,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/panel/mesajlar"
          className="text-sm text-brand-700 hover:underline"
        >
          ← Mesajlar
        </Link>
      </div>

      <header className="mb-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-ink-900">{displayName}</h1>
          {otherIsWorker && (
            <p className="text-xs text-ink-500">İşçi profili var</p>
          )}
        </div>
        {canSeePhone(settings, contactAccepted) && (
          <a
            href={`tel:${other.phone}`}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
          >
            📞 {formatPhone(other.phone)}
          </a>
        )}
      </header>

      <ChatThread
        currentUserId={me.id}
        otherUserId={otherUserId}
        initialMessages={initial}
      />
    </div>
  );
}
