"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";
import AdminModal from "@/components/admin/AdminModal";
import ProfessionPicker from "@/components/admin/ProfessionPicker";
import Toggle from "@/components/admin/Toggle";
import { getInitials } from "@/lib/initials";

type Category = { slug: string; name: string };
type District = { name: string; neighborhoods: string[] };

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  district: string;
  neighborhood: string | null;
  professions: string[];
  bio: string | null;
  isActive: boolean;
  isAvailable: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  _count: {
    sentMessages: number;
    receivedMessages: number;
  };
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UsersTable({
  users,
  categories,
  districts,
}: {
  users: AdminUserRow[];
  categories: Category[];
  districts: District[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<AdminUserRow | null>(null);
  const [msgUser, setMsgUser] = useState<AdminUserRow | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  async function toggleActive(u: AdminUserRow) {
    if (u.isAdmin) return;
    setError(null);
    setBusyId(u.id);
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !u.isActive }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "İşlem başarısız.");
        return;
      }
      showToast(!u.isActive ? "Hesap aktif edildi." : "Hesap pasifleştirildi.");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(u: AdminUserRow) {
    if (u.isAdmin) return;
    if (
      !confirm(
        `${u.fullName} (${u.email}) hesabını kalıcı olarak silmek istiyor musun?\n\nBu işlem mesajları, talepleri ve raporları da siler. Geri alınamaz.`,
      )
    )
      return;
    setError(null);
    setBusyId(u.id);
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Silme başarısız.");
        return;
      }
      showToast("Kullanıcı silindi.");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusyId(null);
    }
  }

  if (users.length === 0) {
    return <div className="empty">Sonuç yok.</div>;
  }

  return (
    <>
      {error && (
        <div
          className="card card-pad"
          style={{
            borderColor: "var(--danger)",
            color: "var(--danger)",
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      <div className="card" style={{ overflow: "hidden" }}>
        {/* Header */}
        <div
          className="list-row head"
          style={{ gridTemplateColumns: "1.6fr 1.2fr 1fr 0.7fr auto" }}
        >
          <div className="col">Kullanıcı</div>
          <div className="col">İletişim</div>
          <div className="col">Konum / Meslek</div>
          <div className="col">Etkinlik</div>
          <div className="col" style={{ textAlign: "right" }}>
            İşlem
          </div>
        </div>

        {/* Rows */}
        {users.map((u) => (
          <div
            key={u.id}
            className="list-row"
            style={{
              gridTemplateColumns: "1.6fr 1.2fr 1fr 0.7fr auto",
              opacity: u.isActive ? 1 : 0.65,
            }}
          >
            {/* Kullanıcı */}
            <div className="col col-name">
              <div
                className="avatar avatar-sm"
                style={{
                  background: u.isAdmin
                    ? "var(--ink)"
                    : u.professions.length > 0
                      ? "var(--accent)"
                      : "var(--surface-2)",
                  color:
                    u.isAdmin || u.professions.length > 0
                      ? "#fff"
                      : "var(--ink-2)",
                }}
              >
                {getInitials(u.fullName)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  className="nm"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  {u.fullName}
                  {u.isAdmin && (
                    <span className="tag tag-info" style={{ marginLeft: 4 }}>
                      Admin
                    </span>
                  )}
                  {!u.isActive && (
                    <span className="tag tag-danger">
                      <span className="tag-dot" />
                      Pasif
                    </span>
                  )}
                </div>
                <div className="sub">
                  {formatDate(u.createdAt)}{" "}
                  {u.professions.length > 0 && "· işçi"}
                </div>
              </div>
            </div>

            {/* İletişim */}
            <div className="col" style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {u.email}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 11.5,
                  color: "var(--muted)",
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {u.phone}
                {!u.isEmailVerified && (
                  <span
                    className="tag tag-muted"
                    style={{ fontSize: 10, marginLeft: 4 }}
                    title="E-posta doğrulanmamış"
                  >
                    e-posta ✗
                  </span>
                )}
                {!u.isPhoneVerified && (
                  <span
                    className="tag tag-muted"
                    style={{ fontSize: 10 }}
                    title="Telefon doğrulanmamış"
                  >
                    telefon ✗
                  </span>
                )}
              </div>
            </div>

            {/* Konum / Meslek */}
            <div className="col" style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink-2)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {u.neighborhood
                  ? `${u.neighborhood}, ${u.district}`
                  : u.district}
              </div>
              {u.professions.length > 0 && (
                <div
                  className="sub"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginTop: 2,
                  }}
                >
                  {u.professions.slice(0, 2).join(", ")}
                  {u.professions.length > 2 && " …"}
                </div>
              )}
            </div>

            {/* Etkinlik */}
            <div
              className="col mono"
              style={{ fontSize: 12, color: "var(--muted)" }}
            >
              {u._count.sentMessages + u._count.receivedMessages} mesaj
            </div>

            {/* İşlem */}
            <div
              className="col"
              style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}
            >
              <button
                type="button"
                onClick={() => setEditUser(u)}
                className="btn btn-secondary btn-xs"
                title="Bilgileri düzenle"
              >
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => setMsgUser(u)}
                disabled={u.isAdmin}
                className="btn btn-secondary btn-xs"
                title="Mesaj gönder"
              >
                Mesaj
              </button>
              <button
                type="button"
                onClick={() => toggleActive(u)}
                disabled={busyId === u.id || u.isAdmin}
                className="btn btn-secondary btn-xs"
                title={u.isActive ? "Pasifleştir" : "Aktif et"}
              >
                {u.isActive ? "Pasifleştir" : "Aktif et"}
              </button>
              <button
                type="button"
                onClick={() => deleteUser(u)}
                disabled={busyId === u.id || u.isAdmin}
                className="btn btn-danger btn-xs"
                title="Hesabı sil"
              >
                <AdminIcon name="trash" size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editUser && (
        <EditUserModal
          user={editUser}
          categories={categories}
          districts={districts}
          onClose={() => setEditUser(null)}
          onDone={(msg) => {
            setEditUser(null);
            showToast(msg);
            router.refresh();
          }}
        />
      )}

      {msgUser && (
        <MessageUserModal
          user={msgUser}
          onClose={() => setMsgUser(null)}
          onDone={(msg) => {
            setMsgUser(null);
            showToast(msg);
            router.refresh();
          }}
        />
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </>
  );
}

function EditUserModal({
  user,
  categories,
  districts,
  onClose,
  onDone,
}: {
  user: AdminUserRow;
  categories: Category[];
  districts: District[];
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [district, setDistrict] = useState(user.district);
  const [neighborhood, setNeighborhood] = useState(user.neighborhood ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [professions, setProfessions] = useState<string[]>(user.professions);
  const [isAvailable, setIsAvailable] = useState(user.isAvailable);
  const [isEmailVerified, setIsEmailVerified] = useState(user.isEmailVerified);
  const [isPhoneVerified, setIsPhoneVerified] = useState(user.isPhoneVerified);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // İlçe listesinde mevcut ilçe yoksa başa ekle (pasif ilçe ihtimali)
  const districtNames = useMemo(() => {
    const names = districts.map((d) => d.name);
    return names.includes(district) ? names : [district, ...names];
  }, [districts, district]);

  const neighborhoods = useMemo(
    () => districts.find((d) => d.name === district)?.neighborhoods ?? [],
    [districts, district],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          district,
          neighborhood: neighborhood || null,
          bio: bio || null,
          professions,
          isAvailable,
          isEmailVerified,
          isPhoneVerified,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Kaydedilemedi.");
        return;
      }
      onDone("Bilgiler güncellendi.");
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      title={`${user.fullName} — düzenle`}
      onClose={() => !saving && onClose()}
    >
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ModalField label="Ad soyad">
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={80} />
        </ModalField>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <ModalField label="E-posta">
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </ModalField>
          <ModalField label="Telefon">
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </ModalField>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <ModalField label="İlçe">
            <select
              className="select"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setNeighborhood("");
              }}
            >
              {districtNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </ModalField>
          <ModalField label="Mahalle">
            {neighborhoods.length > 0 ? (
              <select className="select" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
                <option value="">Seçiniz</option>
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            ) : (
              <input className="input" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} maxLength={80} />
            )}
          </ModalField>
        </div>

        <ModalField label="Tanıtım / Hakkında">
          <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={4} />
        </ModalField>

        <ProfessionPicker categories={categories} value={professions} onChange={setProfessions} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: 12,
            background: "var(--surface-2)",
            borderRadius: 10,
          }}
        >
          <Toggle
            checked={isEmailVerified}
            onChange={setIsEmailVerified}
            label="E-posta doğrulanmış"
            hint="Güvendiğin kişiler için elle onayla — kullanıcı sonra profilden değiştirebilir."
          />
          <Toggle
            checked={isPhoneVerified}
            onChange={setIsPhoneVerified}
            label="Telefon doğrulanmış"
          />
          <Toggle
            checked={isAvailable}
            onChange={setIsAvailable}
            label="Profili aramada / Çevrendekiler listesinde göster"
          />
        </div>

        {error && <div style={{ color: "var(--danger)", fontSize: 13 }}>{error}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            İptal
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

function MessageUserModal({
  user,
  onClose,
  onDone,
}: {
  user: AdminUserRow;
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const [content, setContent] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sendEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Mesaj gönderilemedi.");
        return;
      }
      onDone("Mesaj gönderildi.");
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      title={`${user.fullName} — mesaj gönder`}
      subtitle="Mesaj kullanıcının platform içi sohbetine düşer. İstersen e-posta olarak da gönderilir."
      onClose={() => !saving && onClose()}
    >
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ModalField label="Mesaj">
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            rows={5}
            placeholder="Mesajını yaz…"
            autoFocus
            required
          />
        </ModalField>

        <Toggle
          checked={sendEmail}
          onChange={setSendEmail}
          label="E-posta olarak da gönder"
        />

        {error && <div style={{ color: "var(--danger)", fontSize: 13 }}>{error}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            İptal
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving || !content.trim()}>
            {saving ? "Gönderiliyor…" : "Gönder"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

