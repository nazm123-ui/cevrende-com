"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type Profession = { slug: string; name: string; count: number };

interface Props {
  professions: Profession[];
  total: number;
}

const SORT_OPTIONS = [
  { id: "newest", label: "En yeni" },
  { id: "rating", label: "Puana göre" },
  { id: "near", label: "Yakına göre" },
];

export default function CategorySidebar({ professions, total }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const currentMeslek = params.get("meslek") ?? "";
  const currentSort = params.get("siralama") ?? "newest";

  function setMeslek(slug: string) {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set("meslek", slug);
    else next.delete("meslek");
    startTransition(() => {
      router.push(`/cevrendekiler${next.toString() ? `?${next}` : ""}`);
    });
  }

  function setSort(id: string) {
    const next = new URLSearchParams(params.toString());
    if (id && id !== "newest") next.set("siralama", id);
    else next.delete("siralama");
    startTransition(() => {
      router.push(`/cevrendekiler${next.toString() ? `?${next}` : ""}`);
    });
  }

  return (
    <aside style={{ position: "sticky", top: 88 }}>
      {/* Kategoriler */}
      <div className="eyebrow" style={{ marginBottom: 14 }}>
        Kategoriler
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

      <div
        style={{
          height: 1,
          background: "var(--color-ink-100)",
          width: "100%",
          margin: "24px 0",
        }}
      />

      {/* Sıralama */}
      <div className="eyebrow" style={{ marginBottom: 14 }}>
        Sıralama
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {SORT_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setSort(o.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: 0,
              font: "inherit",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
              color: "var(--color-ink-700)",
              textAlign: "left",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border:
                  "1.5px solid " +
                  (currentSort === o.id
                    ? "var(--color-accent-600)"
                    : "var(--color-ink-200)"),
                display: "inline-block",
                position: "relative",
                flex: "0 0 14px",
              }}
            >
              {currentSort === o.id && (
                <span
                  style={{
                    position: "absolute",
                    inset: 3,
                    borderRadius: "50%",
                    background: "var(--color-accent-600)",
                  }}
                />
              )}
            </span>
            <span style={{ fontSize: 14 }}>{o.label}</span>
          </button>
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
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        border: 0,
        font: "inherit",
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer",
        color: active ? "var(--color-ink-900)" : "var(--color-ink-700)",
        fontWeight: active ? 500 : 400,
        background: active ? "rgba(15,17,16,.04)" : "transparent",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: 14.5, letterSpacing: "-0.005em" }}>{label}</span>
      <span
        className="font-mono"
        style={{ color: "var(--color-ink-400)", fontSize: 13.5 }}
      >
        {count}
      </span>
    </button>
  );
}
