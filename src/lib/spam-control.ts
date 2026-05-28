import { prisma } from "@/lib/db";
import { getRedis } from "@/lib/rate-limit";

const DUPLICATE_WINDOW_MS = 60 * 60 * 1000; // 1 saat
const DUPLICATE_THRESHOLD = 3;
const STRIKE_TTL_SECONDS = 24 * 60 * 60; // 24 saat
const COOLDOWN_DURATIONS_MS = [
  5 * 60 * 1000, // 1. ihlal: 5 dk
  10 * 60 * 1000, // 2. ihlal: 10 dk
  30 * 60 * 1000, // 3+. ihlal: 30 dk
] as const;

export type SpamCheckResult =
  | { ok: true }
  | { ok: false; reason: string; retryAfterSeconds: number };

function normalize(content: string): string {
  return content.trim().toLowerCase();
}

function cooldownKey(userId: string): string {
  return `cev:spam:cooldown:${userId}`;
}

function strikeKey(userId: string): string {
  return `cev:spam:strikes:${userId}`;
}

function formatMinutes(ms: number): string {
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} dakika`;
}

// Önce cooldown'da mı bak; değilse, son 1 saatte aynı içerikten 3+ var mı diye
// sayıp gerekirse cooldown başlat. Upstash yoksa kontrol sessizce devre dışı kalır.
export async function checkMessageSpam(
  userId: string,
  content: string,
): Promise<SpamCheckResult> {
  const redis = getRedis();
  if (!redis) return { ok: true };

  // 1) Mevcut cooldown'u kontrol et
  const cooldownUntil = await redis.get<number>(cooldownKey(userId));
  if (cooldownUntil && typeof cooldownUntil === "number") {
    const remaining = cooldownUntil - Date.now();
    if (remaining > 0) {
      return {
        ok: false,
        reason: `Çok sık aynı mesajı gönderdiğin için ${formatMinutes(remaining)} bekleyip tekrar dener misin?`,
        retryAfterSeconds: Math.ceil(remaining / 1000),
      };
    }
  }

  // 2) Son 1 saatteki gönderimlerine bak, aynı içerikten kaç tane var?
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);
  const recent = await prisma.message.findMany({
    where: { senderId: userId, createdAt: { gte: since } },
    select: { content: true },
    take: 30,
  });

  const target = normalize(content);
  const duplicates = recent.filter((m) => normalize(m.content) === target).length;

  // Yeni mesajla beraber threshold'u aşıyor mu?
  if (duplicates + 1 < DUPLICATE_THRESHOLD) {
    return { ok: true };
  }

  // 3) Cooldown başlat (strike sayısına göre)
  const strikes = await redis.incr(strikeKey(userId));
  if (strikes === 1) {
    // İlk strike'da 24 saat TTL koy
    await redis.expire(strikeKey(userId), STRIKE_TTL_SECONDS);
  }
  const idx = Math.min(strikes - 1, COOLDOWN_DURATIONS_MS.length - 1);
  const cooldownMs = COOLDOWN_DURATIONS_MS[idx];
  const cooldownUntilMs = Date.now() + cooldownMs;
  await redis.set(cooldownKey(userId), cooldownUntilMs, {
    px: cooldownMs,
  });

  return {
    ok: false,
    reason: `Aynı mesajı çok tekrar gönderdin. ${formatMinutes(cooldownMs)} bekleyip tekrar dene.`,
    retryAfterSeconds: Math.ceil(cooldownMs / 1000),
  };
}
