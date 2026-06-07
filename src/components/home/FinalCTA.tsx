import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-12 sm:pt-12 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="bg-ink-900 text-white rounded-[18px] p-7 sm:p-12 lg:p-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-balance text-white max-w-[520px]">
              Pendik'te hizmet veriyorsan, çevren seni bulsun.
            </h2>
            <p className="text-[15px] sm:text-[16px] mt-3 sm:mt-3.5 text-white/70 max-w-[480px] leading-[1.55]">
              2 dakikada ücretsiz profilini aç. Mesleğini ve mahalleni yaz —
              Pendik çevresindeki insanlar sana doğrudan ulaşsın. Komisyon yok,
              üyelik ücreti yok.
            </p>
          </div>
          <Link
            href="/kayit"
            className="btn-light h-[54px] px-7 rounded-full text-[16px] shrink-0 self-start sm:self-auto"
          >
            Ücretsiz profil oluştur
          </Link>
        </div>
      </div>
    </section>
  );
}
