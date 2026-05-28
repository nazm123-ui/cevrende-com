"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import ConfirmDialog from "./ConfirmDialog";

export type ConversationItem = {
  otherUserId: string;
  otherUserName: string;
  initials: string;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageFromMe: boolean;
  unreadCount: number;
};

export type ThreadMsg = {
  id: string;
  fromMe: boolean;
  content: string;
  createdAt: string;
};

type Props = {
  meId: string;
  conversations: ConversationItem[];
  activeUserId: string | null;
  activeMessages: ThreadMsg[];
};

export default function MessagesClient({
  meId,
  conversations,
  activeUserId,
  activeMessages,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"report" | "block" | null>(
    null,
  );
  const [blocked, setBlocked] = useState<Record<string, boolean>>({});
  const [reported, setReported] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimistic, setOptimistic] = useState<ThreadMsg[]>([]);
  const threadEnd = useRef<HTMLDivElement>(null);

  const activeConv = useMemo(
    () => conversations.find((c) => c.otherUserId === activeUserId) ?? null,
    [conversations, activeUserId],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.otherUserName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [conversations, search]);

  const allMessages = useMemo(
    () => [...activeMessages, ...optimistic],
    [activeMessages, optimistic],
  );

  useEffect(() => {
    setOptimistic([]);
    setDraft("");
    setError(null);
  }, [activeUserId]);

  useEffect(() => {
    threadEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const isBlocked = activeUserId ? blocked[activeUserId] : false;
  const wasReported = activeUserId ? reported[activeUserId] : false;

  async function send() {
    if (!activeUserId || !draft.trim() || isBlocked || sending) return;
    setSending(true);
    setError(null);
    const content = draft.trim();
    const tempId = `tmp-${Date.now()}`;
    setOptimistic((prev) => [
      ...prev,
      {
        id: tempId,
        fromMe: true,
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: activeUserId, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOptimistic((prev) => prev.filter((m) => m.id !== tempId));
        setError(data.error || "Mesaj gönderilemedi.");
        return;
      }
      router.refresh();
    } catch {
      setOptimistic((prev) => prev.filter((m) => m.id !== tempId));
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page">
      <section className="pt-8 pb-24">
        <div className="container">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="eyebrow mb-2.5">Mesajlar</div>
              <h2 className="text-[32px]">Sohbetlerim</h2>
            </div>
            <div className="text-sm text-muted">
              <span className="font-mono text-ink-700">
                {conversations.length}
              </span>{" "}
              aktif sohbet
            </div>
          </div>

          <div
            className="card msg-shell grid grid-cols-[320px_1fr] min-h-[560px] overflow-hidden p-0"
            data-mobile-showing-chat={String(!!activeUserId)}
          >
            {/* Chat list */}
            <div className="msg-list border-r border-ink-100 bg-[#FCFBF8]">
              <div className="px-[18px] pt-[18px] pb-[14px] border-b border-ink-100">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
                    <Icon name="search" size={16} />
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Sohbetlerde ara…"
                    className="w-full pl-9 h-[38px] border border-ink-100 bg-white text-[14px]"
                  />
                </div>
              </div>
              <div className="max-h-[520px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="px-[18px] py-10 text-center text-ink-500 text-[13.5px]">
                    {conversations.length === 0
                      ? "Henüz sohbetin yok."
                      : "Aramayla eşleşen sohbet yok."}
                  </div>
                ) : (
                  filtered.map((c) => {
                    const active = c.otherUserId === activeUserId;
                    return (
                      <button
                        key={c.otherUserId}
                        onClick={() => {
                          router.push(`/panel/mesajlar/${c.otherUserId}`);
                          setMenuOpen(false);
                        }}
                        className={`block w-full text-left px-[18px] py-4 border-0 border-b border-ink-100 cursor-pointer font-[inherit] border-l-2 ${
                          active
                            ? "bg-white border-l-accent-600"
                            : "bg-transparent border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar initials={c.initials} size={40} />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-2">
                              <div className="text-[14.5px] font-medium tracking-[-0.005em] whitespace-nowrap overflow-hidden text-ellipsis">
                                {c.otherUserName}
                              </div>
                              <div className="font-mono text-[11px] text-ink-500">
                                {formatRelative(c.lastMessageAt)}
                              </div>
                            </div>
                            <div
                              className={`mt-0.5 text-[13.5px] whitespace-nowrap overflow-hidden text-ellipsis ${
                                c.unreadCount
                                  ? "text-ink-900 font-medium"
                                  : "text-ink-500 font-normal"
                              }`}
                            >
                              {c.lastMessageFromMe ? "Sen: " : ""}
                              {c.lastMessage || "Yeni sohbet"}
                            </div>
                            {c.unreadCount > 0 && (
                              <div className="inline-flex mt-1.5 min-w-[18px] h-[18px] px-1.5 rounded-full bg-accent-600 text-white text-[11px] font-medium items-center justify-center">
                                {c.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Thread */}
            <div className="msg-thread flex flex-col min-w-0 min-h-[560px]">
              {!activeConv ? (
                <div className="flex-1 flex items-center justify-center p-8 text-ink-500 text-[14px] text-center">
                  {conversations.length === 0
                    ? "Henüz mesajlaşman yok. İşçi profilinden iletişim talebi gönder."
                    : "Bir sohbet seç."}
                </div>
              ) : (
                <>
                  <div className="relative px-[22px] py-4 border-b border-ink-100 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => router.push("/panel/mesajlar")}
                        className="msg-back hidden bg-transparent border-0 p-1 cursor-pointer text-ink-700"
                      >
                        ←
                      </button>
                      <button
                        onClick={() =>
                          router.push(
                            `/cevrendekiler/${activeConv.otherUserId}`,
                          )
                        }
                        className="flex items-center gap-3 bg-transparent border-0 p-0 cursor-pointer font-[inherit] text-left min-w-0"
                      >
                        <Avatar initials={activeConv.initials} size={40} />
                        <div className="min-w-0">
                          <div className="text-[15px] font-medium tracking-[-0.005em]">
                            {activeConv.otherUserName}
                          </div>
                          <div className="text-sm text-muted">
                            Profili görüntüle →
                          </div>
                        </div>
                      </button>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen((o) => !o)}
                        className="bg-transparent border border-ink-200 w-9 h-9 rounded-[10px] cursor-pointer flex items-center justify-center text-ink-700"
                        aria-label="Sohbet menüsü"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <circle cx="5" cy="12" r="1.7" />
                          <circle cx="12" cy="12" r="1.7" />
                          <circle cx="19" cy="12" r="1.7" />
                        </svg>
                      </button>
                      {menuOpen && (
                        <>
                          <div
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 z-10"
                          />
                          <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-ink-100 rounded-[12px] min-w-[200px] p-1.5 shadow-[0_1px_0_rgba(15,17,16,0.02),0_8px_24px_-12px_rgba(15,17,16,0.10)] z-20">
                            <MenuItem
                              onClick={() => {
                                setMenuOpen(false);
                                router.push(
                                  `/cevrendekiler/${activeConv.otherUserId}`,
                                );
                              }}
                            >
                              Profili görüntüle
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                setMenuOpen(false);
                                setConfirmType("report");
                              }}
                            >
                              Bildir
                            </MenuItem>
                            <MenuItem
                              danger
                              onClick={() => {
                                setMenuOpen(false);
                                setConfirmType("block");
                              }}
                            >
                              {isBlocked ? "Engeli kaldır" : "Kişiyi engelle"}
                            </MenuItem>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-[22px] py-6 bg-[#FCFBF8]">
                    <div className="flex flex-col gap-3.5">
                      {allMessages.length === 0 ? (
                        <div className="text-center text-[13.5px] text-ink-500 px-4 py-8">
                          Henüz mesaj yok. İlk mesajı sen at.
                        </div>
                      ) : (
                        allMessages.map((m) => <Bubble key={m.id} msg={m} />)
                      )}
                      {(wasReported || isBlocked) && (
                        <SystemNote>
                          {isBlocked
                            ? "Bu kişiyi engelledin. Yeni mesaj alıp gönderemezsin."
                            : "Bu kişiyi bildirdin. Ekibimiz inceleyecek."}
                        </SystemNote>
                      )}
                      <div ref={threadEnd} />
                    </div>
                  </div>

                  <div className="p-3.5 border-t border-ink-100 bg-white">
                    {error && (
                      <p className="m-0 mb-2 text-[13px] text-[#B23A3A]">
                        {error}
                      </p>
                    )}
                    <div className="flex gap-2.5 items-end">
                      <textarea
                        rows={1}
                        placeholder={
                          isBlocked ? "Bu kişi engellendi" : "Mesaj yaz…"
                        }
                        disabled={isBlocked || sending}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            send();
                          }
                        }}
                        className="min-h-[46px] px-4 py-3 flex-1 resize-none"
                      />
                      <button
                        className={`btn btn-primary h-[46px] ${
                          !draft.trim() || isBlocked || sending
                            ? "opacity-45 cursor-not-allowed"
                            : "opacity-100 cursor-pointer"
                        }`}
                        onClick={send}
                        disabled={!draft.trim() || isBlocked || sending}
                      >
                        {sending ? "..." : "Gönder"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-3.5 text-sm text-muted leading-[1.55]">
            Telefon numarası, adres ve banka bilgilerini sohbette paylaşmadan
            önce kişiyi tanıdığından emin ol.
          </div>
        </div>
      </section>

      {confirmType === "report" && activeUserId && (
        <ConfirmDialog
          title="Bu kişiyi bildirmek istiyor musun?"
          body="Ekibimiz incelemeye alır. Bildirimler isimsizdir."
          confirmLabel="Bildir"
          onCancel={() => setConfirmType(null)}
          onConfirm={() => {
            setReported((r) => ({ ...r, [activeUserId]: true }));
            setConfirmType(null);
          }}
        />
      )}
      {confirmType === "block" && activeUserId && (
        <ConfirmDialog
          title={
            isBlocked
              ? "Engeli kaldırmak istiyor musun?"
              : "Bu kişiyi engellemek istiyor musun?"
          }
          body={
            isBlocked
              ? "Engel kaldırılırsa kişi sana tekrar mesaj atabilir."
              : "Engellenen kişi sana mesaj atamaz. İstediğin zaman engeli kaldırabilirsin."
          }
          confirmLabel={isBlocked ? "Engeli kaldır" : "Engelle"}
          danger={!isBlocked}
          onCancel={() => setConfirmType(null)}
          onConfirm={() => {
            setBlocked((b) => ({ ...b, [activeUserId]: !b[activeUserId] }));
            setConfirmType(null);
          }}
        />
      )}
    </div>
  );
}

function Bubble({ msg }: { msg: ThreadMsg }) {
  return (
    <div
      className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[72%]">
        <div
          className={`px-3.5 py-2.5 text-[14.5px] leading-[1.5] tracking-[-0.005em] break-words whitespace-pre-wrap border ${
            msg.fromMe
              ? "rounded-[14px] rounded-br-[4px] bg-ink-900 text-white border-ink-900"
              : "rounded-[14px] rounded-bl-[4px] bg-white text-ink-900 border-ink-100"
          }`}
        >
          {msg.content}
        </div>
        <div
          className={`font-mono text-[11px] text-ink-400 mt-1.5 px-1.5 ${
            msg.fromMe ? "text-right" : "text-left"
          }`}
        >
          {formatRelative(msg.createdAt)}
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full px-3 py-2.5 bg-transparent border-0 rounded-lg font-[inherit] text-[14px] text-left cursor-pointer hover:bg-ink-900/[0.04] ${
        danger ? "text-[#B23A3A]" : "text-ink-700"
      }`}
    >
      {children}
    </button>
  );
}

function SystemNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center text-[12.5px] text-ink-500 px-4 py-2.5 bg-ink-900/[0.04] rounded-full self-center my-1.5">
      {children}
    </div>
  );
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return "şimdi";
  if (diff < 3600) return `${Math.floor(diff / 60)}d`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}g`;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
  }).format(date);
}
