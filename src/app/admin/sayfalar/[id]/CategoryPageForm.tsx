"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type GuidePoint = { title: string; body: string };
type Faq = { q: string; a: string };

type Initial = {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  guideTitle: string;
  emptyState: string;
  guidePoints: GuidePoint[];
  faqs: Faq[];
  isPublished: boolean;
  order: number;
};

export default function CategoryPageForm({
  categories,
  initial,
  initialCoverUrl,
}: {
  categories: { slug: string; name: string }[];
  initial?: Initial;
  initialCoverUrl?: string | null;
}) {
  const router = useRouter();
  const isNew = !initial;

  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl ?? null);
  const [coverBusy, setCoverBusy] = useState(false);

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // aynı dosyayı tekrar seçebilmek için sıfırla
    if (!file || !initial) return;
    setCoverBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("cover", file);
      const res = await fetch(`/api/admin/category-pages/${initial.id}/cover`, {
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
      const res = await fetch(`/api/admin/category-pages/${initial.id}/cover`, {
        method: "DELETE",
      });
      if (res.ok) setCoverUrl(null);
    } finally {
      setCoverBusy(false);
    }
  }

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [categorySlug, setCategorySlug] = useState(
    initial?.categorySlug ?? categories[0]?.slug ?? "",
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [h1, setH1] = useState(initial?.h1 ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.metaDescription ?? "",
  );
  const [intro, setIntro] = useState(initial?.intro ?? "");
  const [guideTitle, setGuideTitle] = useState(initial?.guideTitle ?? "");
  const [emptyState, setEmptyState] = useState(initial?.emptyState ?? "");
  const [guidePoints, setGuidePoints] = useState<GuidePoint[]>(
    initial?.guidePoints ?? [],
  );
  const [faqs, setFaqs] = useState<Faq[]>(initial?.faqs ?? []);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        slug,
        categorySlug,
        name,
        h1,
        metaTitle,
        metaDescription,
        intro,
        guideTitle,
        emptyState,
        guidePoints: guidePoints.filter((g) => g.title.trim() || g.body.trim()),
        faqs: faqs.filter((f) => f.q.trim() || f.a.trim()),
        isPublished,
      };
      const res = await fetch(
        isNew
          ? "/api/admin/category-pages"
          : `/api/admin/category-pages/${initial!.id}`,
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
      router.push("/admin/sayfalar");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Tekrar dene.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-6 sm:p-8 max-w-[760px] flex flex-col gap-7">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Link
            href="/admin/sayfalar"
            className="text-[13px] text-ink-500 hover:text-ink-900 transition"
          >
            ← Kategori sayfaları
          </Link>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-ink-900 mt-1">
            {isNew ? "Yeni kategori sayfası" : `Düzenle: ${initial?.name}`}
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

      {/* Kapak görseli */}
      {isNew ? (
        <p className="text-[13px] text-ink-500 bg-ink-50 border border-ink-100 rounded-[10px] px-3 py-2.5">
          Kapak görselini sayfayı <strong>oluşturduktan sonra</strong> ekleyebilirsin.
        </p>
      ) : (
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

      {/* Temel */}
      <Section title="Temel bilgiler">
        <Field label="Kısa ad (ör. Boyacı)">
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="URL slug (ör. boyaci)" hint="Sadece küçük harf, rakam, tire">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="boyaci"
              required
            />
          </Field>
          <Field label="Meslek kategorisi (işçi filtresi)">
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Sayfa başlığı H1 (ör. Pendik Boyacı)">
          <input value={h1} onChange={(e) => setH1(e.target.value)} required />
        </Field>
        <Field label="Giriş paragrafı">
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={4}
            required
          />
        </Field>
      </Section>

      {/* SEO */}
      <Section title="SEO etiketleri">
        <Field label="Meta başlık" hint={`${metaTitle.length}/120`}>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={120}
            required
          />
        </Field>
        <Field label="Meta açıklama" hint={`${metaDescription.length}/300`}>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            maxLength={300}
            required
          />
        </Field>
      </Section>

      {/* Rehber maddeleri */}
      <Section title="“Nelere dikkat etmeli” bölümü">
        <Field label="Bölüm başlığı">
          <input
            value={guideTitle}
            onChange={(e) => setGuideTitle(e.target.value)}
            required
          />
        </Field>
        <Repeater
          label="Maddeler"
          addLabel="+ Madde ekle"
          items={guidePoints}
          onAdd={() => setGuidePoints((p) => [...p, { title: "", body: "" }])}
          onRemove={(i) => setGuidePoints((p) => p.filter((_, x) => x !== i))}
          render={(it, i) => (
            <>
              <input
                placeholder="Başlık"
                value={it.title}
                onChange={(e) =>
                  setGuidePoints((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)),
                  )
                }
              />
              <textarea
                placeholder="Açıklama"
                rows={2}
                value={it.body}
                onChange={(e) =>
                  setGuidePoints((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, body: e.target.value } : x)),
                  )
                }
              />
            </>
          )}
        />
      </Section>

      {/* SSS */}
      <Section title="Sık sorulan sorular">
        <Repeater
          label="Sorular"
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
                  setFaqs((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, q: e.target.value } : x)),
                  )
                }
              />
              <textarea
                placeholder="Cevap"
                rows={2}
                value={it.a}
                onChange={(e) =>
                  setFaqs((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, a: e.target.value } : x)),
                  )
                }
              />
            </>
          )}
        />
      </Section>

      {/* Boş durum */}
      <Section title="Liste boşken gösterilecek metin">
        <Field label="Boş durum metni">
          <textarea
            value={emptyState}
            onChange={(e) => setEmptyState(e.target.value)}
            rows={2}
            required
          />
        </Field>
      </Section>

      {error && (
        <p className="rounded-[10px] bg-red-50 border border-red-100 px-3 py-2.5 text-[13.5px] text-red-700 m-0">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 sticky bottom-0 bg-white/90 backdrop-blur py-3 -mx-1 px-1">
        <button
          type="submit"
          disabled={saving}
          className="btn-ink h-11 px-6 rounded-full text-[14.5px] disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : isNew ? "Oluştur" : "Kaydet"}
        </button>
        <Link
          href="/admin/sayfalar"
          className="text-[14px] text-ink-500 hover:text-ink-900 transition"
        >
          Vazgeç
        </Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[15px] font-semibold text-ink-900 border-b border-ink-100 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
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
  label,
  addLabel,
  items,
  onAdd,
  onRemove,
  render,
}: {
  label: string;
  addLabel: string;
  items: T[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  render: (item: T, i: number) => React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[13px] font-medium text-ink-700 mb-2">{label}</div>
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-[12px] border border-ink-100 bg-ink-50 p-3 flex flex-col gap-2 relative"
          >
            {render(it, i)}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-2 right-2 text-[12px] text-ink-400 hover:text-red-600 transition"
            >
              Kaldır
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="btn-outline h-9 px-4 rounded-full text-[13px] mt-3"
      >
        {addLabel}
      </button>
    </div>
  );
}
