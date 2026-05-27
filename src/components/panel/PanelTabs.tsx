"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  href: string;
  label: string;
  badge?: number;
};

export default function PanelTabs({ unreadCount }: { unreadCount?: number }) {
  const pathname = usePathname();
  const tabs: Tab[] = [
    { href: "/panel/profil", label: "Profilim" },
    { href: "/panel/mesajlar", label: "Mesajlar", badge: unreadCount },
  ];

  return (
    <div className="border-b border-ink-100 bg-ink-50/80 backdrop-blur-md sticky top-[72px] z-30">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <nav className="flex gap-1 -mb-px overflow-x-auto" role="tablist">
          {tabs.map((t) => {
            const active =
              pathname === t.href ||
              (t.href === "/panel/mesajlar" &&
                pathname.startsWith("/panel/mesajlar"));
            return (
              <Link
                key={t.href}
                href={t.href}
                role="tab"
                aria-selected={active}
                className={`relative inline-flex items-center gap-2 px-4 py-3.5 text-[14px] font-medium whitespace-nowrap border-b-2 transition ${
                  active
                    ? "border-ink-900 text-ink-900"
                    : "border-transparent text-ink-500 hover:text-ink-900"
                }`}
              >
                {t.label}
                {t.badge && t.badge > 0 ? (
                  <span
                    className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded-full bg-accent-600 text-[10.5px] font-semibold"
                    style={{ color: "#ffffff" }}
                  >
                    {t.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
