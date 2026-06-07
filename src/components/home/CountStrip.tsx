import { prisma } from "@/lib/db";

export default async function CountStrip() {
  const [workersCount] = await Promise.all([
    prisma.user.count({
      where: { professions: { isEmpty: false }, isActive: true },
    }),
  ]);

  const workersDisplay =
    workersCount >= 1000
      ? `${(workersCount / 1000).toFixed(1)}K`
      : workersCount.toString();

  const stats = [
    { n: workersDisplay, lbl: "Pendik'te hizmet veren" },
    { n: "39", lbl: "mahalle kapsama alanı" },
    { n: "~2 sa", lbl: "ortalama mesaj yanıt süresi" },
    { n: "%0", lbl: "komisyon ve üyelik ücreti" },
  ];

  return (
    <section className="py-9 sm:py-10 border-y border-ink-100">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-7 gap-x-6 sm:gap-x-10">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="text-[28px] sm:text-[30px] font-medium tracking-[-0.02em] text-ink-900 leading-none">
                {s.n}
              </div>
              <div className="text-[13px] sm:text-[13.5px] text-ink-500 leading-snug">
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
