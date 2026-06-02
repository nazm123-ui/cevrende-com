const items = [
  {
    title: "Sadece Pendik",
    body: "39 mahallede çalışırız. Uzaktaki ilanlarla vakit kaybetmezsin — yan komşudaki ustayı bulursun.",
  },
  {
    title: "Komisyonsuz",
    body: "Profil aç, mesaj at, anlaş. Üyelik ücreti yok, ilan ücreti yok, aracı kesintisi yok.",
  },
  {
    title: "Doğrudan iletişim",
    body: "İlk mesaj platformdan başlar. Telefon, WhatsApp, adres — ne paylaşılacağına sen karar verirsin.",
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
