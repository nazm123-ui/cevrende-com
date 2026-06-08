import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import { uploadObject, deleteObject, getPublicUrl } from "@/lib/r2";
import { checkImageNsfw } from "@/lib/nsfw";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const TARGET_SIZE = 512;
const WEBP_QUALITY = 80;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

// Admin, kullanıcı adına profil fotoğrafı yükler (yaşlı/teknik bilgisi az
// kullanıcılar kendileri yükleyemediğinde). İşleme akışı /api/profile/photo
// ile aynı: 512px'e kırp, WebP'ye çevir, NSFW kontrolü, R2'ye yükle.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await assertAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }
  const { id } = await params;

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, profilePhotoKey: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const file = formData.get("photo");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Fotoğraf bulunamadı." }, { status: 400 });
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
    inputBuffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return NextResponse.json({ error: "Dosya okunamadı." }, { status: 400 });
  }

  let processed: Buffer;
  try {
    processed = await sharp(inputBuffer)
      .rotate()
      .resize(TARGET_SIZE, TARGET_SIZE, { fit: "cover", position: "centre" })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch (err) {
    console.error("[admin photo] sharp failed:", err);
    return NextResponse.json(
      { error: "Görsel işlenemedi. Başka bir fotoğraf dene." },
      { status: 400 },
    );
  }

  const nsfw = await checkImageNsfw(processed);
  if (!nsfw.ok) {
    return NextResponse.json({ error: nsfw.reason }, { status: 400 });
  }

  const key = `avatars/${target.id}/${Date.now()}.webp`;
  const upload = await uploadObject(key, processed, "image/webp");
  if (!upload.ok) {
    return NextResponse.json({ error: upload.error }, { status: 503 });
  }

  await prisma.user.update({
    where: { id: target.id },
    data: { profilePhotoKey: key },
  });

  if (target.profilePhotoKey && target.profilePhotoKey !== key) {
    await deleteObject(target.profilePhotoKey);
  }

  return NextResponse.json({ ok: true, url: getPublicUrl(key) });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await assertAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }
  const { id } = await params;

  const target = await prisma.user.findUnique({
    where: { id },
    select: { profilePhotoKey: true },
  });
  if (target?.profilePhotoKey) {
    await deleteObject(target.profilePhotoKey);
  }

  await prisma.user.update({
    where: { id },
    data: { profilePhotoKey: null },
  });

  return NextResponse.json({ ok: true });
}
