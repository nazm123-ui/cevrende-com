import Link from "next/link";
import { maskName, maskPhone, type Viewer } from "@/lib/masking";

type Props = {
  employer: { fullName: string; phone: string };
  viewer: Viewer;
};

export default function ContactCard({ employer, viewer }: Props) {
  if (viewer.kind === "verified") {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-ink-900">İletişim</h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="text-xs text-ink-500">İlan Veren</dt>
            <dd className="font-medium text-ink-900">{employer.fullName}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Telefon</dt>
            <dd className="font-mono text-base text-ink-900">
              {formatPhoneForDisplay(employer.phone)}
            </dd>
          </div>
        </dl>
        <a
          href={`tel:${employer.phone}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 transition"
        >
          📞 Telefonla İletişime Geç
        </a>
        <p className="mt-3 text-xs text-ink-500">
          Cevrende.com, ilan içeriğinden veya taraflar arasındaki anlaşmalardan
          sorumlu değildir. Görüşmelerinizde dikkatli olun.
        </p>
      </div>
    );
  }

  // Misafir veya doğrulanmamış kullanıcı
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-ink-900">İletişim</h2>
      <dl className="mt-3 space-y-3 text-sm">
        <div>
          <dt className="text-xs text-ink-500">İlan Veren</dt>
          <dd className="font-medium text-ink-900">
            {maskName(employer.fullName)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-ink-500">Telefon</dt>
          <dd className="font-mono text-base text-ink-500">
            {maskPhone(employer.phone)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-900">
        <p className="font-semibold">🔒 Tam iletişim bilgileri gizli</p>
        <p className="mt-1 text-brand-900/80">
          İlan veren ile iletişime geçmek için{" "}
          {viewer.kind === "guest"
            ? "kayıt olup telefonunuzu doğrulamanız gerekiyor."
            : "telefon doğrulamanızı tamamlamanız gerekiyor."}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {viewer.kind === "guest" ? (
          <>
            <Link
              href="/kayit"
              className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 transition"
            >
              Ücretsiz Kayıt Ol
            </Link>
            <Link
              href="/giris"
              className="flex w-full items-center justify-center rounded-lg border border-ink-200 bg-white px-4 py-3 font-semibold text-ink-700 hover:border-ink-300 transition"
            >
              Giriş Yap
            </Link>
          </>
        ) : (
          <Link
            href={`/dogrulama?userId=${viewer.userId}`}
            className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 transition"
          >
            Telefonunu Doğrula
          </Link>
        )}
      </div>
    </div>
  );
}

function formatPhoneForDisplay(phone: string): string {
  // 05551234567 -> 0555 123 45 67
  const d = phone.replace(/\D/g, "");
  if (d.length !== 11) return phone;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9)}`;
}
