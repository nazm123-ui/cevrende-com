export type FilterCategory =
  | "profanity"
  | "explicit"
  | "harassment"
  | "scam";

const CATEGORY_LABELS: Record<FilterCategory, string> = {
  profanity: "küfür",
  explicit: "pornografik / +18 içerik",
  harassment: "hakaret",
  scam: "dolandırıcılık / platform dışı yönlendirme",
};

const HARD_BLOCK: Record<
  Exclude<FilterCategory, "scam">,
  readonly string[]
> = {
  profanity: [
    "amk", "amq", "amına koyim", "amına koyam", "amına koyayım", "amına koyiim",
    "siktir", "siktirgit", "siktirin", "sikim", "sikiş", "sikecek", "sikiyim", "sikti",
    "yarrak", "yarak", "orospu", "oç", "piç", "götveren", "gotveren", "götlek",
    "ananı", "ananızı", "babanı", "ananın amı", "ananın",
    "göt", "götü", "götünü", "götüne", "götünde",
    "am", "amı", "amına", "amcık", "amcik", "taşak", "taşşak", "dalyarak",
    "salak", "salağı", "salaklık", "aptal", "aptallık",
    "mal", "manyak", "kafasız", "kafasiz", "beyinsiz",
    "şerefsiz", "serefsiz", "şıllık", "sıllık",
    "kaltak", "sürtük", "surtuk", "pezevenk", "kahpe", "kahbe",
    "aşağılık", "asagilik", "dangalak", "embesil",
    "gerizekalı", "gerizekali", "geri zekalı", "geri zekali",
    "gebertirim", "geberteceğim", "öldürürüm", "olduruyorum",
    "kafanı kırarım", "seni bulurum",
  ],
  explicit: [
    "porno", "porn", "sex chat", "seks chat",
    "escort", "eskort", "fetiş", "fetis", "anal seks", "oral seks",
    "masaj salonu", "+18 hizmet", "yetişkin hizmet", "yetişkin masaj", "cinsel masaj",
  ],
  harassment: [
    "ibne", "yobaz", "gavur",
    "nonoş", "nonos", "top", "lubunya", "lezo",
    "kürt köpeği", "kurt kopegi", "çingene", "cingene",
    "roman parası", "suriyeli pislik", "afgan pislik",
  ],
};

const SOFT_FLAG: Record<"scam", readonly string[]> = {
  scam: [
    "kolay para", "günde 5000", "günde 10000", "günlük 5000", "günlük 10000",
    "saatlik 1000", "bedava bitcoin", "ücretsiz kripto",
    "garanti kazanç", "anında para", "yatırımsız", "yatırımsız kazan",
    "evden 5000", "evden 10000", "hemen zengin", "hızlı zengin",
    "çok kazan", "tıkla kazan", "para iade",
    "iban onayı", "iban doğrula", "iban gönder", "iban at",
    "whatsapp number", "wp ekle", "wp at", "dm at",
    "havale gönder", "havale at",
    "kapora iste", "kapora ver", "kapora gönder",
    "ödeme önce", "önce ödeme", "ön ödeme yap",
    "papara", "papara hesap", "kart bilgisi", "kart numara",
  ],
};

const URL_PATTERN =
  /(https?:\/\/|www\.|t\.me\/|wa\.me\/|bit\.ly|tinyurl|telegram\.|whatsapp\.com|instagram\.com\/[a-z0-9_.]+|facebook\.com\/[a-z0-9_.]+|fb\.com\/[a-z0-9_.]+|twitter\.com\/[a-z0-9_.]+|x\.com\/[a-z0-9_.]+|tiktok\.com\/@?[a-z0-9_.]+|youtube\.com\/|youtu\.be\/)/i;

const PHONE_PATTERN =
  /(?:\+?9?0?[\s\-.]?)?5\d{2}[\s\-.]?\d{3}[\s\-.]?\d{2}[\s\-.]?\d{2}/;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPattern(words: readonly string[]): RegExp {
  const parts = words.map(escapeRegex).join("|");
  return new RegExp(
    `(?:^|[^a-zçğıöşüâîû])(?:${parts})(?=$|[^a-zçğıöşüâîû])`,
    "gi",
  );
}

const HARD_PATTERNS = Object.entries(HARD_BLOCK).map(
  ([category, words]) =>
    [category as FilterCategory, buildPattern(words)] as const,
);
const SOFT_PATTERNS = Object.entries(SOFT_FLAG).map(
  ([category, words]) =>
    [category as FilterCategory, buildPattern(words)] as const,
);

// Zero-width + invisible chars used to bypass keyword filters:
// ZWSP, ZWNJ, ZWJ, LRM/RLM, WJ, BOM, soft hyphen
const ZERO_WIDTH_RE = /[​-‏⁠﻿­]/g;

function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .replace(ZERO_WIDTH_RE, "")
    .toLocaleLowerCase("tr-TR");
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

  if (URL_PATTERN.test(text)) blocked.add("scam");
  if (PHONE_PATTERN.test(text)) blocked.add("scam");

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
