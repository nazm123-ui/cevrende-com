import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { uploadObject, deleteObject, getPublicUrl } from "@/lib/r2";

const MAX_FILE_SIZE = 6 * 1024 * 1024;
const COVER_W = 1200;
const COVER_H = 630;
const WEBP_QUALITY = 82;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;

  const guide = await prisma.guideArticle.findUnique({
    where: { id },
    select: { id: true, coverImageKey: true },
  });
  if (!guide) {
    return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const file = formData.get("cover");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Görsel bulunamadı." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Dosya 6 MB'dan büyük olamaz." }, { status: 400 });
  }
  const contentType = (file.type || "image/jpeg").toLowerCase();
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "Sadece JPG/PNG/WebP/HEIC kabul ediliyor." },
      { status: 400 },
    );
  }

  let processed: Buffer;
  try {
    const ab = await file.arrayBuffer();
    processed = await sharp(Buffer.from(ab))
      .rotate()
      .resize(COVER_W, COVER_H, { fit: "cover", position: "centre" })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch (err) {
    console.error("[guide cover] sharp failed:", err);
    return NextResponse.json(
      { error: "Görsel işlenemedi. Başka bir görsel dene." },
      { status: 400 },
    );
  }

  const key = `guide-covers/${id}/${Date.now()}.webp`;
  const upload = await uploadObject(key, processed, "image/webp");
  if (!upload.ok) {
    return NextResponse.json({ error: upload.error }, { status: 503 });
  }

  await prisma.guideArticle.update({ where: { id }, data: { coverImageKey: key } });
  if (guide.coverImageKey && guide.coverImageKey !== key) {
    await deleteObject(guide.coverImageKey);
  }

  return NextResponse.json({ ok: true, key, url: getPublicUrl(key) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  const guide = await prisma.guideArticle.findUnique({
    where: { id },
    select: { coverImageKey: true },
  });
  if (guide?.coverImageKey) {
    await deleteObject(guide.coverImageKey);
  }
  await prisma.guideArticle.update({ where: { id }, data: { coverImageKey: null } });
  return NextResponse.json({ ok: true });
}
