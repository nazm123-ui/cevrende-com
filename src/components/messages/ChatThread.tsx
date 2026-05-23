"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
};

type Props = {
  currentUserId: string;
  otherUserId: string;
  initialMessages: ChatMessage[];
};

export default function ChatThread({
  currentUserId,
  otherUserId,
  initialMessages,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: otherUserId, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Mesaj gönderilemedi.");
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: data.message.id,
          senderId: data.message.senderId,
          content: data.message.content,
          createdAt: data.message.createdAt,
          read: data.message.read,
        },
      ]);
      setDraft("");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] min-h-[400px] rounded-2xl border border-ink-100 bg-white shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-ink-500 mt-8">
            Henüz mesaj yok. İlk mesajı sen gönder.
          </p>
        ) : (
          messages.map((m) => {
            const fromMe = m.senderId === currentUserId;
            return (
              <div
                key={m.id}
                className={`flex ${fromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    fromMe
                      ? "bg-ink-900 rounded-br-sm"
                      : "bg-ink-100 text-ink-900 rounded-bl-sm"
                  }`}
                  style={fromMe ? { color: "#ffffff" } : undefined}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {m.content}
                  </p>
                  <p
                    className={`mt-1 text-[10px] ${
                      fromMe ? "" : "text-ink-500"
                    }`}
                    style={fromMe ? { color: "rgba(255,255,255,0.65)" } : undefined}
                  >
                    {formatTime(new Date(m.createdAt))}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="px-4 py-2 text-xs text-red-700 bg-red-50 border-t border-red-200">
          {error}
        </p>
      )}

      <form
        onSubmit={onSubmit}
        className="flex items-end gap-2 border-t border-ink-100 p-3 bg-ink-50"
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Mesajını yaz..."
          rows={1}
          maxLength={2000}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e as unknown as React.FormEvent);
            }
          }}
          className="flex-1 resize-none rounded-[12px] border border-ink-200 bg-white px-3.5 py-2.5 text-[14.5px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5 max-h-32"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="btn-ink h-10 px-5 rounded-full text-[14px]"
        >
          {sending ? "..." : "Gönder"}
        </button>
      </form>
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
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
