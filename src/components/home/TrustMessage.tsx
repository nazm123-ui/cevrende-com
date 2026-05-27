const items = [
  {
    title: "Yerel",
    body: "Sadece Pendik ve çevre semtler. Uzak kalmaz.",
  },
  {
    title: "Ücretsiz",
    body: "Profil oluşturmak ve görüntülemek tamamen ücretsizdir.",
  },
  {
    title: "Hızlı iletişim",
    body: "Aracısız telefon veya mesaj. Vakit kaybı yok.",
  },
];

export default function TrustMessage() {
  return (
    <section
      style={{ padding: "64px 0", background: "#F4F2EB" }}
      className="tight"
    >
      <div
        className="container trust-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 48,
        }}
      >
        {items.map((it, i) => (
          <div key={i}>
            <h4
              style={{
                marginBottom: 8,
                fontSize: 16,
                fontWeight: 500,
                color: "var(--color-ink-900)",
              }}
            >
              {it.title}
            </h4>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-ink-500)",
                lineHeight: 1.55,
              }}
            >
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
