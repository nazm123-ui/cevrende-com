import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import {
  getConversations,
  getThread,
  markThreadAsRead,
} from "@/lib/messages";
import MessagesClient from "@/components/messages/MessagesClient";

export const metadata = { title: "Sohbet — Cevrende.com" };
export const dynamic = "force-dynamic";

function initialsOf(name: string): string {
  return name
    .replace(/\*+/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const me = await requireVerifiedUser();
  const { userId } = await params;

  const other = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      isActive: true,
    },
  });

  if (!other || !other.isActive) notFound();

  await markThreadAsRead(me.id, userId);

  const [conversations, thread] = await Promise.all([
    getConversations(me.id),
    getThread(me.id, userId),
  ]);

  const inList = conversations.some((c) => c.otherUserId === userId);
  const conversationList = inList
    ? conversations
    : [
        {
          otherUserId: other.id,
          otherUserName: other.fullName,
          lastMessage: "",
          lastMessageAt: new Date(),
          lastMessageFromMe: false,
          unreadCount: 0,
        },
        ...conversations,
      ];

  return (
    <MessagesClient
      meId={me.id}
      conversations={conversationList.map((c) => ({
        otherUserId: c.otherUserId,
        otherUserName: c.otherUserName,
        initials: initialsOf(c.otherUserName),
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt.toISOString(),
        lastMessageFromMe: c.lastMessageFromMe,
        unreadCount: c.unreadCount,
      }))}
      activeUserId={userId}
      activeMessages={thread.map((m) => ({
        id: m.id,
        fromMe: m.senderId === me.id,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
