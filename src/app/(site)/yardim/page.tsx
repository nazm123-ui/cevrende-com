import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";

export const metadata = {
  title: "Yardım Merkezi — Cevrende.com",
  description:
    "Cevrende.com kullanımı hakkında sık sorulan sorular: kayıt, profil, mesajlaşma, telefon görünürlüğü ve hesap güvenliği.",
  alternates: { canonical: "/yardim" },
};

// React node içeriğini düz metne çevirir — FAQPage schema için.
function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children;
    return extractText(children);
  }
  return "";
}

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
        <b>+ Deneyim ekle</b> butonuyla görev, işyeri ve yıl bilgisi girip
        kaydet. Eklediğin deneyimler herkesin gördüğü profilinde sıralı olarak
        görünür.
      </>
    ),
  },
  {
    q: "Mesajlaşma nasıl çalışır?",
    a: (
      <>
        Bir hizmet verenin profiline gir, <b>Mesaj gönder</b>'e tıkla. Eğer
        kişinin gizlilik ayarı "onay sonrası" ise önce iletişim talebi
        gönderilir; kişi kabul ederse sohbet açılır. Tüm mesajlar platform
        üzerinden geçer,
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

// AI search'ün net cevap çıkartabilmesi için Article + FAQPage schema
// birlikte gönderilir. Article freshness (datePublished/dateModified) AI
// sistemlerinin "ne kadar yeni?" sinyali için kritik.
const LAST_UPDATED = "2026-06-02";

export default function YardimPage() {
  // Plain-text FAQs for schema (React node a → readable string)
  const faqsPlain = FAQS.map((f) => ({
    q: f.q,
    a: typeof f.a === "string" ? f.a : extractText(f.a),
  }));

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: "tr-TR",
            datePublished: "2026-04-01",
            dateModified: LAST_UPDATED,
            mainEntity: faqsPlain.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

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
          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              color: "var(--color-ink-400)",
            }}
          >
            Son güncelleme:{" "}
            <time dateTime={LAST_UPDATED}>2 Haziran 2026</time>
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
