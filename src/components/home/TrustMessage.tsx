const items = [
  {
    title: "Yerel",
    body: "Sadece Pendik ve çevre mahalleler. Uzak hissetmezsin.",
  },
  {
    title: "Ücretsiz",
    body: "Profil açmak ve çevrendekilere ulaşmak tamamen ücretsiz.",
  },
  {
    title: "Aracısız",
    body: "Onay sonrası telefon veya platform mesajıyla doğrudan iletişim.",
  },
];

export default function TrustMessage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="bg-[#f4f2eb] rounded-[14px] px-8 sm:px-12 py-12 grid gap-10 sm:grid-cols-3">
          {items.map((it) => (
            <div key={it.title}>
              <h3 className="text-[16px] font-medium text-ink-900 mb-2">
                {it.title}
              </h3>
              <p className="text-[14px] text-ink-500 leading-relaxed">
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
