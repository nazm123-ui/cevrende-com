import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireVerifiedUserApi } from "@/lib/require-auth";

const schema = z.object({
  endpoint: z.string().url().max(800),
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

  await prisma.pushSubscription
    .deleteMany({
      where: { endpoint: parsed.data.endpoint, userId: auth.user.id },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
