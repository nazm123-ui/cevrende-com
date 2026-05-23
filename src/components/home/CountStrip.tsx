import { prisma } from "@/lib/db";

export default async function CountStrip() {
  const [workersCount, usersCount] = await Promise.all([
    prisma.user.count({
      where: { professions: { isEmpty: false }, isActive: true },
    }),
    prisma.user.count({ where: { isActive: true } }),
  ]);

  const stats = [
    { n: workersCount.toString(), lbl: "meslek sahibi" },
    { n: usersCount.toString(), lbl: "kayıtlı kişi" },
    { n: "Pendik", lbl: "ve mahalleleri" },
    { n: "%0", lbl: "komisyon" },
  ];

  return (
    <section className="border-y border-ink-100 py-9">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.lbl} className="flex flex-col gap-1">
            <div className="text-[26px] sm:text-[28px] font-medium tracking-[-0.02em] text-ink-900">
              {s.n}
            </div>
            <div className="text-[13.5px] text-ink-500">{s.lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
