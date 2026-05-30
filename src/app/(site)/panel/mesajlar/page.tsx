import { requireVerifiedUser } from "@/lib/require-auth";
import { getConversations } from "@/lib/messages";
import { getInitials } from "@/lib/initials";
import MessagesClient from "@/components/messages/MessagesClient";

export const metadata = { title: "Mesajlar — Cevrende.com" };
export const dynamic = "force-dynamic";

export default async function MesajlarPage() {
  const user = await requireVerifiedUser();
  const conversations = await getConversations(user.id);

  return (
    <MessagesClient
      meId={user.id}
      conversations={conversations.map((c) => ({
        otherUserId: c.otherUserId,
        otherUserName: c.otherUserName,
        initials: getInitials(c.otherUserName),
        photoUrl: c.otherUserPhotoUrl,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt.toISOString(),
        lastMessageFromMe: c.lastMessageFromMe,
        unreadCount: c.unreadCount,
      }))}
      activeUserId={null}
      activeMessages={[]}
    />
  );
}
