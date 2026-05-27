import Link from "next/link";

export default function FinalCTA() {
  return (
    <section style={{ padding: "48px 0 96px" }}>
      <div className="container">
        <div
          className="final-cta"
          style={{
            background: "var(--color-ink-900)",
            color: "#fff",
            borderRadius: 18,
            padding: "64px 56px",
            display: "grid",
            gridTemplateColumns: "1.4fr auto",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                color: "#fff",
                maxWidth: 520,
                textWrap: "balance",
              }}
            >
              İş arıyorsan, çevren seni görsün.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,.7)",
                marginTop: 14,
                maxWidth: 480,
                fontSize: 16,
                lineHeight: 1.55,
              }}
            >
              İki dakikada profilini oluştur. Sadece çevrendeki işverenler
              görür, doğrudan ulaşır.
            </p>
          </div>
          <div
            className="final-cta-actions"
            style={{
              display: "flex",
              gap: 12,
              justifySelf: "end",
            }}
          >
            <Link
              href="/kayit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 54,
                padding: "0 28px",
                borderRadius: 999,
                background: "#fff",
                color: "var(--color-ink-900)",
                border: "1px solid #fff",
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "-0.005em",
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              Ücretsiz profil oluştur
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
