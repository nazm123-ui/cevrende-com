"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";
import { JOB_TYPES } from "@/lib/constants/job-types";

type Category = { slug: string; name: string; count: number };

export default function JobFilters({
  categories,
  total,
}: {
  categories: Category[];
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = {
    kategori: params.get("kategori") ?? "",
    mahalle: params.get("mahalle") ?? "",
    tip: params.get("tip") ?? "",
    q: params.get("q") ?? "",
  };

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.push(`/ilanlar${next.toString() ? `?${next}` : ""}`);
    });
  }

  function reset() {
    startTransition(() => {
      router.push("/ilanlar");
    });
  }

  const hasFilter =
    current.kategori || current.mahalle || current.tip || current.q;

  return (
    <aside className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold text-ink-900">Filtreler</h2>
        <span className="text-xs text-ink-500">
          {total} ilan{isPending ? " • yükleniyor..." : ""}
        </span>
      </div>

      <SearchField
        defaultValue={current.q}
        onSubmit={(v) => updateParam("q", v)}
      />

      <SelectField
        label="Kategori"
        value={current.kategori}
        onChange={(v) => updateParam("kategori", v)}
        options={[
          { value: "", label: "Tüm Kategoriler" },
          ...categories.map((c) => ({
            value: c.slug,
            label: `${c.name} (${c.count})`,
          })),
        ]}
      />

      <SelectField
        label="Mahalle"
        value={current.mahalle}
        onChange={(v) => updateParam("mahalle", v)}
        options={[
          { value: "", label: "Tüm Mahalleler" },
          ...PENDIK_NEIGHBORHOODS.map((n) => ({ value: n, label: n })),
        ]}
      />

      <SelectField
        label="İş Tipi"
        value={current.tip}
        onChange={(v) => updateParam("tip", v)}
        options={[
          { value: "", label: "Tümü" },
          ...JOB_TYPES.map((t) => ({ value: t.value, label: t.label })),
        ]}
      />

      {hasFilter && (
        <button
          type="button"
          onClick={reset}
          className="w-full text-sm text-brand-700 hover:underline"
        >
          Filtreleri Temizle
        </button>
      )}
    </aside>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-500 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SearchField({
  defaultValue,
  onSubmit,
}: {
  defaultValue: string;
  onSubmit: (v: string) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit((fd.get("q") as string) ?? "");
      }}
    >
      <label className="block text-xs font-medium text-ink-500 mb-1">
        Arama
      </label>
      <div className="flex gap-2">
        <input
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Garson, temizlik, kurye..."
          className="flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
        >
          Ara
        </button>
      </div>
    </form>
  );
}
