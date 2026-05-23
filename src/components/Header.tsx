import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/messages";
import { getPendingIncomingCount } from "@/lib/contact-requests";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import LogoutButton from "@/components/auth/LogoutButton";

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
    <header className="bg-white border-b border-ink-100 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-xl text-brand-700 tracking-tight"
        >
          Cevrende<span className="text-accent-500">.com</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-ink-700">
          <Link href="/iscilar" className="hover:text-brand-700 transition">
            İşçiler
          </Link>

          {user ? (
            <>
              <Link
                href="/panel/profil"
                className="hover:text-brand-700 transition"
              >
                Profilim
              </Link>
              {!isAdmin && (
                <>
                  <Link
                    href="/panel/talepler"
                    className="relative hover:text-brand-700 transition"
                  >
                    Talepler
                    {pendingRequestCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-accent-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {pendingRequestCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/panel/mesajlar"
                    className="relative hover:text-brand-700 transition"
                  >
                    Mesajlar
                    {unreadCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-accent-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hover:text-brand-700 transition"
                >
                  Admin
                </Link>
              )}
              <span className="text-ink-500">
                Merhaba,{" "}
                <span className="font-semibold text-ink-900">{firstName}</span>
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/giris" className="hover:text-brand-700 transition">
                Giriş
              </Link>
              <Link
                href="/kayit"
                className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 transition"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>

        <div className="sm:hidden flex items-center gap-2 text-sm font-medium">
          <Link href="/iscilar" className="text-ink-700 hover:text-brand-700">
            İşçiler
          </Link>
          {user ? (
            <>
              <Link href="/panel/profil" className="text-brand-700">
                Profilim
              </Link>
              {!isAdmin && (
                <>
                  <Link href="/panel/talepler" className="relative text-brand-700">
                    Talepler
                    {pendingRequestCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-accent-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {pendingRequestCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/panel/mesajlar" className="relative text-brand-700">
                    Mesajlar
                    {unreadCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-accent-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link href="/admin" className="text-brand-700">
                  Admin
                </Link>
              )}
              <span className="text-ink-700">{firstName}</span>
              <LogoutButton className="text-brand-700 hover:underline" />
            </>
          ) : (
            <>
              <Link href="/giris" className="text-brand-700">
                Giriş
              </Link>
              <Link
                href="/kayit"
                className="rounded bg-brand-600 px-2 py-1 text-white hover:bg-brand-700 transition"
              >
                Kayıt
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
