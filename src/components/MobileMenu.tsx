"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/auth/LogoutButton";

type Props = {
  isLoggedIn: boolean;
  firstName?: string;
  isAdmin: boolean;
  unreadCount: number;
  pendingRequestCount: number;
};

export default function MobileMenu({
  isLoggedIn,
  firstName,
  isAdmin,
  unreadCount,
  pendingRequestCount,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const hasAlert = unreadCount > 0 || pendingRequestCount > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const drawerEl = (
    <div
      className={`fixed inset-0 z-[100] sm:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink-900/55 transition-opacity duration-300 ease-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        className={`absolute left-0 top-0 h-full w-[78vw] max-w-[320px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-center justify-end px-3 pt-3 shrink-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Menüyü kapat"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full text-ink-700 hover:bg-ink-100 transition"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-5 flex flex-col gap-2.5 shrink-0">
          {isLoggedIn ? (
            <>
              {firstName && (
                <p className="px-2 pb-1 text-[13px] text-ink-500 truncate">
                  Hoş geldin,{" "}
                  <span className="text-ink-900 font-medium">{firstName}</span>
                </p>
              )}
              <LogoutButton className="w-full inline-flex items-center justify-center h-11 px-4 rounded-full border border-ink-200 text-[14.5px] font-medium text-ink-900 hover:border-ink-900 transition" />
            </>
          ) : (
            <>
              <Link
                href="/giris"
                className="w-full inline-flex items-center justify-center h-11 px-4 rounded-full border border-ink-200 text-[14.5px] font-medium text-ink-900 hover:border-ink-900 transition"
              >
                Giriş
              </Link>
              <Link
                href="/kayit"
                className="btn-ink w-full h-11 px-4 rounded-full text-[14.5px]"
              >
                Hesap aç
              </Link>
            </>
          )}
        </div>

        <div className="mx-6 border-t border-ink-100" />

        <nav className="flex-1 overflow-y-auto px-6 py-5">
          <MenuLink href="/iscilar">Çevrendekiler</MenuLink>

          {isLoggedIn && (
            <>
              {!isAdmin && (
                <>
                  <MenuLink href="/panel/profil">Profilim</MenuLink>
                  <MenuLink href="/panel/talepler" badge={pendingRequestCount}>
                    Talepler
                  </MenuLink>
                  <MenuLink href="/panel/mesajlar" badge={unreadCount}>
                    Mesajlar
                  </MenuLink>
                </>
              )}
              {isAdmin && <MenuLink href="/admin">Admin</MenuLink>}
            </>
          )}
        </nav>

        <div className="px-6 py-5 shrink-0 flex items-center justify-center border-t border-ink-100">
          <Logo size="sm" />
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menüyü aç"
        aria-expanded={open}
        className="relative inline-flex items-center justify-center h-11 w-11 -mr-2 rounded-full text-ink-900 hover:bg-ink-100 transition"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        {hasAlert && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent-600" />
        )}
      </button>

      {mounted && createPortal(drawerEl, document.body)}
    </>
  );
}

function MenuLink({
  href,
  children,
  badge,
}: {
  href: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-3 text-[18px] font-semibold tracking-tight text-ink-900 hover:text-accent-600 transition"
    >
      <span>{children}</span>
      {badge && badge > 0 ? (
        <span
          className="inline-flex items-center justify-center h-[20px] min-w-[20px] px-1.5 rounded-full bg-accent-600 text-[11px] font-semibold"
          style={{ color: "#ffffff" }}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
