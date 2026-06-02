// Ana sayfa FAQ kayıtları — hem FAQ component (görsel) hem JSON-LD schema
// (Google için) aynı kaynağı kullansın diye burada tek yerde tutulur.
// AI search'lerin extract edebilmesi için 40-60 kelime, faktüel, somut.

export type HomeFaq = { q: string; a: string };

export const HOME_FAQS: HomeFaq[] = [
  {
    q: "Pendik'te güvenilir temizlikçi nasıl bulurum?",
    a: "Cevrende.com'da ücretsiz hesap aç, 'Çevrendekiler' sayfasında 'Temizlik' kategorisine filtrele. Pendik'in 39 mahallesinden temizlikçi profillerini görür, doğrudan platform içinden mesaj gönderirsin. İletişim aracısızdır, komisyon alınmaz.",
  },
  {
    q: "Pendik'te çilingir nasıl çabuk bulabilirim?",
    a: "Çevrendekiler sayfasında 'Çilingir' kategorisini seç ve mahalleni belirt. Online çevrimiçi ustaları öncelik sırasına göre görür, profilden doğrudan mesaj atarsın. Ortalama yanıt süresi 2 saattir.",
  },
  {
    q: "İşçiye telefon vermeden mesajlaşabilir miyim?",
    a: "Evet. Tüm iletişim platform içi mesajlaşmayla başlar. Telefon numarası sadece işçinin gizlilik ayarına bağlı olarak — herkes, sadece onaylananlar, veya hiç kimse — şeklinde görünür. Karşılıklı mesajlaştıktan sonra WhatsApp paylaşımı tercihe bağlıdır.",
  },
  {
    q: "Pendik'te işçi profili açmak kaç para tutuyor?",
    a: "Cevrende.com tamamen ücretsizdir. Profil oluşturma, görünme, mesaj alma ve gönderme komisyonsuzdur. Hizmet bedeli, işçi ve işveren arasında doğrudan kararlaştırılır, platform aracılık etmez.",
  },
  {
    q: "Çevrendekiler listesine nasıl eklenebilirim?",
    a: "1) Ücretsiz hesap aç. 2) E-posta doğrula. 3) Profil → Hesap sekmesinde meslek(ler)ini seç. 4) Mahalleni belirle. Bu adımlardan sonra profilin otomatik olarak Çevrendekiler listesinde görünür ve aranabilir hale gelir.",
  },
  {
    q: "Pendik'te işçi ararken hangi bilgilerim paylaşılır?",
    a: "İşçi profilinde, kişinin gizlilik tercihine göre ad-soyad, meslek, mahalle, deneyim ve biyografi gösterilir. Telefon numarası varsayılan olarak gizlidir; mesaj atan veya onay alan kişilere açılır. Adres bilgisi paylaşılmaz.",
  },
  {
    q: "Cevrende.com hangi ilçelerde aktif?",
    a: "Şu an yalnız Pendik aktiftir. Platform, İstanbul'un diğer 38 ilçesine kademeli olarak açılacak şekilde tasarlandı. Yeni ilçe eklendiğinde mevcut kullanıcılara bildirim gider.",
  },
  {
    q: "Cevrende.com Sahibinden veya Eleman.net'ten farkı ne?",
    a: "Cevrende sadece Pendik ilçesine ve mahalle bazlı eşleşmeye odaklanır. İlan ücreti yoktur, premium paket yoktur, komisyon alınmaz. Sahibinden ve Eleman.net Türkiye genelinde geniş kapsamlı çalışırken Cevrende yerel ve ücretsizdir.",
  },
];

// Cevrende.com nasıl kullanılır — HowTo schema'sı için adım dizisi.
// AI search bu adımları "How to find a worker in Pendik" tipi sorgulara çıkartabilir.
export const HOW_TO_STEPS = [
  {
    name: "Ücretsiz hesap aç",
    text: "Cevrende.com'a git, 'Kayıt ol' butonuna tıkla. Ad, soyad, e-posta ve telefonu gir, kullanım koşullarını kabul et.",
  },
  {
    name: "E-postanı doğrula",
    text: "Gelen kutuna düşen 6 haneli kodu ilgili alana gir. Doğrulama anında tamamlanır.",
  },
  {
    name: "Çevrendekiler sayfasına git",
    text: "Üst menüden 'Çevrendekiler'e tıkla. Aradığın hizmeti (Temizlik, Çilingir, Kurye vb.) ve mahalleni filtrele.",
  },
  {
    name: "Profilleri incele",
    text: "Çıkan listede ad-soyad, meslek, mahalle, deneyim ve biyografi görürsün. Çevrimiçi olan profiller yeşil işaretle gösterilir.",
  },
  {
    name: "Doğrudan mesaj gönder",
    text: "Beğendiğin profile gir, 'Mesaj gönder' butonuna tıkla. Telefon paylaşımı isteğe bağlıdır; iletişim platform içinden başlar.",
  },
];
