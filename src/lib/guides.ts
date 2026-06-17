// Yerel rehber içerikleri (/rehber/[slug]).
// Elle yazılmış, Pendik'e özgü, gerçekten faydalı evergreen makaleler.
// Uydurma fiyat/istatistik YOK — tavsiye odaklı, dürüst içerik.

export type GuideIcon = "camera" | "wave" | "thermometer" | "shield" | "wrench";

export type GuideBullet = { title?: string; body: string; icon?: GuideIcon };

export type GuideSection = {
  heading: string;
  /**
   * Bölüm görsel düzeni:
   * - "prose" (varsayılan): paragraf + kart maddeler
   * - "steps": numaralı adımlar
   * - "checklist": yeşil tikli kontrol listesi (açık kutu)
   * - "features": ikonlu özellik kartları
   */
  layout?: "prose" | "steps" | "checklist" | "features";
  paragraphs?: string[];
  bullets?: GuideBullet[];
};

export type GuideFaq = { q: string; a: string };

export type Guide = {
  slug: string;
  /** Sayfa H1'i / makale başlığı */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Liste/kart için kısa özet */
  excerpt: string;
  /** ISO tarih — schema datePublished/dateModified */
  publishedAt: string;
  updatedAt: string;
  /** Giriş paragrafı */
  intro: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  /** İlgili kategori sayfaları (/pendik/[slug]) — internal linking */
  relatedCategorySlugs: string[];
  /** Sol menü gruplaması — TOPICS anahtarı */
  topic: GuideTopicSlug;
  /** Kapak görseli (R2 URL). Yoksa konuya göre degrade placeholder gösterilir. */
  coverImage?: string | null;
};

// Rehber konuları — liste sayfasındaki sol menü ve kart rozetleri için.
// Görsel yüklenene kadar her konu için sade bir degrade placeholder kullanılır.
export type GuideTopicSlug =
  | "tadilat-insaat"
  | "tesisat-onarim"
  | "guvenlik-kilit"
  | "boya-badana"
  | "elektrik"
  | "genel";

export type GuideTopic = {
  slug: GuideTopicSlug;
  label: string;
  /** Placeholder degrade renkleri (hex) */
  from: string;
  to: string;
};

export const GUIDE_TOPICS: Record<GuideTopicSlug, GuideTopic> = {
  "tadilat-insaat": { slug: "tadilat-insaat", label: "Tadilat & İnşaat", from: "#9a8866", to: "#6f5f44" },
  "tesisat-onarim": { slug: "tesisat-onarim", label: "Tesisat & Onarım", from: "#6b8aa6", to: "#3f5d77" },
  "guvenlik-kilit": { slug: "guvenlik-kilit", label: "Güvenlik & Kilit", from: "#6e7378", to: "#41464b" },
  "boya-badana": { slug: "boya-badana", label: "Boya & Badana", from: "#7fa07f", to: "#4f6f4f" },
  elektrik: { slug: "elektrik", label: "Elektrik", from: "#b8a05a", to: "#8a7330" },
  genel: { slug: "genel", label: "Genel", from: "#8f9aa0", to: "#5d6870" },
};

// NOT: Rehber içerikleri artık DB'de (GuideArticle tablosu) yönetilir — bkz.
// src/lib/guides-db.ts ve /admin/rehber. Bu dosya yalnızca konu kayıtlarını
// (GUIDE_TOPICS), tarih biçimleyiciyi ve tipleri tutar.

export function formatGuideDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
