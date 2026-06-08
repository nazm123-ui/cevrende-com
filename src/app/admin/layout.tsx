import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-auth";
import { getUnreadCount } from "@/lib/messages";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import "./admin.css";

export const metadata = { title: "Admin — Cevrende.com" };

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Çe";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  const [
    usersCount,
    categoriesCount,
    openReportsCount,
    districtsCount,
    pendingSuggestionsCount,
    unreadMessagesCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.jobCategory.count({ where: { isActive: true } }),
    prisma.messageReport.count({ where: { status: "open" } }),
    prisma.district.count({ where: { isEnabled: true } }),
    prisma.categorySuggestion.count({ where: { status: "pending" } }),
    getUnreadCount(admin.id),
  ]);

  return (
    <div className="admin-app">
      <div className="app">
        <AdminSidebar
          counts={{
            users: usersCount,
            reports: openReportsCount,
            categories: categoriesCount,
            districts: districtsCount,
            suggestions: pendingSuggestionsCount,
            messages: unreadMessagesCount,
          }}
          adminName={admin.fullName}
          adminInitials={initialsFrom(admin.fullName)}
        />
        <div className="main">
          <AdminTopbar />
          <div className="content page-fade">{children}</div>
        </div>
      </div>
    </div>
  );
}
