"use client";

import { useMemo, useState } from "react";

type Category = { slug: string; name: string };

function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

export default function ProfessionPicker({
  categories,
  value,
  onChange,
  max = 5,
}: {
  categories: Category[];
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
}) {
  const [q, setQ] = useState("");

  const nameBySlug = useMemo(
    () => new Map(categories.map((c) => [c.slug, c.name])),
    [categories],
  );

  const matches = useMemo(() => {
    const nq = normalize(q.trim());
    if (!nq) return [];
    return categories
      .filter((c) => !value.includes(c.slug) && normalize(c.name).includes(nq))
      .slice(0, 8);
  }, [q, categories, value]);

  function add(slug: string) {
    if (value.length >= max || value.includes(slug)) return;
    onChange([...value, slug]);
    setQ("");
  }
  function remove(slug: string) {
    onChange(value.filter((s) => s !== slug));
  }

  const atMax = value.length >= max;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span className="label" style={{ margin: 0 }}>
          Meslekler
        </span>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          {value.length}/{max} seçili
        </span>
      </div>

      {/* Seçili meslekler */}
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {value.map((slug) => (
            <span
              key={slug}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 30,
                padding: "0 6px 0 12px",
                borderRadius: 999,
                border: "1px solid var(--accent)",
                background: "var(--accent)",
                color: "#fff",
                fontSize: 13,
              }}
            >
              {nameBySlug.get(slug) ?? slug}
              <button
                type="button"
                onClick={() => remove(slug)}
                aria-label="Kaldır"
                style={{
                  width: 18,
                  height: 18,
                  padding: 0,
                  border: 0,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  color: "#fff",
                  fontSize: 12,
                  lineHeight: 1,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Arama */}
      <div style={{ position: "relative" }}>
        <input
          className="input"
          placeholder={atMax ? "En fazla 5 meslek seçildi" : "Meslek ara…"}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={atMax}
        />

        {q.trim() && matches.length > 0 && (
          <div
            style={{
              marginTop: 6,
              border: "1px solid var(--line-2, #e5e5e5)",
              borderRadius: 10,
              overflow: "hidden",
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {matches.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => add(c.slug)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 12px",
                  border: 0,
                  borderBottom: "1px solid var(--line, #f0f0f0)",
                  background: "#fff",
                  color: "var(--ink)",
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {q.trim() && matches.length === 0 && !atMax && (
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>
            Eşleşen meslek yok.
          </div>
        )}
      </div>
    </div>
  );
}
