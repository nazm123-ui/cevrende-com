import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireVerifiedUserApi } from "@/lib/require-auth";

const schema = z.object({
  endpoint: z.string().url().max(800),
  p256dh: z.string().min(20).max(200),
  auth: z.string().min(8).max(100),
  userAgent: z.string().max(300).optional(),
});

export async function POST(req: Request) {
  const auth = await requireVerifiedUserApi();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Form hatalı." }, { status: 400 });
  }

  const { endpoint, p256dh, auth: authKey, userAgent } = parsed.data;

  // Aynı endpoint zaten kayıtlıysa update et (idempotent)
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: {
      userId: auth.user.id,
      p256dh,
      auth: authKey,
      userAgent: userAgent ?? null,
      lastUsedAt: new Date(),
    },
    create: {
      userId: auth.user.id,
      endpoint,
      p256dh,
      auth: authKey,
      userAgent: userAgent ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}
