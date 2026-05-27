import { requireVerifiedUser } from "@/lib/require-auth";
import { getConversations } from "@/lib/messages";
import MessagesClient from "@/components/messages/MessagesClient";

export const metadata = { title: "Mesajlar — Cevrende.com" };
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

export default async function MesajlarPage() {
  const user = await requireVerifiedUser();
  const conversations = await getConversations(user.id);

  return (
    <MessagesClient
      meId={user.id}
      conversations={conversations.map((c) => ({
        otherUserId: c.otherUserId,
        otherUserName: c.otherUserName,
        initials: initialsOf(c.otherUserName),
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
