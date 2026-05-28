import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const TIERS = {
  auth: { requests: 10, window: "1 m" as Duration },
  "auth-strict": { requests: 3, window: "10 m" as Duration },
  messages: { requests: 30, window: "1 m" as Duration },
} as const;

type Tier = keyof typeof TIERS;

let redisClient: Redis | null = null;
let redisChecked = false;
const limiters: Partial<Record<Tier, Ratelimit>> = {};

export function getRedis(): Redis | null {
  if (redisChecked) return redisClient;
  redisChecked = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN missing — rate limiting DISABLED.",
      );
    }
    return null;
  }
  redisClient = new Redis({ url, token });
  return redisClient;
}

function getLimiter(tier: Tier): Ratelimit | null {
  const cached = limiters[tier];
  if (cached) return cached;
  const r = getRedis();
  if (!r) return null;
  const { requests, window } = TIERS[tier];
  const limiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `cev:rl:${tier}`,
    analytics: false,
  });
  limiters[tier] = limiter;
  return limiter;
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") || "anon";
}

export async function checkRateLimit(
  req: Request,
  tier: Tier,
): Promise<NextResponse | null> {
  const limiter = getLimiter(tier);
  if (!limiter) return null;

  const ip = getClientIp(req);
  try {
    const { success, reset, remaining } = await limiter.limit(ip);
    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          error:
            "Çok fazla istek attınız. Lütfen biraz sonra tekrar deneyin.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": String(remaining),
          },
        },
      );
    }
  } catch (err) {
    console.error("[rate-limit] limiter.limit failed:", err);
    return null;
  }
  return null;
}
