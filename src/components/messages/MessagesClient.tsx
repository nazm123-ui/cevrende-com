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
      { id: tempId, fromMe: true, content, createdAt: new Date().toISOString() },
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
      <section style={{ padding: "32px 0 96px" }}>
        <div className="container">
          <div
            className="row"
            style={{
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
              display: "flex",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Mesajlar
              </div>
              <h2 style={{ fontSize: 32 }}>Sohbetlerim</h2>
            </div>
            <div className="text-sm text-muted">
              <span
                className="font-mono"
                style={{ color: "var(--color-ink-700)" }}
              >
                {conversations.length}
              </span>{" "}
              aktif sohbet
            </div>
          </div>

          <div
            className="card msg-shell"
            data-mobile-showing-chat={String(!!activeUserId)}
            style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              minHeight: 560,
              overflow: "hidden",
              padding: 0,
            }}
          >
            {/* Chat list */}
            <div
              className="msg-list"
              style={{
                borderRight: "1px solid var(--color-ink-100)",
                background: "#FCFBF8",
              }}
            >
              <div
                style={{
                  padding: "18px 18px 14px",
                  borderBottom: "1px solid var(--color-ink-100)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-ink-400)",
                      pointerEvents: "none",
                    }}
                  >
                    <Icon name="search" size={16} />
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Sohbetlerde ara…"
                    style={{
                      paddingLeft: 36,
                      height: 38,
                      border: "1px solid var(--color-ink-100)",
                      background: "#fff",
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>
              <div style={{ maxHeight: 520, overflowY: "auto" }}>
                {filtered.length === 0 ? (
                  <div
                    style={{
                      padding: "40px 18px",
                      textAlign: "center",
                      color: "var(--color-ink-500)",
                      fontSize: 13.5,
                    }}
                  >
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
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "16px 18px",
                          background: active ? "#fff" : "transparent",
                          border: 0,
                          borderBottom: "1px solid var(--color-ink-100)",
                          cursor: "pointer",
                          font: "inherit",
                          borderLeft: active
                            ? "2px solid var(--color-accent-600)"
                            : "2px solid transparent",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                          }}
                        >
                          <Avatar initials={c.initials} size={40} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 14.5,
                                  fontWeight: 500,
                                  letterSpacing: "-0.005em",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {c.otherUserName}
                              </div>
                              <div
                                className="font-mono"
                                style={{
                                  fontSize: 11,
                                  color: "var(--color-ink-500)",
                                }}
                              >
                                {formatRelative(c.lastMessageAt)}
                              </div>
                            </div>
                            <div
                              style={{
                                color: c.unreadCount
                                  ? "var(--color-ink-900)"
                                  : "var(--color-ink-500)",
                                fontWeight: c.unreadCount ? 500 : 400,
                                marginTop: 2,
                                fontSize: 13.5,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {c.lastMessageFromMe ? "Sen: " : ""}
                              {c.lastMessage || "Yeni sohbet"}
                            </div>
                            {c.unreadCount > 0 && (
                              <div
                                style={{
                                  display: "inline-flex",
                                  marginTop: 6,
                                  minWidth: 18,
                                  height: 18,
                                  padding: "0 6px",
                                  borderRadius: 999,
                                  background: "var(--color-accent-600)",
                                  color: "#fff",
                                  fontSize: 11,
                                  fontWeight: 500,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
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
            <div
              className="msg-thread"
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                minHeight: 560,
              }}
            >
              {!activeConv ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 32,
                    color: "var(--color-ink-500)",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {conversations.length === 0
                    ? "Henüz mesajlaşman yok. İşçi profilinden iletişim talebi gönder."
                    : "Bir sohbet seç."}
                </div>
              ) : (
                <>
                  <div
                    style={{
                      padding: "16px 22px",
                      borderBottom: "1px solid var(--color-ink-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      background: "#fff",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 0,
                      }}
                    >
                      <button
                        onClick={() => router.push("/panel/mesajlar")}
                        className="msg-back"
                        style={{
                          display: "none",
                          background: "none",
                          border: 0,
                          padding: 4,
                          cursor: "pointer",
                          color: "var(--color-ink-700)",
                        }}
                      >
                        ←
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/cevrendekiler/${activeConv.otherUserId}`)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          background: "none",
                          border: 0,
                          padding: 0,
                          cursor: "pointer",
                          font: "inherit",
                          textAlign: "left",
                          minWidth: 0,
                        }}
                      >
                        <Avatar initials={activeConv.initials} size={40} />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 500,
                              letterSpacing: "-0.005em",
                            }}
                          >
                            {activeConv.otherUserName}
                          </div>
                          <div className="text-sm text-muted">
                            Profili görüntüle →
                          </div>
                        </div>
                      </button>
                    </div>
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setMenuOpen((o) => !o)}
                        style={{
                          background: "none",
                          border: "1px solid var(--color-ink-200)",
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-ink-700)",
                        }}
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
                            style={{ position: "fixed", inset: 0, zIndex: 10 }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              right: 0,
                              top: "calc(100% + 6px)",
                              background: "#fff",
                              border: "1px solid var(--color-ink-100)",
                              borderRadius: 12,
                              minWidth: 200,
                              padding: 6,
                              boxShadow:
                                "0 1px 0 rgba(15,17,16,.02), 0 8px 24px -12px rgba(15,17,16,.10)",
                              zIndex: 20,
                            }}
                          >
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

                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "24px 22px",
                      background: "#FCFBF8",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {allMessages.length === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: 13.5,
                            color: "var(--color-ink-500)",
                            padding: "32px 16px",
                          }}
                        >
                          Henüz mesaj yok. İlk mesajı sen at.
                        </div>
                      ) : (
                        allMessages.map((m) => (
                          <Bubble key={m.id} msg={m} />
                        ))
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

                  <div
                    style={{
                      padding: 14,
                      borderTop: "1px solid var(--color-ink-100)",
                      background: "#fff",
                    }}
                  >
                    {error && (
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: 13,
                          color: "#B23A3A",
                        }}
                      >
                        {error}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-end",
                      }}
                    >
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
                        style={{
                          minHeight: 46,
                          padding: "12px 16px",
                          flex: 1,
                          resize: "none",
                        }}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={send}
                        disabled={!draft.trim() || isBlocked || sending}
                        style={{
                          height: 46,
                          opacity:
                            !draft.trim() || isBlocked || sending ? 0.45 : 1,
                          cursor:
                            !draft.trim() || isBlocked || sending
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {sending ? "..." : "Gönder"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className="text-sm text-muted"
            style={{ marginTop: 14, lineHeight: 1.55 }}
          >
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
      style={{
        display: "flex",
        justifyContent: msg.fromMe ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ maxWidth: "72%" }}>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            borderBottomRightRadius: msg.fromMe ? 4 : 14,
            borderBottomLeftRadius: msg.fromMe ? 14 : 4,
            background: msg.fromMe ? "var(--color-ink-900)" : "#fff",
            color: msg.fromMe ? "#fff" : "var(--color-ink-900)",
            border: msg.fromMe
              ? "1px solid var(--color-ink-900)"
              : "1px solid var(--color-ink-100)",
            fontSize: 14.5,
            lineHeight: 1.5,
            letterSpacing: "-0.005em",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {msg.content}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--color-ink-400)",
            marginTop: 6,
            textAlign: msg.fromMe ? "right" : "left",
            padding: "0 6px",
          }}
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
      style={{
        display: "flex",
        width: "100%",
        padding: "10px 12px",
        background: "none",
        border: 0,
        borderRadius: 8,
        font: "inherit",
        fontSize: 14,
        textAlign: "left",
        cursor: "pointer",
        color: danger ? "#B23A3A" : "var(--color-ink-700)",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background =
          "rgba(15,17,16,.04)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background = "none")
      }
    >
      {children}
    </button>
  );
}

function SystemNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: 12.5,
        color: "var(--color-ink-500)",
        padding: "10px 16px",
        background: "rgba(15,17,16,.04)",
        borderRadius: 999,
        alignSelf: "center",
        margin: "6px 0",
      }}
    >
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
