"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type Profession = { slug: string; name: string; count: number };

interface Props {
  professions: Profession[];
  total: number;
}

export default function CategorySidebar({ professions, total }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const currentMeslek = params.get("meslek") ?? "";

  function setMeslek(slug: string) {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set("meslek", slug);
    else next.delete("meslek");
    startTransition(() => {
      router.push(`/cevrendekiler${next.toString() ? `?${next}` : ""}`);
    });
  }

  return (
    <aside className="sticky top-22 listings-sidebar" style={{ top: 88 }}>
      <div className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-500 font-medium mb-3.5">
        Kategoriler
      </div>
      <div className="flex flex-col gap-0.5">
        <CategoryRow
          label="Tüm meslekler"
          count={total}
          active={!currentMeslek}
          onClick={() => setMeslek("")}
        />
        {professions.map((p) => (
          <CategoryRow
            key={p.slug}
            label={p.name}
            count={p.count}
            active={currentMeslek === p.slug}
            onClick={() => setMeslek(p.slug)}
          />
        ))}
      </div>
    </aside>
  );
}

function CategoryRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex justify-between items-center w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition border-0 font-[inherit] ${
        active
          ? "bg-ink-900/[0.04] text-ink-900 font-medium"
          : "bg-transparent text-ink-700 font-normal hover:bg-ink-900/[0.02]"
      }`}
    >
      <span className="text-[14.5px] tracking-[-0.005em]">{label}</span>
      <span className="font-mono text-ink-500 text-[13.5px]">{count}</span>
    </button>
  );
}
