"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import ProfileForm, {
  type ProfileFormInitial,
} from "@/components/panel/ProfileForm";

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
  profilePhotoUrl: string | null;
  createdAt: string;
};

type Props = {
  user: ProfileUser;
  stats: {
    professionCount: number;
    experienceCount: number;
  };
  categories: { slug: string; name: string }[];
  initialFormState: ProfileFormInitial;
  initialIsAvailable: boolean;
};

export default function ProfileClient({
  user,
  stats,
  categories,
  initialFormState,
  initialIsAvailable,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(initialIsAvailable);
  const [availBusy, setAvailBusy] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) {
      editRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editing]);

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

  const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));
  const professionNames = user.professions.map((p) => categoryMap.get(p) ?? p);

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
            <Avatar
              initials={user.initials}
              size={84}
              photoUrl={user.profilePhotoUrl}
            />
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
                {professionNames.length > 0 && (
                  <>
                    <span>
                      {professionNames.length === 1
                        ? professionNames[0]
                        : `${professionNames.length} meslek`}
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
            {!editing && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
                >
                  Profilini düzenle
                </button>
              </div>
            )}
          </div>

          {!editing && (
            <>
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
            </>
          )}
        </div>
      </section>

      <section style={{ padding: "40px 0 96px" }}>
        <div className="container">
          {!editing ? (
            <ProfilePreview
              professionNames={professionNames}
              bio={user.bio}
            />
          ) : (
            <div ref={editRef} style={{ maxWidth: 760, scrollMarginTop: 96 }}>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  background: "none",
                  border: 0,
                  padding: 0,
                  font: "inherit",
                  fontSize: 14,
                  color: "var(--color-ink-500)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 16,
                }}
              >
                ← Profilime dön
              </button>
              <h2 style={{ fontSize: 28, marginBottom: 8 }}>
                Profilini düzenle
              </h2>
              <p
                className="text-sm text-muted"
                style={{ marginTop: 0, marginBottom: 28, lineHeight: 1.55 }}
              >
                Buradaki bilgiler profilinde diğer kullanıcılara gösterilir.
                Değişiklikleri kaydetmeyi unutma.
              </p>

              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                Profil fotoğrafı
              </h4>
              <ProfilePhotoUpload
                currentPhotoUrl={user.profilePhotoUrl}
                initials={user.initials}
              />

              <div className="divider" style={{ margin: "32px 0 24px" }} />

              <ProfileForm
                categories={categories}
                initial={initialFormState}
                onSaved={() => setEditing(false)}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProfilePreview({
  professionNames,
  bio,
}: {
  professionNames: string[];
  bio: string;
}) {
  return (
    <div style={{ maxWidth: 760 }}>
      <h3 style={{ marginBottom: 18 }}>Mesleklerim</h3>
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
            Henüz meslek seçmedin. "Profilini düzenle"ye basarak mesleklerini
            ekle.
          </p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
              Henüz tanıtım yazmadın. Kendinden kısaca bahset, gelen taleplerin
              artsın.
            </p>
          )}
        </div>
      </div>
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
