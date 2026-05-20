const steps = [
  {
    n: "1",
    title: "İşveren ilan oluşturur",
    desc: "Birkaç dakikada ücretsiz ilan yayınla, mahalleni ve detayları belirle.",
  },
  {
    n: "2",
    title: "İş arayan uygun işi bulur",
    desc: "Mahalleye, kategoriye ve iş tipine göre filtreleyip incele.",
  },
  {
    n: "3",
    title: "Taraflar doğrudan iletişime geçer",
    desc: "Telefonla hızlıca iletişim kur, işi kolayca bitir.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-ink-900 tracking-tight">
          Nasıl Çalışır?
        </h2>
        <p className="mt-2 text-center text-ink-500">
          Üç adımda yerel iş bağlantısı.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-white border border-ink-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-brand-50 text-brand-700 font-bold text-xl flex items-center justify-center">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-500 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
