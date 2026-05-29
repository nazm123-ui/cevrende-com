import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import { sendMessageSchema } from "@/lib/validators";
import { checkContent, describeCategories } from "@/lib/content-filter";
import { getThread, markThreadAsRead } from "@/lib/messages";
import { checkMessageSpam } from "@/lib/spam-control";
import { sendPushToUser } from "@/lib/push";

export async function POST(req: Request) {
  const user = await requireVerifiedUser();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Mesaj hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { recipientId, content } = parsed.data;

  if (recipientId === user.id) {
    return NextResponse.json(
      { error: "Kendine mesaj gönderemezsin." },
      { status: 400 },
    );
  }

  const filter = checkContent(content);
  if (filter.blockedCategories.length > 0) {
    return NextResponse.json(
      {
        error: `Mesaj uygunsuz içerik barındırıyor (${describeCategories(filter.blockedCategories)}).`,
      },
      { status: 400 },
    );
  }

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    select: { id: true, isActive: true },
  });
  if (!recipient || !recipient.isActive) {
    return NextResponse.json(
      { error: "Alıcı bulunamadı." },
      { status: 404 },
    );
  }

  const spam = await checkMessageSpam(user.id, content);
  if (!spam.ok) {
    return NextResponse.json(
      { error: spam.reason },
      {
        status: 429,
        headers: { "Retry-After": String(spam.retryAfterSeconds) },
      },
    );
  }

  const message = await prisma.message.create({
    data: {
      senderId: user.id,
      recipientId,
      content,
    },
    select: {
      id: true,
      senderId: true,
      content: true,
      createdAt: true,
      read: true,
    },
  });

  // Push bildirimi alıcıya — response sonrası asenkron, hiçbir hata
  // mesaj kaydını etkilemesin.
  after(async () => {
    try {
      const preview =
        content.length > 80 ? content.slice(0, 77) + "..." : content;
      await sendPushToUser(recipientId, {
        title: `${user.fullName}`,
        body: preview,
        url: `/panel/mesajlar/${user.id}`,
        tag: `msg-${user.id}`,
      });
    } catch (err) {
      console.error("[messages] push failed:", err);
    }
  });

  return NextResponse.json({ ok: true, message });
}

export async function GET(req: Request) {
  const user = await requireVerifiedUser();
  const { searchParams } = new URL(req.url);
  const otherUserId = searchParams.get("with");

  if (!otherUserId) {
    return NextResponse.json(
      { error: "Sohbet partneri belirtilmedi." },
      { status: 400 },
    );
  }

  const [messages] = await Promise.all([
    getThread(user.id, otherUserId),
    markThreadAsRead(user.id, otherUserId),
  ]);

  return NextResponse.json({ messages });
}
