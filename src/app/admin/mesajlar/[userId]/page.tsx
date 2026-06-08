import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-auth";
import {
  getConversations,
  getThread,
  markThreadAsRead,
} from "@/lib/messages";
import { getInitials } from "@/lib/initials";
import { getPublicUrl } from "@/lib/r2";
import MessagesClient from "@/components/messages/MessagesClient";

export const metadata = { title: "Sohbet — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminThreadPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const admin = await requireAdmin();
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

  // Admin, pasif kullanıcılarla da yazışmayı görebilmeli (moderasyon için).
  if (!other) notFound();

  await markThreadAsRead(admin.id, userId);

  const [conversations, thread] = await Promise.all([
    getConversations(admin.id),
    getThread(admin.id, userId),
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
      basePath="/admin/mesajlar"
      meId={admin.id}
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
        fromMe: m.senderId === admin.id,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
