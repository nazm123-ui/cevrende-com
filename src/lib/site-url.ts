// Site'ın kanonik URL'i. Custom domain bağlandığında NEXT_PUBLIC_SITE_URL'i
// Vercel env'inden değiştirmek yeterli — her metadata/robots/sitemap çağrısı
// otomatik güncellenir.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cevrende.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Cevrende";

export function absoluteUrl(path: string = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
