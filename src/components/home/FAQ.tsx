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
            Pendik'te işçi bulma hakkında sık sorulanlar
          </h2>
        </div>

        <div className="grid gap-6 max-w-[800px]">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-ink-100 rounded-[12px] p-5 sm:p-6 cursor-pointer hover:border-ink-200 transition"
            >
              <summary className="font-medium text-[16px] text-ink-900 flex items-center justify-between select-none">
                {faq.q}
                <span className="ml-4 text-ink-500 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-[15px] text-ink-500 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
