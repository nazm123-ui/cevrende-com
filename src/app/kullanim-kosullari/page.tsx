export const metadata = {
  title: "Kullanım Koşulları — Cevrende",
  description: "Cevrende platformunun kullanım koşulları ve hükümleri.",
};

export default function KullanimKosullariPage() {
  return (
    <div className="mx-auto max-w-[800px] px-5 sm:px-6 py-12 sm:py-16">
      <h1 className="text-[34px] sm:text-[42px] font-semibold tracking-[-0.025em] leading-[1.08] mb-8">
        Kullanım Koşulları
      </h1>

      <div className="prose prose-sm max-w-none space-y-6 text-ink-700">
        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            1. Hizmetin Tanımı
          </h2>
          <p>
            Cevrende platformu, Pendik ve çevresinde meslek sahibi kişilerle hizmet arayanlara aracısız iletişim imkanı sağlayan
            bir dijital platformdur. Kullanıcılar profil açabilir, birbirlerini arayabilir ve platform üzerinden mesajlaşabilir.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            2. Kullanıcı Sorumluluğu
          </h2>
          <p>
            Platformu kullanan her kişi kendi davranışlarından sorumludur. Aldatıcı, tehditkar veya yasalara aykırı içerik paylaşmak
            kesinlikle yasaktır. Bu tür davranışlar platform erişiminin iptal edilmesine neden olabilir.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            3. Profil Bilgisi
          </h2>
          <p>
            Profil açarken verilen tüm bilgilerin doğru olması gerekir. Yanlış veya eksik bilgi sağlamak platform güvenliğini
            tehlikeye atacağı için kabul edilemez.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            4. Ücretlendirme
          </h2>
          <p>
            Cevrende platformu tamamen ücretsizdir. Hiçbir kullanıcıdan platform kullanımı, mesajlaşma, profil açma veya işçi arama
            için para alınmaz.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            5. Platform Değişiklikleri
          </h2>
          <p>
            Cevrende, hizmet kalitesini artırmak amacıyla platformda değişiklik yapma hakkını saklı tutar. Kullanıcılar bu değişiklikler
            hakkında bilgilendirilecektir.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            6. Muhasebe ve Anlaşma
          </h2>
          <p>
            Aracısız iletişime geçen taraflar arasındaki tüm anlaşmalar ve muhasebeler platformun dışında yapılır. Cevrende bu taraflar
            arasındaki anlaşmalara karışmaz, taraf olmaz.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            7. Sorumluluk Reddi
          </h2>
          <p>
            Cevrende, kullanıcılar arasında yapılan işlemlerden veya anlaşmalardan sorumlu değildir. Platform yalnızca iletişim
            ortamı sağlar. Hizmet veya ürün kalitesi, güvenlik ve ödeme konularında taraf değildir.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            8. Gizlilik
          </h2>
          <p>
            Kullanıcı bilgileri ve gizlilik politikamız ayrıntılı şekilde Gizlilik Politikasında açıklanmıştır. Platformu kullanarak,
            bu şartları kabul etmiş olursunuz.
          </p>
        </section>

        <p className="text-sm text-ink-500 mt-8">
          Son güncelleme: 2026-05-23
        </p>
      </div>
    </div>
  );
}
