import { prisma } from "@/lib/db";
import { maskName } from "@/lib/masking";

export type ConversationSummary = {
  otherUserId: string;
  otherUserName: string;
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

type WorkerSettings = { showName?: boolean };

function displayNameFor(
  user: { fullName: string; professions: string[]; workerSettings: unknown },
  viewerIsCounterparty: boolean,
): string {
  if (viewerIsCounterparty) return user.fullName;
  if (user.professions.length === 0) return user.fullName;
  const settings = (user.workerSettings ?? {}) as WorkerSettings;
  return settings.showName ? user.fullName : maskName(user.fullName);
}

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
      professions: true,
      workerSettings: true,
    },
  });

  return others
    .map((o) => {
      const conv = byOtherUser.get(o.id)!;
      return {
        otherUserId: o.id,
        otherUserName: displayNameFor(o, true),
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
