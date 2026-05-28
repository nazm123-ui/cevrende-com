"use client";

import { usePathname } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";

const CRUMB_BY_PATH: Record<string, [string, string]> = {
  "/admin": ["Yönetim", "Genel"],
  "/admin/aktivite": ["Yönetim", "Aktivite"],
  "/admin/kullanicilar": ["Yönetim", "Kullanıcılar"],
  "/admin/raporlar": ["Yönetim", "Raporlar"],
  "/admin/kategoriler": ["Yönetim", "Kategoriler"],
};

function findCrumb(pathname: string): [string, string] {
  if (CRUMB_BY_PATH[pathname]) return CRUMB_BY_PATH[pathname];
  for (const key of Object.keys(CRUMB_BY_PATH)) {
    if (pathname.startsWith(key + "/")) return CRUMB_BY_PATH[key];
  }
  return ["Yönetim", "Admin"];
}

function openDrawer() {
  if (typeof document !== "undefined") {
    document.body.setAttribute("data-admin-drawer", "open");
  }
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const [parent, current] = findCrumb(pathname);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={openDrawer}
          aria-label="Menüyü aç"
        >
          <svg
            width="18"
            height="14"
            viewBox="0 0 18 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <line x1="1" y1="1" x2="17" y2="1" />
            <line x1="1" y1="7" x2="17" y2="7" />
            <line x1="1" y1="13" x2="17" y2="13" />
          </svg>
        </button>
        <div className="crumb">
          <span>{parent}</span>
          <span className="sep">/</span>
          <b>{current}</b>
        </div>
      </div>
      <div className="row" style={{ gap: 10 }}>
        <div className="search topbar-search">
          <AdminIcon name="search" size={15} color="var(--muted)" />
          <input placeholder="Kullanıcı, ilan, kategori ara…" disabled />
          <span className="kbd">⌘K</span>
        </div>
      </div>
    </div>
  );
}
