/**
 * İçerik filtresi: ilan başlığı + açıklamasını tarayarak küfür, pornografik
 * ve dolandırıcılık çağrışımı yapan ifadeleri yakalar.
 *
 * - HARD_BLOCK_WORDS: yakalandığında ilan oluşturulamaz, kullanıcıya hata gösterilir.
 * - SOFT_FLAG_WORDS: yakalandığında ilan kaydedilir ama status="pending_review"
 *   olur ve yayında görünmez; admin Aşama 7'de inceler.
 */

export type FilterCategory =
  | "profanity" // küfür
  | "explicit" // +18 / pornografik
  | "harassment" // hakaret/aşağılayıcı slur'lar
  | "scam"; // dolandırıcılık çağrışımı

const CATEGORY_LABELS: Record<FilterCategory, string> = {
  profanity: "küfür",
  explicit: "pornografik / +18 içerik",
  harassment: "hakaret",
  scam: "dolandırıcılık çağrışımı",
};

// HARD BLOCK — bu kelimeler ilanı doğrudan reddeder
const HARD_BLOCK: Record<
  Exclude<FilterCategory, "scam">,
  readonly string[]
> = {
  profanity: [
    "amk",
    "amq",
    "amına koyim",
    "amına koyam",
    "amına koyayım",
    "amına koyiim",
    "siktir",
    "siktirgit",
    "siktirin",
    "sikim",
    "sikiş",
    "sikecek",
    "sikiyim",
    "sikti",
    "yarrak",
    "yarak",
    "orospu",
    "oç",
    "piç",
    "götveren",
    "gotveren",
    "götlek",
    "ananı",
    "ananızı",
    "babanı",
    "ananın amı",
  ],
  explicit: [
    "porno",
    "porn",
    "sex chat",
    "seks chat",
    "escort",
    "eskort",
    "fetiş",
    "fetis",
    "anal seks",
    "oral seks",
    "masaj salonu",
    "+18 hizmet",
    "yetişkin hizmet",
    "yetişkin masaj",
    "cinsel masaj",
  ],
  harassment: ["ibne", "yobaz", "gavur"],
};

// SOFT FLAG — admin incelemesine düşürür
const SOFT_FLAG: Record<"scam", readonly string[]> = {
  scam: [
    "kolay para",
    "günde 5000",
    "günde 10000",
    "günlük 5000",
    "günlük 10000",
    "saatlik 1000",
    "bedava bitcoin",
    "ücretsiz kripto",
    "garanti kazanç",
    "anında para",
    "yatırımsız",
    "yatırımsız kazan",
    "evden 5000",
    "evden 10000",
    "hemen zengin",
    "hızlı zengin",
    "çok kazan",
    "tıkla kazan",
    "para iade",
    "iban onayı",
    "iban doğrula",
  ],
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPattern(words: readonly string[]): RegExp {
  const parts = words.map(escapeRegex).join("|");
  // Word-boundary ile başla, escape edilmiş kelime grubu, word-boundary ile bit
  return new RegExp(`(?:^|[^a-zçğıöşü])(?:${parts})(?=$|[^a-zçğıöşü])`, "gi");
}

const HARD_PATTERNS = Object.entries(HARD_BLOCK).map(
  ([category, words]) =>
    [category as FilterCategory, buildPattern(words)] as const,
);
const SOFT_PATTERNS = Object.entries(SOFT_FLAG).map(
  ([category, words]) =>
    [category as FilterCategory, buildPattern(words)] as const,
);

function normalize(text: string): string {
  return text.toLocaleLowerCase("tr-TR");
}

export type ContentCheckResult = {
  blockedCategories: FilterCategory[];
  flaggedCategories: FilterCategory[];
};

export function checkContent(...parts: string[]): ContentCheckResult {
  const text = " " + parts.map(normalize).join(" \n ") + " ";

  const blocked = new Set<FilterCategory>();
  for (const [category, pattern] of HARD_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) blocked.add(category);
  }

  const flagged = new Set<FilterCategory>();
  for (const [category, pattern] of SOFT_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) flagged.add(category);
  }

  return {
    blockedCategories: Array.from(blocked),
    flaggedCategories: Array.from(flagged),
  };
}

export function describeCategories(categories: FilterCategory[]): string {
  return categories.map((c) => CATEGORY_LABELS[c]).join(", ");
}
