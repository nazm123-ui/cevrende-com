// Kategori landing sayfaları (/pendik/[meslek]) için TİPLER + yardımcılar.
// NOT: İçerik artık DB'de (CategoryPage tablosu) yönetilir — bkz.
// src/lib/category-pages-db.ts ve /admin/sayfalar. Bu dosya yalnızca tipleri
// ve soruEki (Türkçe ünlü uyumu) yardımcısını tutar.

export type CategoryFaq = { q: string; a: string };

export type CategoryGuidePoint = { title: string; body: string };

export type CategoryPage = {
  /** URL ve DB kategori slug'ı (örn. "boyaci") */
  slug: string;
  /** İşçi filtrelemesi için DB jobCategory.slug — genelde slug ile aynı */
  categorySlug: string;
  /** Kısa meslek adı, örn. "Boyacı" */
  name: string;
  /** Sayfa H1'i, örn. "Pendik Boyacı" */
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** Giriş paragrafı */
  intro: string;
  /** "Nelere dikkat etmeli" rehberi */
  guideTitle: string;
  guidePoints: CategoryGuidePoint[];
  /** İşçi listesi boşken gösterilecek kısa metin */
  emptyState: string;
  faqs: CategoryFaq[];
};

// Türkçe ünlü uyumuna göre "mısın / misin / musun / müsün" soru ekini döndürür.
// Örn: "Boyacı" → "mısın", "Elektrikçi" → "misin", "Şoför" → "müsün".
export function soruEki(word: string): string {
  const vowels = word.toLocaleLowerCase("tr").match(/[aeıioöuü]/g);
  const last = vowels ? vowels[vowels.length - 1] : "i";
  if (last === "a" || last === "ı") return "mısın";
  if (last === "o" || last === "u") return "musun";
  if (last === "ö" || last === "ü") return "müsün";
  return "misin"; // e, i
}
