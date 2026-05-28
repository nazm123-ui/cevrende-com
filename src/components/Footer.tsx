import { headers } from "next/headers";
import Link from "next/link";
import Logo from "@/components/Logo";

export default async function Footer() {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer
      className="border-t border-ink-100 pt-14 pb-10 bg-ink-50 mt-12"
      style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="footer-grid mx-auto max-w-[1200px] px-5 sm:px-6 grid gap-10 sm:gap-12 grid-cols-2 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 sm:col-span-1">
          <Logo size="sm" />
          <p className="mt-4 text-[13.5px] text-ink-500 max-w-[280px] leading-relaxed">
            Pendik ve çevresindeki iş arayanlarla işverenleri doğrudan
            buluşturur.
          </p>
        </div>

        <FooterCol title="Platform">
          <FooterLink href="/cevrendekiler">Çevrendekiler</FooterLink>
          <FooterLink href="/kayit">Hesap aç</FooterLink>
          <FooterLink href="/giris">Giriş</FooterLink>
        </FooterCol>

        <FooterCol title="Kurum">
          <FooterLink href="/kullanim-kosullari">Kullanım koşulları</FooterLink>
          <FooterLink href="/gizlilik">Gizlilik</FooterLink>
          <FooterLink href="/kvkk">KVKK</FooterLink>
        </FooterCol>

        <FooterCol title="Destek">
          <FooterLink href="/sifre-sifirla">Şifremi unuttum</FooterLink>
          <FooterLink href="/yardim">Yardım merkezi</FooterLink>
          <FooterLink href="/geri-bildirim">Geri bildirim</FooterLink>
        </FooterCol>
      </div>

      <div className="footer-bottom mx-auto max-w-[1200px] px-5 sm:px-6 mt-12 flex flex-wrap items-center justify-between gap-3 text-[13px] text-ink-500">
        <span>© {new Date().getFullYear()} çevrende · Pendik, İstanbul</span>
        <span className="font-mono text-ink-500">v1.0</span>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-500 mb-3.5">
        {title}
      </p>
      <ul className="flex flex-col gap-2.5">
        {Array.isArray(children) ? (
          children.map((c, i) => <li key={i}>{c}</li>)
        ) : (
          <li>{children}</li>
        )}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[14px] text-ink-700 hover:text-ink-900 transition"
    >
      {children}
    </Link>
  );
}
