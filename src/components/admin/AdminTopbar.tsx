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
  // Check parent paths (e.g. /admin/raporlar/abc → /admin/raporlar)
  for (const key of Object.keys(CRUMB_BY_PATH)) {
    if (pathname.startsWith(key + "/")) return CRUMB_BY_PATH[key];
  }
  return ["Yönetim", "Admin"];
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const [parent, current] = findCrumb(pathname);

  return (
    <div className="topbar">
      <div className="crumb">
        <span>{parent}</span>
        <span className="sep">/</span>
        <b>{current}</b>
      </div>
      <div className="row" style={{ gap: 10 }}>
        <div className="search">
          <AdminIcon name="search" size={15} color="var(--muted)" />
          <input placeholder="Kullanıcı, ilan, kategori ara…" disabled />
          <span className="kbd">⌘K</span>
        </div>
      </div>
    </div>
  );
}
