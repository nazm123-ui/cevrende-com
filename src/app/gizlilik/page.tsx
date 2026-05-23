export const metadata = {
  title: "Gizlilik Politikası — Cevrende",
  description: "Cevrende'de verilerinizin nasıl toplanıp korunduğu hakkında bilgiler.",
};

export default function GizlilikPage() {
  return (
    <div className="mx-auto max-w-[800px] px-5 sm:px-6 py-12 sm:py-16">
      <h1 className="text-[34px] sm:text-[42px] font-semibold tracking-[-0.025em] leading-[1.08] mb-8">
        Gizlilik Politikası
      </h1>

      <div className="prose prose-sm max-w-none space-y-6 text-ink-700">
        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            1. Veri Toplama
          </h2>
          <p>
            Cevrende, kullanıcılara profil açtırırken ad, e-posta, telefon, mahalle ve meslek bilgilerini toplar. Bu bilgiler
            yalnızca platformda aracısız iletişim sağlamak için kullanılır.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            2. Veri Güvenliği
          </h2>
          <p>
            Tüm kişisel veriler şifreli ve güvenli sunucularda saklanır. Telefon numaraları, tarafların istekleri doğrultusunda
            gizlenebilir veya sadece belirli kişilere gösterilebilir.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            3. Veri Paylaşımı
          </h2>
          <p>
            Cevrende, kişisel verileri hiçbir üçüncü tarafa satmaz, kiralamamaz veya vermiş olmaz. Veriler yalnızca platform
            kullanıcıları arasında aracısız iletişim sağlamak üzere paylaşılır.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            4. Profil Gizliliği
          </h2>
          <p>
            Her kullanıcı kendi profil bilgilerinin kime gösterileceğini kontrol edebilir. Meslek herkese açık olabilirken, isim
            ve telefon sadece belirli kişilere veya mesajlaştıktan sonra gösterilebilir.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            5. Çerezler ve İzleme
          </h2>
          <p>
            Cevrende, kullanıcı oturumunu yönetmek için çerezleri kullanabilir. Bu çerezler kesinlikle reklam veya üçüncü taraf
            takibi amacıyla kullanılmaz.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            6. Veri Silme
          </h2>
          <p>
            Kullanıcılar istediği zaman profil silme talebinde bulunabilir. Bu taleple tüm kişisel veriler platform
            veritabanından silinecektir.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            7. KVKK Uyumluluğu
          </h2>
          <p>
            Cevrende, Kişisel Verilerin Korunması Kanunu'na (KVKK) tam uyum sağlamaktadır. Kullanıcıların veri haklarına saygı
            gösterilir ve gerekli tüm tedbirler alınmıştır.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            8. Politika Değişiklikleri
          </h2>
          <p>
            Bu gizlilik politikası zaman zaman güncellenebilir. Büyük değişiklikler yapıldığında kullanıcılar bilgilendirilecektir.
          </p>
        </section>

        <p className="text-sm text-ink-500 mt-8">
          Son güncelleme: 2026-05-23
        </p>
      </div>
    </div>
  );
}
