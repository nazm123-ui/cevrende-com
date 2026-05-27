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
    <section className="section-py-sm bg-[#F0EDE3]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-8">
        {items.map((it, i) => (
          <div key={i}>
            <h4 className="mb-2 text-[16px] font-medium text-ink-900">
              {it.title}
            </h4>
            <p className="text-[14px] text-ink-500 leading-[1.55]">
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
