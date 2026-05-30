import { NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/db";
import { requireVerifiedUserApi } from "@/lib/require-auth";
import { uploadObject, deleteObject } from "@/lib/r2";
import { checkImageNsfw } from "@/lib/nsfw";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB upload limiti
const TARGET_SIZE = 512; // 512x512 px
const WEBP_QUALITY = 80;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export async function POST(req: Request) {
  const auth = await requireVerifiedUserApi();
  if (!auth.ok) return auth.response;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const file = formData.get("photo");
  if (!(file instanceof Blob)) {
    return NextResponse.json(
      { error: "Fotoğraf bulunamadı." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Dosya 5 MB'dan büyük olamaz." },
      { status: 400 },
    );
  }

  const contentType = file.type || "image/jpeg";
  if (!ALLOWED_TYPES.includes(contentType.toLowerCase())) {
    return NextResponse.json(
      { error: "Sadece JPG/PNG/WebP/HEIC kabul ediliyor." },
      { status: 400 },
    );
  }

  let inputBuffer: Buffer;
  try {
    const ab = await file.arrayBuffer();
    inputBuffer = Buffer.from(ab);
  } catch {
    return NextResponse.json({ error: "Dosya okunamadı." }, { status: 400 });
  }

  // Resize + WebP dönüşümü (sharp HEIC'i de işler eğer libheif yüklü)
  let processed: Buffer;
  try {
    processed = await sharp(inputBuffer)
      .rotate() // EXIF orientation'a göre döndür
      .resize(TARGET_SIZE, TARGET_SIZE, {
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch (err) {
    console.error("[photo upload] sharp failed:", err);
    return NextResponse.json(
      { error: "Görsel işlenemedi. Lütfen başka bir fotoğraf dene." },
      { status: 400 },
    );
  }

  // NSFW kontrolü — büyük orijinal yerine sıkıştırılmış 512px sürümle
  const nsfw = await checkImageNsfw(processed);
  if (!nsfw.ok) {
    return NextResponse.json({ error: nsfw.reason }, { status: 400 });
  }

  // R2'ye yükle: avatars/{userId}/{timestamp}.webp
  const timestamp = Date.now();
  const key = `avatars/${auth.user.id}/${timestamp}.webp`;
  const upload = await uploadObject(key, processed, "image/webp");
  if (!upload.ok) {
    return NextResponse.json({ error: upload.error }, { status: 503 });
  }

  // Eski fotoyu sil
  const existing = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: { profilePhotoKey: true },
  });

  await prisma.user.update({
    where: { id: auth.user.id },
    data: { profilePhotoKey: key },
  });

  if (existing?.profilePhotoKey && existing.profilePhotoKey !== key) {
    // Sessiz, başarısızlık önemli değil
    await deleteObject(existing.profilePhotoKey);
  }

  return NextResponse.json({ ok: true, key });
}

export async function DELETE() {
  const auth = await requireVerifiedUserApi();
  if (!auth.ok) return auth.response;

  const existing = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: { profilePhotoKey: true },
  });

  if (existing?.profilePhotoKey) {
    await deleteObject(existing.profilePhotoKey);
  }

  await prisma.user.update({
    where: { id: auth.user.id },
    data: { profilePhotoKey: null },
  });

  return NextResponse.json({ ok: true });
}
