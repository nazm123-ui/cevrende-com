import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

const PRIVATE_PATHS = [
  "/api/",
  "/admin",
  "/admin/",
  "/panel",
  "/panel/",
  "/dogrulama",
  "/sifre-sifirla",
];

// AI search engine bot'ları açıkça izinli — bunlar bizi cevaplarda
// kaynak olarak gösterebilir (ChatGPT, Perplexity, Claude, Gemini, Copilot).
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
