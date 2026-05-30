// Cloudflare Workers AI ile NSFW tespit. resnet-50 hızlı ve ücretsiz
// (10K istek/gün bedava). Açıkça NSFW kategori dönerse reject ederiz.

const MODEL = "@cf/microsoft/resnet-50";

// Bu model ImageNet sınıfları döner. NSFW için doğrudan bir kategori yok ama
// resnet-50'nin "imagenet" sınıflarında bikini/lingerie/swimming_trunks vs.
// gibi yetişkin içerik göstergeleri var. Daha güvenilir alternatif:
// @cf/falconsai/nsfw_image_detection (NSFW spesifik model)
const SPECIFIC_NSFW_MODEL = "@cf/falconsai/nsfw_image_detection";

type ClassificationResult = {
  label: string;
  score: number;
};

type CloudflareResponse = {
  result?: ClassificationResult[];
  success?: boolean;
  errors?: Array<{ message: string }>;
};

export type NsfwCheckResult =
  | { ok: true }
  | { ok: false; reason: string; nsfwScore?: number };

const NSFW_THRESHOLD = 0.7; // 0.7 üzeri puanı reject

export async function checkImageNsfw(
  imageBuffer: Buffer,
): Promise<NsfwCheckResult> {
  const accountId = process.env.CF_ACCOUNT_ID ?? process.env.R2_ACCOUNT_ID;
  const apiToken = process.env.CF_API_TOKEN;
  if (!accountId || !apiToken) {
    // Env eksikse moderasyon devre dışı — geliştirme/test için izin ver
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[nsfw] CF_ACCOUNT_ID / CF_API_TOKEN eksik — moderasyon devre dışı",
      );
    }
    return { ok: true };
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${SPECIFIC_NSFW_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/octet-stream",
        },
        body: new Uint8Array(imageBuffer),
      },
    );
    if (!res.ok) {
      console.warn("[nsfw] API hatası:", res.status);
      // API hatasında yine kabul et (kullanıcı engellenmesin)
      return { ok: true };
    }
    const data = (await res.json()) as CloudflareResponse;
    if (!data.success || !data.result) {
      console.warn("[nsfw] beklenmeyen response:", data);
      return { ok: true };
    }

    // falconsai modeli "nsfw" ve "normal" döner
    const nsfwEntry = data.result.find((r) => r.label.toLowerCase() === "nsfw");
    const nsfwScore = nsfwEntry?.score ?? 0;

    if (nsfwScore >= NSFW_THRESHOLD) {
      return {
        ok: false,
        reason:
          "Fotoğraf otomatik moderasyon kontrolünden geçemedi. Lütfen yüze odaklanan, uygun bir fotoğraf yükle.",
        nsfwScore,
      };
    }
    return { ok: true };
  } catch (err) {
    console.error("[nsfw] check failed:", err);
    // Hata durumunda hata kullanıcıya yansımasın
    return { ok: true };
  }
}

export { MODEL, SPECIFIC_NSFW_MODEL };
