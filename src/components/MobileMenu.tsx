"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menüyü aç"
        className="inline-flex items-center justify-center h-11 w-11 -mr-2 rounded-full text-ink-900 hover:bg-ink-100 transition"
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
        {(unreadCount > 0 || pendingRequestCount > 0) && (
          <span className="absolute mt-[-14px] ml-[14px] h-2.5 w-2.5 rounded-full bg-accent-600" />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-0 h-full w-[82vw] max-w-[340px] bg-ink-50 shadow-xl flex flex-col"
            style={{
              paddingTop: "max(env(safe-area-inset-top), 0px)",
              paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
            }}
          >
            <div className="flex items-center justify-between px-5 h-[72px] border-b border-ink-100">
              <span className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
                {isLoggedIn ? firstName : "Menü"}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Menüyü kapat"
                className="inline-flex items-center justify-center h-11 w-11 -mr-2 rounded-full text-ink-900 hover:bg-ink-100 transition"
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
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <MenuLink href="/iscilar">Çevrendekiler</MenuLink>

              {isLoggedIn ? (
                <>
                  <MenuLink href="/panel/profil">Profilim</MenuLink>
                  {!isAdmin && (
                    <>
                      <MenuLink
                        href="/panel/talepler"
                        badge={pendingRequestCount}
                      >
                        Talepler
                      </MenuLink>
                      <MenuLink href="/panel/mesajlar" badge={unreadCount}>
                        Mesajlar
                      </MenuLink>
                    </>
                  )}
                  {isAdmin && <MenuLink href="/admin">Admin</MenuLink>}
                </>
              ) : null}
            </nav>

            <div className="px-5 py-4 border-t border-ink-100">
              {isLoggedIn ? (
                <LogoutButton className="w-full inline-flex items-center justify-center h-12 px-4 rounded-full border border-ink-200 text-[15px] font-medium text-ink-900 hover:border-ink-900 transition" />
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/giris"
                    className="w-full inline-flex items-center justify-center h-12 px-4 rounded-full border border-ink-200 text-[15px] font-medium text-ink-900 hover:border-ink-900 transition"
                  >
                    Giriş
                  </Link>
                  <Link
                    href="/kayit"
                    className="btn-ink w-full h-12 px-4 rounded-full text-[15px]"
                  >
                    Ücretsiz kayıt
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
      className="flex items-center justify-between h-12 px-3 rounded-[10px] text-[16px] text-ink-900 hover:bg-ink-100 transition"
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
