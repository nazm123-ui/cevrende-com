import type { HomeFaq } from "@/lib/home-faqs";

export default function FAQ({ faqs }: { faqs: HomeFaq[] }) {
  return (
    <section className="pt-6 sm:pt-8 pb-20 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="max-w-[600px] mb-10">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium">
            Sorular & Cevaplar
          </p>
          <h2 className="mt-2 text-[32px] sm:text-[40px] font-semibold tracking-[-0.025em] leading-[1.08] text-balance">
            Pendik'te hizmet veren bulma hakkında sık sorulanlar
          </h2>
        </div>

        <div className="grid gap-6 max-w-[800px]">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="faq-item group border border-ink-100 rounded-[12px] px-5 py-4 sm:px-6 sm:py-5 hover:border-ink-200 transition"
            >
              <summary className="cursor-pointer list-none font-medium text-[16px] text-ink-900 flex items-center justify-between gap-3 select-none">
                {faq.q}
                <span aria-hidden className="ml-4 text-ink-400 group-open:rotate-45 transition text-[20px] leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[15px] text-ink-700 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
