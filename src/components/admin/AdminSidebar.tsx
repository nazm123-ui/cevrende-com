"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";

type Counts = {
  users: number;
  reports: number;
  categories: number;
  districts: number;
  suggestions: number;
  messages: number;
};

type Props = {
  counts: Counts;
  adminName: string;
  adminInitials: string;
};

const NAV = {
  primary: [
    { href: "/admin", id: "dashboard", icon: "dashboard", label: "Genel" },
    { href: "/admin/aktivite", id: "activity", icon: "activity", label: "Aktivite" },
  ],
  management: [
    {
      href: "/admin/mesajlar",
      id: "messages",
      icon: "msg",
      label: "Mesajlar",
      countKey: "messages" as const,
      dotIfOpen: true,
    },
    {
      href: "/admin/kullanicilar",
      id: "users",
      icon: "users",
      label: "Kullanıcılar",
      countKey: "users" as const,
    },
    {
      href: "/admin/raporlar",
      id: "reports",
      icon: "flag",
      label: "Raporlar",
      countKey: "reports" as const,
      dotIfOpen: true,
    },
    {
      href: "/admin/kategoriler",
      id: "categories",
      icon: "tag",
      label: "Kategoriler",
      countKey: "categories" as const,
    },
    {
      href: "/admin/sayfalar",
      id: "pages",
      icon: "edit",
      label: "Sayfalar",
    },
    {
      href: "/admin/oneriler",
      id: "suggestions",
      icon: "msg",
      label: "Öneriler",
      countKey: "suggestions" as const,
      dotIfOpen: true,
    },
    {
      href: "/admin/ilceler",
      id: "districts",
      icon: "pin",
      label: "İlçeler",
      countKey: "districts" as const,
    },
  ],
} as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function closeDrawer() {
  if (typeof document !== "undefined") {
    document.body.removeAttribute("data-admin-drawer");
  }
}

export default function AdminSidebar({
  counts,
  adminName,
  adminInitials,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Path değişimde drawer'ı kapat (mobile)
  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  async function logout() {
    closeDrawer();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <div
        className="sidebar-backdrop"
        onClick={closeDrawer}
        aria-hidden
      />
    <aside className="sidebar">
      <div className="brand">
        <span className="logomark" />
        <span className="wordmark">çevrende</span>
        <span className="brand-tag">admin</span>
      </div>

      <div className="nav-group">
        {NAV.primary.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={"nav-item" + (active ? " is-active" : "")}
            >
              <AdminIcon name={item.icon} size={16} strokeWidth={1.6} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="nav-group">
        <div className="nav-group-label">Yönetim</div>
        {NAV.management.map((item) => {
          const active = isActive(pathname, item.href);
          const count = "countKey" in item ? counts[item.countKey] : 0;
          const showDot = "dotIfOpen" in item && item.dotIfOpen && count > 0;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={"nav-item" + (active ? " is-active" : "")}
            >
              <AdminIcon name={item.icon} size={16} strokeWidth={1.6} />
              <span>{item.label}</span>
              {count > 0 ? (
                <span className="nav-count num">{count}</span>
              ) : showDot ? (
                <span className="nav-dot" />
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="nav-group">
        <div className="nav-group-label">Hesap</div>
        <Link href="/" className="nav-item">
          <AdminIcon name="external" size={16} strokeWidth={1.6} />
          <span>Siteyi aç</span>
        </Link>
      </div>

      <div className="nav-bottom">
        <div className="admin-card">
          <div className="avatar">{adminInitials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {adminName}
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--muted)" }}
            >
              Yönetici
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="btn btn-ghost btn-icon btn-sm"
            aria-label="Çıkış"
            title="Çıkış"
            style={{ width: 30, height: 30 }}
          >
            <AdminIcon name="logout" size={14} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
