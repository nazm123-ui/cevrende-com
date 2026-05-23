import Link from "next/link";
import { requireVerifiedUser } from "@/lib/require-auth";
import { getConversations } from "@/lib/messages";

export const metadata = { title: "Mesajlar — Cevrende.com" };

export default async function MesajlarPage() {
  const user = await requireVerifiedUser();
  const conversations = await getConversations(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
        Mesajlar
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Platform içi mesajlaşma. Numaranı paylaşmadan iletişim kurabilirsin.
      </p>

      <div className="mt-6">
        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <p className="text-base font-medium text-ink-900">
              Henüz mesajın yok.
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Çevrendekiler sayfasından bir profili açıp mesaj göndererek
              iletişime geçebilirsin.
            </p>
            <Link
              href="/iscilar"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 transition"
            >
              Çevrendekileri İncele
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white shadow-sm overflow-hidden">
            {conversations.map((c) => (
              <li key={c.otherUserId}>
                <Link
                  href={`/panel/mesajlar/${c.otherUserId}`}
                  className="flex items-start gap-3 p-4 hover:bg-ink-50 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-semibold text-ink-900 truncate">
                        {c.otherUserName}
                      </p>
                      <span className="text-xs text-ink-500 shrink-0">
                        {formatTime(c.lastMessageAt)}
                      </span>
                    </div>
                    <p
                      className={`mt-0.5 text-sm truncate ${
                        c.unreadCount > 0 && !c.lastMessageFromMe
                          ? "font-semibold text-ink-900"
                          : "text-ink-500"
                      }`}
                    >
                      {c.lastMessageFromMe && "Sen: "}
                      {c.lastMessage}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}
