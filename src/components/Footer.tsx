import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-ink-100 mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="font-bold text-brand-700 text-base">
            Cevrende<span className="text-accent-500">.com</span>
          </p>
          <p className="text-ink-500 mt-2 leading-relaxed">
            Pendik ve çevresinde yerel iş ilanları için ücretsiz platform.
          </p>
        </div>

        <div>
          <p className="font-semibold text-ink-700 mb-3">Hızlı Bağlantılar</p>
          <ul className="space-y-2 text-ink-500">
            <li>
              <Link href="/ilanlar" className="hover:text-brand-700 transition">
                İş İlanları
              </Link>
            </li>
            <li>
              <Link
                href="/ilan-olustur"
                className="hover:text-brand-700 transition"
              >
                İlan Oluştur
              </Link>
            </li>
            <li>
              <Link href="/kayit" className="hover:text-brand-700 transition">
                Kayıt Ol
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-ink-700 mb-3">Yasal</p>
          <ul className="space-y-2 text-ink-500">
            <li>
              <Link
                href="/kullanim-kosullari"
                className="hover:text-brand-700 transition"
              >
                Kullanım Koşulları
              </Link>
            </li>
            <li>
              <Link
                href="/gizlilik"
                className="hover:text-brand-700 transition"
              >
                Gizlilik Politikası
              </Link>
            </li>
            <li>
              <Link href="/kvkk" className="hover:text-brand-700 transition">
                KVKK Aydınlatma
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-100 py-4 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} Cevrende.com — Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
