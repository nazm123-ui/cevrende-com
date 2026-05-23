import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/messages";
import { getPendingIncomingCount } from "@/lib/contact-requests";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/auth/LogoutButton";
import MobileMenu from "@/components/MobileMenu";

export default async function Header() {
  const user = await getCurrentUser();
  const firstName = user?.fullName.split(" ")[0];
  const isAdmin = isAdminEmail(user?.email);
  const showCounters = !!user && user.isEmailVerified && !isAdmin;
  const [unreadCount, pendingRequestCount] = showCounters
    ? await Promise.all([
        getUnreadCount(user.id),
        getPendingIncomingCount(user.id),
      ])
    : [0, 0];

  return (
    <header
      className="sticky top-0 z-40 border-b border-ink-100 bg-ink-50/80 backdrop-blur-md backdrop-saturate-150"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 h-[72px] flex items-center justify-between">
        <Logo />

        <nav className="hidden sm:flex items-center gap-1 text-[14.5px]">
          <Link
            href="/iscilar"
            className="px-3 py-2 text-ink-500 hover:text-ink-900 transition tracking-tight"
          >
            Çevrendekiler
          </Link>

          {user ? (
            <>
              <Link
                href="/panel/profil"
                className="px-3 py-2 text-ink-500 hover:text-ink-900 transition tracking-tight"
              >
                Profilim
              </Link>
              {!isAdmin && (
                <>
                  <Link
                    href="/panel/talepler"
                    className="relative px-3 py-2 text-ink-500 hover:text-ink-900 transition tracking-tight"
                  >
                    Talepler
                    {pendingRequestCount > 0 && (
                      <Badge>{pendingRequestCount}</Badge>
                    )}
                  </Link>
                  <Link
                    href="/panel/mesajlar"
                    className="relative px-3 py-2 text-ink-500 hover:text-ink-900 transition tracking-tight"
                  >
                    Mesajlar
                    {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-3 py-2 text-ink-500 hover:text-ink-900 transition tracking-tight"
                >
                  Admin
                </Link>
              )}
              <span className="ml-3 text-sm text-ink-500">
                {firstName}
              </span>
              <LogoutButton className="ml-2 inline-flex items-center justify-center h-9 px-4 rounded-full text-[13.5px] font-medium text-ink-700 hover:bg-ink-100 transition" />
            </>
          ) : (
            <div className="ml-3 flex items-center gap-2">
              <Link
                href="/giris"
                className="inline-flex items-center justify-center h-9 px-4 rounded-full text-[13.5px] font-medium text-ink-700 hover:bg-ink-100 transition"
              >
                Giriş
              </Link>
              <Link
                href="/kayit"
                className="btn-ink h-9 px-4 rounded-full text-[13.5px]"
              >
                Kayıt ol
              </Link>
            </div>
          )}
        </nav>

        <div className="sm:hidden">
          <MobileMenu
            isLoggedIn={!!user}
            firstName={firstName}
            isAdmin={isAdmin}
            unreadCount={unreadCount}
            pendingRequestCount={pendingRequestCount}
          />
        </div>
      </div>
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="ml-1 inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded-full bg-accent-600 text-[10.5px] font-semibold"
      style={{ color: "#ffffff" }}
    >
      {children}
    </span>
  );
}
