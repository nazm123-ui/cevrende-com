import { requireVerifiedUser } from "@/lib/require-auth";
import { getUnreadCount } from "@/lib/messages";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import PanelTabs from "@/components/panel/PanelTabs";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireVerifiedUser();
  const isAdmin = isAdminEmail(user.email);
  const unreadCount = isAdmin ? 0 : await getUnreadCount(user.id);

  return (
    <>
      <PanelTabs unreadCount={unreadCount} />
      {children}
    </>
  );
}
