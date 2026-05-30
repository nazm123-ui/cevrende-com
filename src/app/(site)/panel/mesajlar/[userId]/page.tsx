import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import {
  getConversations,
  getThread,
  markThreadAsRead,
} from "@/lib/messages";
import { getInitials } from "@/lib/initials";
import { getPublicUrl } from "@/lib/r2";
import MessagesClient from "@/components/messages/MessagesClient";

export const metadata = { title: "Sohbet — Cevrende.com" };
export const dynamic = "force-dynamic";

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
      profilePhotoKey: true,
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
          otherUserPhotoUrl: other.profilePhotoKey
            ? getPublicUrl(other.profilePhotoKey)
            : null,
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
        initials: getInitials(c.otherUserName),
        photoUrl: c.otherUserPhotoUrl,
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
