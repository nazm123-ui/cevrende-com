"use client";

import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import type { RecentConversation, SavedProfileItem } from "./ProfileClient";

type Props = {
  professions: string[];
  bio: string;
  categories: { slug: string; name: string }[];
  recentConversations: RecentConversation[];
  savedProfiles: SavedProfileItem[];
};

export default function OverviewTab({
  professions,
  bio,
  categories,
  recentConversations,
  savedProfiles,
}: Props) {
  const router = useRouter();
  const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));
  const professionNames = professions.map((p) => categoryMap.get(p) ?? p);

  return (
    <div
      className="overview-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: 48,
      }}
    >
      {/* Mesleklerim & Tanıtım */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h3>Mesleklerim</h3>
        </div>
        <div
          style={{
            border: "1px solid var(--color-ink-100)",
            borderRadius: 14,
            padding: "20px 22px",
            background: "#fff",
          }}
        >
          {professionNames.length === 0 ? (
            <p
              className="text-sm text-muted"
              style={{ margin: 0, lineHeight: 1.55 }}
            >
              Henüz meslek seçmedin. Profilini düzenleyerek mesleklerini ekle.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {professionNames.map((name) => (
                <span key={name} className="chip">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 32 }}>
          <h3 style={{ marginBottom: 18 }}>Hakkımda</h3>
          <div
            style={{
              border: "1px solid var(--color-ink-100)",
              borderRadius: 14,
              padding: "20px 22px",
              background: "#fff",
              minHeight: 80,
            }}
          >
            {bio.trim() ? (
              <p
                style={{
                  margin: 0,
                  fontSize: 14.5,
                  color: "var(--color-ink-700)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {bio}
              </p>
            ) : (
              <p
                className="text-sm text-muted"
                style={{ margin: 0, lineHeight: 1.55 }}
              >
                Henüz tanıtım yazmadın. Kendinden kısaca bahset, gelen taleplerin artsın.
              </p>
            )}
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <h3 style={{ marginBottom: 18 }}>Kaydettiğim profiller</h3>
          <div
            style={{
              border: "1px solid var(--color-ink-100)",
              borderRadius: 14,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            {savedProfiles.length === 0 ? (
              <div
                style={{
                  padding: "24px 22px",
                  color: "var(--color-ink-500)",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                }}
              >
                Henüz profil kaydetmedin. Bir hizmet veren profilinde "Profili kaydet"e basarak buraya ekleyebilirsin.
              </div>
            ) : (
              savedProfiles.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/cevrendekiler/${p.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "14px 18px",
                    border: 0,
                    background: "#fff",
                    cursor: "pointer",
                    font: "inherit",
                    textAlign: "left",
                    borderTop:
                      i > 0 ? "1px solid var(--color-ink-100)" : "none",
                  }}
                >
                  <Avatar initials={p.initials} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--color-ink-900)",
                      }}
                    >
                      {p.fullName}
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color: "var(--color-ink-500)",
                        marginTop: 2,
                      }}
                    >
                      {p.professionNames.join(", ") || "—"}
                    </div>
                  </div>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 13,
                      color: "var(--color-ink-400)",
                    }}
                  >
                    →
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Son mesajlar */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h3>Son mesajlar</h3>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push("/panel/mesajlar")}
          >
            Tümü
          </button>
        </div>
        <div
          style={{
            border: "1px solid var(--color-ink-100)",
            borderRadius: 14,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {recentConversations.length === 0 ? (
            <div
              style={{
                padding: "32px 22px",
                textAlign: "center",
                color: "var(--color-ink-500)",
                fontSize: 13.5,
              }}
            >
              Henüz mesajın yok.
            </div>
          ) : (
            recentConversations.map((c, i) => (
              <button
                key={c.otherUserId}
                onClick={() => router.push(`/panel/mesajlar/${c.otherUserId}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "14px 18px",
                  border: 0,
                  background: "#fff",
                  cursor: "pointer",
                  font: "inherit",
                  textAlign: "left",
                  borderTop: i > 0 ? "1px solid var(--color-ink-100)" : "none",
                }}
              >
                <Avatar initials={c.initials} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500 }}>
                      {c.name}
                    </span>
                    <span
                      className="font-mono text-sm"
                      style={{ color: "var(--color-ink-500)" }}
                    >
                      {formatRelative(c.lastMessageAt)}
                    </span>
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: c.unread > 0
                        ? "var(--color-ink-900)"
                        : "var(--color-ink-500)",
                      fontWeight: c.unread > 0 ? 500 : 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: 2,
                    }}
                  >
                    {c.lastMessage}
                  </div>
                </div>
                {c.unread > 0 && (
                  <span
                    style={{
                      flexShrink: 0,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--color-accent-600)",
                    }}
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>
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
