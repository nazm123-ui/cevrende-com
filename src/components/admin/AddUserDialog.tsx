"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminModal from "./AdminModal";
import ProfessionPicker from "./ProfessionPicker";
import Toggle from "./Toggle";

type Category = { slug: string; name: string };
type District = { name: string; neighborhoods: string[] };

export default function AddUserDialog({
  categories,
  districts,
}: {
  categories: Category[];
  districts: District[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState(districts[0]?.name ?? "Pendik");
  const [neighborhood, setNeighborhood] = useState("");
  const [bio, setBio] = useState("");
  const [professions, setProfessions] = useState<string[]>([]);
  const [sendWelcome, setSendWelcome] = useState(true);

  const neighborhoods = useMemo(
    () => districts.find((d) => d.name === district)?.neighborhoods ?? [],
    [districts, district],
  );

  function reset() {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setDistrict(districts[0]?.name ?? "Pendik");
    setNeighborhood("");
    setBio("");
    setProfessions([]);
    setSendWelcome(true);
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          district,
          neighborhood: neighborhood || null,
          bio: bio || null,
          professions,
          sendWelcome,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Kullanıcı eklenemedi.");
        return;
      }
      reset();
      setOpen(false);
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setOpen(true)}
      >
        + Kullanıcı ekle
      </button>

      {open && (
        <AdminModal
          title="Yeni kullanıcı ekle"
          subtitle="Admin tarafından eklenen hesap doğrulanmış ve aktif olarak oluşturulur."
          onClose={() => !saving && setOpen(false)}
        >
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Ad soyad">
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={80} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="E-posta">
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Field>
              <Field label="Telefon">
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0555 555 55 55" required />
              </Field>
            </div>

            <Field label="Geçici şifre (en az 6 karakter)">
              <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} maxLength={120} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="İlçe">
                <select
                  className="select"
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setNeighborhood("");
                  }}
                >
                  {districts.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Mahalle">
                <select className="select" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
                  <option value="">Seçiniz (opsiyonel)</option>
                  {neighborhoods.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Tanıtım / Hakkında (opsiyonel)">
              <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={3} />
            </Field>

            <ProfessionPicker categories={categories} value={professions} onChange={setProfessions} />

            <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 10 }}>
              <Toggle
                checked={sendWelcome}
                onChange={setSendWelcome}
                label="Giriş bilgilerini e-posta ile gönder"
                hint="Kişiye e-postası, geçici şifresi ve giriş linki gönderilir."
              />
            </div>

            {error && (
              <div style={{ color: "var(--danger)", fontSize: 13 }}>{error}</div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)} disabled={saving}>
                İptal
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Ekleniyor…" : "Kullanıcı ekle"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
