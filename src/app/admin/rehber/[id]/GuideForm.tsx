"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GUIDE_TOPICS,
  type GuideSection,
  type GuideFaq,
  type GuideBullet,
} from "@/lib/guides";

type Initial = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  intro: string;
  topic: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  relatedCategorySlugs: string[];
  isPublished: boolean;
};

const TOPIC_OPTIONS = Object.values(GUIDE_TOPICS).map((t) => ({
  slug: t.slug,
  label: t.label,
}));

const LAYOUTS = [
  { v: "prose", l: "Metin" },
  { v: "steps", l: "Numaralı adımlar" },
  { v: "checklist", l: "Kontrol listesi (yeşil tik)" },
  { v: "features", l: "Özellik kartları (ikonlu)" },
] as const;

const ICONS = [
  { v: "", l: "— ikon yok" },
  { v: "camera", l: "Kamera" },
  { v: "wave", l: "Dalga" },
  { v: "thermometer", l: "Termometre" },
  { v: "shield", l: "Kalkan" },
  { v: "wrench", l: "Anahtar" },
];

export default function GuideForm({
  categoryPages,
  initial,
  initialCoverUrl,
}: {
  categoryPages: { slug: string; name: string }[];
  initial?: Initial;
  initialCoverUrl?: string | null;
}) {
  const router = useRouter();
  const isNew = !initial;

  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl ?? null);
  const [coverBusy, setCoverBusy] = useState(false);

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !initial) return;
    setCoverBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("cover", file);
      const res = await fetch(`/api/admin/guides/${initial.id}/cover`, {
        method: "POST",
        body: fd,
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d.error || "Görsel yüklenemedi.");
        return;
      }
      setCoverUrl(d.url ?? null);
    } finally {
      setCoverBusy(false);
    }
  }

  async function removeCover() {
    if (!initial) return;
    setCoverBusy(true);
    try {
      const res = await fetch(`/api/admin/guides/${initial.id}/cover`, {
        method: "DELETE",
      });
      if (res.ok) setCoverUrl(null);
    } finally {
      setCoverBusy(false);
    }
  }

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [topic, setTopic] = useState(initial?.topic ?? TOPIC_OPTIONS[0]?.slug ?? "genel");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? "");
  const [intro, setIntro] = useState(initial?.intro ?? "");
  const [sections, setSections] = useState<GuideSection[]>(initial?.sections ?? []);
  const [faqs, setFaqs] = useState<GuideFaq[]>(initial?.faqs ?? []);
  const [related, setRelated] = useState<string[]>(initial?.relatedCategorySlugs ?? []);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- section helpers ----
  function patchSection(i: number, patch: Partial<GuideSection>) {
    setSections((p) => p.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function addSection() {
    setSections((p) => [...p, { heading: "", layout: "prose", paragraphs: [], bullets: [] }]);
  }
  function removeSection(i: number) {
    setSections((p) => p.filter((_, idx) => idx !== i));
  }
  function patchBullet(i: number, j: number, patch: Partial<GuideBullet>) {
    setSections((p) =>
      p.map((s, idx) =>
        idx === i
          ? { ...s, bullets: (s.bullets ?? []).map((b, bj) => (bj === j ? { ...b, ...patch } : b)) }
          : s,
      ),
    );
  }
  function addBullet(i: number) {
    setSections((p) =>
      p.map((s, idx) => (idx === i ? { ...s, bullets: [...(s.bullets ?? []), { body: "" }] } : s)),
    );
  }
  function removeBullet(i: number, j: number) {
    setSections((p) =>
      p.map((s, idx) =>
        idx === i ? { ...s, bullets: (s.bullets ?? []).filter((_, bj) => bj !== j) } : s,
      ),
    );
  }

  function toggleRelated(s: string) {
    setRelated((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        slug,
        title,
        topic,
        excerpt,
        metaTitle,
        metaDescription,
        intro,
        relatedCategorySlugs: related,
        isPublished,
        sections: sections
          .map((s) => ({
            heading: s.heading.trim(),
            layout: s.layout ?? "prose",
            paragraphs: (s.paragraphs ?? []).map((p) => p.trim()).filter(Boolean),
            bullets: (s.bullets ?? [])
              .filter((b) => b.body.trim() || b.title?.trim())
              .map((b) => ({
                title: b.title?.trim() || undefined,
                body: b.body.trim(),
                icon: b.icon || undefined,
              })),
          }))
          .filter((s) => s.heading),
        faqs: faqs
          .filter((f) => f.q.trim() || f.a.trim())
          .map((f) => ({ q: f.q.trim(), a: f.a.trim() })),
      };
      const res = await fetch(
        isNew ? "/api/admin/guides" : `/api/admin/guides/${initial!.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Kaydetme başarısız. Alanları kontrol et.");
        return;
      }
      router.push("/admin/rehber");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Tekrar dene.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-6 sm:p-8 max-w-[820px] flex flex-col gap-7">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Link href="/admin/rehber" className="text-[13px] text-ink-500 hover:text-ink-900 transition">
            ← Rehber yazıları
          </Link>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-ink-900 mt-1">
            {isNew ? "Yeni rehber yazısı" : `Düzenle: ${initial?.title}`}
          </h1>
        </div>
        <label className="inline-flex items-center gap-2 text-[14px] text-ink-700 select-none">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="!w-auto !h-auto"
          />
          Yayında
        </label>
      </div>

      {isNew && (
        <p className="text-[13px] text-ink-500 bg-ink-50 border border-ink-100 rounded-[10px] px-3 py-2.5">
          Kapak görselini yazıyı <strong>oluşturduktan sonra</strong> ekleyebilirsin.
        </p>
      )}

      {!isNew && (
        <Section title="Kapak görseli">
          {coverUrl ? (
            <div className="flex flex-col gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt="Kapak"
                className="w-full max-w-[480px] rounded-[12px] border border-ink-100 object-cover"
                style={{ aspectRatio: "1200 / 630" }}
              />
              <div className="flex items-center gap-3">
                <label className="btn-outline h-9 px-4 rounded-full text-[13px] cursor-pointer inline-flex items-center">
                  {coverBusy ? "Yükleniyor…" : "Değiştir"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    className="hidden"
                    onChange={onCoverChange}
                    disabled={coverBusy}
                  />
                </label>
                <button
                  type="button"
                  onClick={removeCover}
                  disabled={coverBusy}
                  className="text-[13px] text-red-600 hover:text-red-700 transition px-2 disabled:opacity-50"
                >
                  Kaldır
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-1.5 h-40 max-w-[480px] rounded-[12px] border border-dashed border-ink-200 bg-ink-50 cursor-pointer hover:border-ink-300 transition text-ink-500 text-[14px] text-center px-4">
              <span>{coverBusy ? "Yükleniyor…" : "+ Görsel yükle"}</span>
              <span className="text-[12px] text-ink-400">
                JPG / PNG / WebP · otomatik 1200×630&apos;a kırpılır
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                className="hidden"
                onChange={onCoverChange}
                disabled={coverBusy}
              />
            </label>
          )}
        </Section>
      )}

      <Section title="Temel bilgiler">
        <Field label="Başlık (H1)">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="URL slug" hint="küçük harf, rakam, tire">
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="pendik-..." required />
          </Field>
          <Field label="Konu (sol menü grubu)">
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {TOPIC_OPTIONS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Kart özeti (liste sayfasında görünür)" hint={`${excerpt.length}/400`}>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} maxLength={400} required />
        </Field>
        <Field label="Giriş paragrafı">
          <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={4} required />
        </Field>
      </Section>

      <Section title="SEO etiketleri">
        <Field label="Meta başlık" hint={`${metaTitle.length}/160`}>
          <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={160} required />
        </Field>
        <Field label="Meta açıklama" hint={`${metaDescription.length}/320`}>
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} maxLength={320} required />
        </Field>
      </Section>

      {/* Bölümler */}
      <Section title="Bölümler">
        <div className="flex flex-col gap-4">
          {sections.map((s, i) => (
            <div key={i} className="rounded-[12px] border border-ink-200 bg-white p-4 flex flex-col gap-3 relative">
              <button
                type="button"
                onClick={() => removeSection(i)}
                className="absolute top-3 right-3 text-[12px] text-ink-400 hover:text-red-600 transition"
              >
                Bölümü sil
              </button>
              <div className="grid sm:grid-cols-2 gap-3 pr-16">
                <Field label="Bölüm başlığı">
                  <input
                    value={s.heading}
                    onChange={(e) => patchSection(i, { heading: e.target.value })}
                  />
                </Field>
                <Field label="Görünüm">
                  <select
                    value={s.layout ?? "prose"}
                    onChange={(e) => patchSection(i, { layout: e.target.value as GuideSection["layout"] })}
                  >
                    {LAYOUTS.map((l) => (
                      <option key={l.v} value={l.v}>
                        {l.l}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Paragraflar" hint="boş satırla ayır">
                <textarea
                  rows={3}
                  value={(s.paragraphs ?? []).join("\n\n")}
                  onChange={(e) =>
                    patchSection(i, { paragraphs: e.target.value.split(/\n{2,}/) })
                  }
                  placeholder="Paragraf 1&#10;&#10;Paragraf 2"
                />
              </Field>
              <div>
                <div className="text-[13px] font-medium text-ink-700 mb-2">
                  Maddeler {s.layout === "features" ? "(ikon seçilebilir)" : ""}
                </div>
                <div className="flex flex-col gap-2">
                  {(s.bullets ?? []).map((b, j) => (
                    <div key={j} className="rounded-[10px] border border-ink-100 bg-ink-50 p-2.5 flex flex-col gap-2 relative">
                      <div className="flex gap-2">
                        <input
                          placeholder="Başlık (opsiyonel)"
                          value={b.title ?? ""}
                          onChange={(e) => patchBullet(i, j, { title: e.target.value })}
                        />
                        {s.layout === "features" && (
                          <select
                            value={b.icon ?? ""}
                            onChange={(e) =>
                              patchBullet(i, j, {
                                icon: (e.target.value || undefined) as GuideBullet["icon"],
                              })
                            }
                            className="!w-auto"
                          >
                            {ICONS.map((ic) => (
                              <option key={ic.v} value={ic.v}>
                                {ic.l}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Madde metni"
                        value={b.body}
                        onChange={(e) => patchBullet(i, j, { body: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(i, j)}
                        className="self-end text-[12px] text-ink-400 hover:text-red-600 transition"
                      >
                        Maddeyi kaldır
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addBullet(i)}
                  className="btn-outline h-8 px-3.5 rounded-full text-[12.5px] mt-2"
                >
                  + Madde
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSection}
          className="btn-outline h-9 px-4 rounded-full text-[13px] mt-3 self-start"
        >
          + Bölüm ekle
        </button>
      </Section>

      {/* SSS */}
      <Section title="Sık sorulan sorular">
        <Repeater
          addLabel="+ Soru ekle"
          items={faqs}
          onAdd={() => setFaqs((p) => [...p, { q: "", a: "" }])}
          onRemove={(i) => setFaqs((p) => p.filter((_, x) => x !== i))}
          render={(it, i) => (
            <>
              <input
                placeholder="Soru"
                value={it.q}
                onChange={(e) =>
                  setFaqs((p) => p.map((x, idx) => (idx === i ? { ...x, q: e.target.value } : x)))
                }
              />
              <textarea
                placeholder="Cevap"
                rows={2}
                value={it.a}
                onChange={(e) =>
                  setFaqs((p) => p.map((x, idx) => (idx === i ? { ...x, a: e.target.value } : x)))
                }
              />
            </>
          )}
        />
      </Section>

      {/* İlgili hizmetler */}
      <Section title="İlgili hizmetler (iç link)">
        <div className="flex flex-wrap gap-2">
          {categoryPages.map((c) => {
            const on = related.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggleRelated(c.slug)}
                className={`inline-flex items-center h-9 px-3.5 rounded-full text-[13px] border transition ${
                  on
                    ? "bg-accent-50 border-accent-600 text-accent-700"
                    : "bg-white border-ink-200 text-ink-700 hover:border-ink-400"
                }`}
              >
                {on ? "✓ " : ""}
                {c.name}
              </button>
            );
          })}
          {categoryPages.length === 0 && (
            <span className="text-[13px] text-ink-500">Henüz kategori sayfası yok.</span>
          )}
        </div>
      </Section>

      {error && (
        <p className="rounded-[10px] bg-red-50 border border-red-100 px-3 py-2.5 text-[13.5px] text-red-700 m-0">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 sticky bottom-0 bg-white/90 backdrop-blur py-3 -mx-1 px-1">
        <button type="submit" disabled={saving} className="btn-ink h-11 px-6 rounded-full text-[14.5px] disabled:opacity-60">
          {saving ? "Kaydediliyor…" : isNew ? "Oluştur" : "Kaydet"}
        </button>
        <Link href="/admin/rehber" className="text-[14px] text-ink-500 hover:text-ink-900 transition">
          Vazgeç
        </Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[15px] font-semibold text-ink-900 border-b border-ink-100 pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between mb-1.5">
        <span className="text-[13px] font-medium text-ink-700">{label}</span>
        {hint && <span className="text-[12px] text-ink-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Repeater<T>({
  addLabel,
  items,
  onAdd,
  onRemove,
  render,
}: {
  addLabel: string;
  items: T[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  render: (item: T, i: number) => React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-[12px] border border-ink-100 bg-ink-50 p-3 flex flex-col gap-2 relative">
            {render(it, i)}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="self-end text-[12px] text-ink-400 hover:text-red-600 transition"
            >
              Kaldır
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={onAdd} className="btn-outline h-9 px-4 rounded-full text-[13px] mt-3">
        {addLabel}
      </button>
    </div>
  );
}
