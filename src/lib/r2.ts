import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Cloudflare R2 S3-compatible API kullanır.
// Env değişkenleri Vercel'de set edilmediyse client null kalır, upload sessizce devre dışı.

let cachedClient: S3Client | null = null;
let checked = false;

function getClient(): S3Client | null {
  if (checked) return cachedClient;
  checked = true;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKey || !secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[r2] R2_ env değişkenleri eksik — upload devre dışı");
    }
    return null;
  }
  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });
  return cachedClient;
}

export function getBucket(): string {
  return process.env.R2_BUCKET_NAME ?? "cevrende-profile-photos";
}

export function getPublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL ?? "";
  return base ? `${base.replace(/\/+$/, "")}/${key}` : key;
}

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const client = getClient();
  if (!client) return { ok: false, error: "R2 yapılandırılmamış." };
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: getBucket(),
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return { ok: true };
  } catch (err) {
    console.error("[r2] upload failed:", err);
    return { ok: false, error: "Yükleme başarısız." };
  }
}

export async function deleteObject(key: string): Promise<void> {
  const client = getClient();
  if (!client) return;
  try {
    await client.send(
      new DeleteObjectCommand({ Bucket: getBucket(), Key: key }),
    );
  } catch (err) {
    console.warn("[r2] delete failed:", err);
  }
}
