export const metadata = {
  title: "KVKK Aydınlatma Metni — Cevrende",
  description: "Cevrende'de kişisel verilerin işlenmesi hakkında KVKK aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <div className="mx-auto max-w-[800px] px-5 sm:px-6 py-12 sm:py-16">
      <h1 className="text-[34px] sm:text-[42px] font-semibold tracking-[-0.025em] leading-[1.08] mb-8">
        KVKK Aydınlatma Metni
      </h1>

      <div className="prose prose-sm max-w-none space-y-6 text-ink-700">
        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            Kişisel Verilerin Korunması Hakkında Bilgilendirme
          </h2>
          <p>
            Cevrende ("Şirket"), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin
            korunması konusunda önem vermektedir. Bu metin, verilerinizin nasıl işleneceği hakkında sizi bilgilendirmektedir.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            1. Veri Sorumlusu
          </h2>
          <p>
            Veri sorumlusu olarak Cevrende, kişisel verilerinizin işlenmesinde sorumluluk taşımaktadır. Sorularınız için
            iletişim: infocevrende@gmail.com
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            2. İşlenen Veriler
          </h2>
          <p>
            Cevrende'de işlenen kişisel veriler:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Ad Soyad</li>
            <li>E-posta Adresi</li>
            <li>Telefon Numarası</li>
            <li>Mahalle Bilgisi</li>
            <li>Meslek / Kategori Bilgisi</li>
            <li>Profil Resmi (opsiyonel)</li>
            <li>Biyografi / Özgeçmiş (opsiyonel)</li>
            <li>Mesajlaşma Geçmişi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            3. Veri İşleme Amacı
          </h2>
          <p>
            Verileriniz aşağıdaki amaçlar doğrultusunda işlenmektedir:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Kullanıcı hesabı oluşturma ve yönetme</li>
            <li>Platform aracılığıyla aracısız iletişim sağlama</li>
            <li>Güvenlik ve dolandırıcılık önleme</li>
            <li>Platform hizmetlerini iyileştirme</li>
            <li>Yasal yükümlülükleri yerine getirme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            4. Veri İşlemenin Hukuki Dayanağı
          </h2>
          <p>
            Verileriniz KVKK 5/2-c maddesi (Bir sözleşmenin kurulması veya ifası) uyarınca işlenmektedir. Ayrıca KVKK 6/1-a
            maddesi (Riza) kapsamında belirli işlemler için açık rıza alınabilir.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            5. Veri Paylaşımı
          </h2>
          <p>
            Kişisel verileriniz aşağıdaki taraflara paylaşılabilir:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Platform kullanıcıları (profil gizlilik ayarlarınız kapsamında)</li>
            <li>Yasal yükümlülükler doğrultusunda kamu yetkilileri</li>
            <li>Hukuki danışmanlar (yasal sorun çıkması halinde)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            6. Haklarınız
          </h2>
          <p>
            KVKK uyarınca aşağıdaki haklara sahipsiniz:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Kişisel verilerinize erişim hakkı</li>
            <li>Verilerinizin düzeltilmesini talep etme hakkı</li>
            <li>Verilerinizin silinmesini talep etme hakkı</li>
            <li>Veri işlemeye itiraz etme hakkı</li>
            <li>Taşınabilirlik hakkı</li>
          </ul>
          <p className="mt-3">
            Bu haklarını kullanmak için iletişim: infocevrende@gmail.com
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-ink-900 mb-3">
            7. Veri Saklama Süresi
          </h2>
          <p>
            Verileriniz, sözleşme süresi boyunca ve yasal olarak gerekli olduğu sürece saklanmaktadır. Profil silinişi talep
            etmeniz halinde, tüm veriler 30 gün içinde silinecektir.
          </p>
        </section>

        <p className="text-sm text-ink-500 mt-8">
          Son güncelleme: 2026-05-23
        </p>
      </div>
    </div>
  );
}
