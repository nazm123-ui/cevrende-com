import { getCurrentUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/messages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartbeatProvider from "@/components/HeartbeatProvider";
import BadgeSync from "@/components/BadgeSync";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const unreadCount = user ? await getUnreadCount(user.id) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 min-w-0 w-full">{children}</main>
      <Footer />
      <HeartbeatProvider enabled={!!user} />
      <BadgeSync unreadCount={unreadCount} />
    </div>
  );
}
