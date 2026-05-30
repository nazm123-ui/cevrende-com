import { prisma } from "@/lib/db";
import { getPublicUrl } from "@/lib/r2";

export type ConversationSummary = {
  otherUserId: string;
  otherUserName: string;
  otherUserPhotoUrl: string | null;
  lastMessage: string;
  lastMessageAt: Date;
  lastMessageFromMe: boolean;
  unreadCount: number;
};

export type ThreadMessage = {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
};

export async function getConversations(
  userId: string,
): Promise<ConversationSummary[]> {
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { recipientId: userId }] },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      senderId: true,
      recipientId: true,
      content: true,
      createdAt: true,
      read: true,
    },
  });

  const byOtherUser = new Map<
    string,
    {
      lastMessage: string;
      lastMessageAt: Date;
      lastMessageFromMe: boolean;
      unreadCount: number;
    }
  >();

  for (const m of messages) {
    const otherId = m.senderId === userId ? m.recipientId : m.senderId;
    const existing = byOtherUser.get(otherId);
    if (!existing) {
      byOtherUser.set(otherId, {
        lastMessage: m.content,
        lastMessageAt: m.createdAt,
        lastMessageFromMe: m.senderId === userId,
        unreadCount: m.recipientId === userId && !m.read ? 1 : 0,
      });
    } else if (m.recipientId === userId && !m.read) {
      existing.unreadCount += 1;
    }
  }

  const otherIds = Array.from(byOtherUser.keys());
  if (otherIds.length === 0) return [];

  const others = await prisma.user.findMany({
    where: { id: { in: otherIds } },
    select: {
      id: true,
      fullName: true,
      profilePhotoKey: true,
    },
  });

  return others
    .map((o) => {
      const conv = byOtherUser.get(o.id)!;
      return {
        otherUserId: o.id,
        otherUserName: o.fullName,
        otherUserPhotoUrl: o.profilePhotoKey
          ? getPublicUrl(o.profilePhotoKey)
          : null,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        lastMessageFromMe: conv.lastMessageFromMe,
        unreadCount: conv.unreadCount,
      };
    })
    .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
}

export async function getThread(
  userId: string,
  otherUserId: string,
): Promise<ThreadMessage[]> {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      senderId: true,
      content: true,
      createdAt: true,
      read: true,
    },
  });
}

export async function markThreadAsRead(userId: string, otherUserId: string) {
  await prisma.message.updateMany({
    where: { senderId: otherUserId, recipientId: userId, read: false },
    data: { read: true, readAt: new Date() },
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.message.count({
    where: { recipientId: userId, read: false },
  });
}
