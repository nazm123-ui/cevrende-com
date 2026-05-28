import Link from "next/link";

export const metadata = {
  title: "Yardım Merkezi — Cevrende.com",
  description:
    "Cevrende.com kullanımı hakkında sık sorulan sorular: kayıt, profil, mesajlaşma, telefon görünürlüğü ve hesap güvenliği.",
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Nasıl kayıt olurum?",
    a: (
      <>
        Sağ üstteki <b>Kayıt ol</b> butonuna tıkla. Ad, soyad, e-posta ve
        telefonunu gir, kullanım koşullarını kabul et. Ardından e-postana gelen
        kodu doğrularsan hesabın aktif olur.
      </>
    ),
  },
  {
    q: "Profilimi nasıl düzenlerim?",
    a: (
      <>
        Giriş yaptıktan sonra üst menüden <b>Profilim</b>'e geç. Hesap sekmesinde
        mesleklerini, kendini tanıtan bir metni, mahalleni ve gizlilik
        tercihlerini düzenleyebilirsin.
      </>
    ),
  },
  {
    q: "İş deneyimimi nasıl eklerim?",
    a: (
      <>
        Profilim → Hesap sekmesindeki <b>İş Deneyimi</b> bölümünden{" "}
        <b>+ Deneyim ekle</b> butonuyla pozisyon, işyeri ve yıl bilgisi girip
        kaydet. Eklediğin deneyimler herkesin gördüğü profilinde sıralı olarak
        görünür.
      </>
    ),
  },
  {
    q: "Mesajlaşma nasıl çalışır?",
    a: (
      <>
        Bir işçinin profiline gir, <b>Mesaj gönder</b>'e tıkla. Eğer işçinin
        gizlilik ayarı "onay sonrası" ise önce iletişim talebi gönderilir; işçi
        kabul ederse sohbet açılır. Tüm mesajlar platform üzerinden geçer,
        numara paylaşılmadan iletişim kurabilirsin.
      </>
    ),
  },
  {
    q: "Telefonumu kim görür?",
    a: (
      <>
        Profil ayarlarında üç seçenek var: <b>Herkes görsün</b> (giriş yapan tüm
        kullanıcılar telefonunu görebilir), <b>Sadece onayladığım kişiler</b>{" "}
        (önerilen — talep gönderen ve kabul ettiğin kişiler), <b>Hiç görünmesin</b>{" "}
        (yalnızca platform içi mesajlaşma).
      </>
    ),
  },
  {
    q: "İletişim talebi nedir?",
    a: (
      <>
        Telefon görünürlüğünü "sadece onay" seçen kullanıcılarla iletişime
        geçmek için talep göndermen gerekir. Profil sayfasında{" "}
        <b>Mesaj gönder</b>'e bastığında otomatik talep oluşur; karşı taraf
        kabul ederse sohbete devam edebilirsin.
      </>
    ),
  },
  {
    q: "Bir kullanıcıyı nasıl bildirir/engellerim?",
    a: (
      <>
        Sohbet ekranının sağ üstündeki üç noktaya tıkla; oradan{" "}
        <b>Bildir</b> veya <b>Engelle</b> seçeneklerine ulaşabilirsin. Engelli
        kullanıcı sana yeni mesaj atamaz.
      </>
    ),
  },
  {
    q: "Hesabımı nasıl silerim?",
    a: (
      <>
        Hesap silme işlemi için{" "}
        <Link
          href="/geri-bildirim"
          style={{
            color: "var(--color-ink-900)",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          geri bildirim formundan
        </Link>{" "}
        bize ulaş. İlgili e-postandan onay verirsen 7 gün içinde verilerin
        silinir.
      </>
    ),
  },
];

export default function YardimPage() {
  return (
    <div className="page">
      <section style={{ padding: "56px 0 24px" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Yardım Merkezi
          </div>
          <h2 style={{ marginBottom: 12 }}>Sık sorulan sorular</h2>
          <p style={{ color: "var(--color-ink-500)", fontSize: 16 }}>
            Cevrende.com'u kullanırken aklına takılan her şey burada. Cevabını
            bulamazsan{" "}
            <Link
              href="/geri-bildirim"
              style={{
                color: "var(--color-ink-900)",
                fontWeight: 500,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              bize ulaş
            </Link>
            .
          </p>
        </div>
      </section>

      <section style={{ padding: "16px 0 96px" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {FAQS.map((f, i) => (
              <li
                key={i}
                style={{
                  border: "1px solid var(--color-ink-100)",
                  borderRadius: 14,
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                <details>
                  <summary
                    style={{
                      cursor: "pointer",
                      padding: "18px 22px",
                      fontSize: 15.5,
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                      color: "var(--color-ink-900)",
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <span>{f.q}</span>
                    <span
                      aria-hidden
                      style={{
                        color: "var(--color-ink-400)",
                        fontSize: 18,
                        lineHeight: 1,
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <div
                    style={{
                      padding: "0 22px 20px",
                      fontSize: 14.5,
                      lineHeight: 1.7,
                      color: "var(--color-ink-700)",
                    }}
                  >
                    {f.a}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
