"use client";

import { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import OverviewTab from "./OverviewTab";
import AccountTab from "./AccountTab";
import ProfileSettingsTab from "./ProfileSettingsTab";
import type { ProfileFormInitial } from "@/components/panel/ProfileForm";

type Tab = "overview" | "account" | "profile";

export type ProfileUser = {
  id: string;
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  district: string;
  neighborhood: string | null;
  professions: string[];
  bio: string;
  createdAt: string;
};

export type RecentConversation = {
  otherUserId: string;
  name: string;
  initials: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
};

export type SavedProfileItem = {
  id: string;
  fullName: string;
  initials: string;
  professionNames: string[];
};

type Props = {
  user: ProfileUser;
  stats: {
    professionCount: number;
    experienceCount: number;
  };
  recentConversations: RecentConversation[];
  savedProfiles: SavedProfileItem[];
  categories: { slug: string; name: string }[];
  initialFormState: ProfileFormInitial;
  initialIsAvailable: boolean;
};

export default function ProfileClient({
  user,
  stats,
  recentConversations,
  savedProfiles,
  categories,
  initialFormState,
  initialIsAvailable,
}: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [isAvailable, setIsAvailable] = useState(initialIsAvailable);
  const [availBusy, setAvailBusy] = useState(false);

  async function toggleAvailable() {
    if (availBusy) return;
    const next = !isAvailable;
    setIsAvailable(next);
    setAvailBusy(true);
    try {
      const res = await fetch("/api/profile/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: next }),
      });
      if (!res.ok) setIsAvailable(!next);
    } catch {
      setIsAvailable(!next);
    } finally {
      setAvailBusy(false);
    }
  }

  const memberSince = formatMemberSince(user.createdAt);
  const location = user.neighborhood
    ? `${user.neighborhood}, ${user.district}`
    : user.district;

  return (
    <div className="page">
      <section style={{ padding: "56px 0 0" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Hesabım
          </div>
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <Avatar initials={user.initials} size={84} />
            <div style={{ flex: "1 1 280px", minWidth: 0 }}>
              <h2 style={{ fontSize: 32 }}>{user.fullName}</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 8,
                  color: "var(--color-ink-500)",
                  flexWrap: "wrap",
                  fontSize: 14,
                }}
              >
                {user.professions.length > 0 && (
                  <>
                    <span>
                      {user.professions.length === 1
                        ? user.professions[0]
                        : `${user.professions.length} meslek`}
                    </span>
                    <span style={{ color: "var(--color-ink-400)" }}>·</span>
                  </>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="pin" size={13} /> {location}
                </span>
              </div>
              <div
                className="text-sm text-muted font-mono"
                style={{ marginTop: 8 }}
              >
                Üyelik · {memberSince}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setTab("profile")}
              >
                Profili düzenle
              </button>
            </div>
          </div>

          {/* Availability toggle */}
          <div className="mt-9 flex items-center justify-between gap-4 px-5 py-4 rounded-[14px] border border-ink-100 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  isAvailable ? "bg-emerald-500" : "bg-ink-300"
                }`}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="text-[15px] font-medium text-ink-900">
                  {isAvailable
                    ? "Şu an iş alıyorum"
                    : "Şu an dolu — yeni iş almıyorum"}
                </div>
                <div className="text-[13px] text-ink-500 mt-0.5">
                  {isAvailable
                    ? "Profilin listede önde görünür, herkes mesaj atabilir."
                    : "Profilin listenin sonunda görünür. Yine de mesaj alabilirsin."}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleAvailable}
              disabled={availBusy}
              role="switch"
              aria-checked={isAvailable}
              aria-label="Müsaitlik durumu"
              className={`shrink-0 relative inline-flex h-7 w-12 items-center rounded-full transition border-0 cursor-pointer ${
                isAvailable ? "bg-emerald-500" : "bg-ink-200"
              } ${availBusy ? "opacity-60 cursor-wait" : ""}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  isAvailable ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Stats row */}
          <div
            className="profile-stats"
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 0,
              border: "1px solid var(--color-ink-100)",
              borderRadius: 14,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <StatCell num={stats.professionCount} label="meslek" />
            <StatCell
              num={stats.experienceCount}
              label="iş deneyimi"
              borderL
            />
          </div>

          {/* Tabs */}
          <div
            className="scroll-x"
            style={{
              marginTop: 40,
              borderBottom: "1px solid var(--color-ink-100)",
              display: "flex",
              gap: 4,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {[
              { id: "overview" as const, label: "Özet" },
              { id: "account" as const, label: "Hesap Ayarları" },
              { id: "profile" as const, label: "Profil Ayarları" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: "none",
                  border: 0,
                  padding: "14px 16px",
                  font: "inherit",
                  fontSize: 14.5,
                  cursor: "pointer",
                  color:
                    tab === t.id
                      ? "var(--color-ink-900)"
                      : "var(--color-ink-500)",
                  fontWeight: tab === t.id ? 500 : 400,
                  borderBottom:
                    tab === t.id
                      ? "2px solid var(--color-ink-900)"
                      : "2px solid transparent",
                  marginBottom: -1,
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 0 96px" }}>
        <div className="container">
          {tab === "overview" && (
            <OverviewTab
              professions={user.professions}
              bio={user.bio}
              categories={categories}
              recentConversations={recentConversations}
              savedProfiles={savedProfiles}
            />
          )}
          {tab === "account" && <AccountTab user={user} />}
          {tab === "profile" && (
            <ProfileSettingsTab
              categories={categories}
              initial={initialFormState}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function StatCell({
  num,
  label,
  borderL,
}: {
  num: string | number;
  label: string;
  borderL?: boolean;
}) {
  return (
    <div
      style={{
        padding: "22px 24px",
        borderLeft: borderL ? "1px solid var(--color-ink-100)" : "none",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em" }}>
        {num}
      </div>
      <div className="text-sm text-muted" style={{ marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}

function formatMemberSince(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
  }).format(date);
}
