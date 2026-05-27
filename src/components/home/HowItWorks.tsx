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
    highlight: true,
  },
];

export default function HowItWorks() {
  return (
    <section className="section-py-lg">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="max-w-[600px] mb-12 sm:mb-14">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
            Nasıl çalışır
          </p>
          <h2 className="mt-3 text-balance">Üç adımda, mahallenden iş.</h2>
        </div>

        <div className="how-grid grid grid-cols-1 sm:grid-cols-3 border-t border-ink-100">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`how-step py-10 ${
                i < 2 ? "sm:border-r sm:border-ink-100" : ""
              } ${i > 0 ? "sm:pl-8" : ""} ${i < 2 ? "sm:pr-8" : ""}`}
            >
              <div
                className={`font-mono text-[12.5px] tracking-[0.04em] mb-5 ${
                  s.highlight ? "text-accent-600" : "text-ink-300"
                }`}
              >
                {s.n}
              </div>
              <h3 className="mb-2.5">{s.title}</h3>
              <p className="text-[15px] text-ink-500 leading-relaxed max-w-[280px]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
