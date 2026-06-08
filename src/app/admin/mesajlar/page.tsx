import { requireAdmin } from "@/lib/require-auth";
import { getConversations } from "@/lib/messages";
import { getInitials } from "@/lib/initials";
import MessagesClient from "@/components/messages/MessagesClient";

export const metadata = { title: "Mesajlar — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminMesajlarPage() {
  const admin = await requireAdmin();
  const conversations = await getConversations(admin.id);

  return (
    <MessagesClient
      basePath="/admin/mesajlar"
      meId={admin.id}
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
