const steps = [
  {
    n: "01",
    title: "Profilini yayınla",
    body: "Ne iş yaptığını, deneyimini ve nerede çalışmak istediğini birkaç adımda yaz.",
  },
  {
    n: "02",
    title: "İşveren seni bulur",
    body: "Pendik'te sana uygun iş arayan işverenler profilini görür.",
  },
  {
    n: "03",
    title: "Doğrudan iletişim",
    body: "Telefon ya da mesajla aracısız konuşur, vakit kaybetmezsin.",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "96px 0" }}>
      <div className="container">
        <div style={{ maxWidth: 600, marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Nasıl çalışır
          </div>
          <h2 style={{ textWrap: "balance" }}>
            Üç adımda, mahallenden iş.
          </h2>
        </div>
        <div
          className="how-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            borderTop: "1px solid var(--color-ink-100)",
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              className="how-step"
              style={{
                padding: "40px 32px 36px 0",
                borderRight:
                  i < 2 ? "1px solid var(--color-ink-100)" : "none",
                paddingLeft: i > 0 ? 32 : 0,
              }}
            >
              <div
                className="font-mono"
                style={{
                  fontSize: 13,
                  color: "var(--color-accent-600)",
                  marginBottom: 18,
                  letterSpacing: "0.04em",
                }}
              >
                {s.n}
              </div>
              <h3 style={{ marginBottom: 10 }}>{s.title}</h3>
              <p
                style={{
                  color: "var(--color-ink-500)",
                  fontSize: 15,
                  maxWidth: 280,
                  lineHeight: 1.6,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
