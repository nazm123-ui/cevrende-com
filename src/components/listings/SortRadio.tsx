"use client";

interface SortRadioProps {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  { id: "newest", label: "En yeni" },
  { id: "rating", label: "Puana göre" },
  { id: "near", label: "Yakına göre" },
];

export default function SortRadio({ value, onChange }: SortRadioProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
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
                (value === o.id
                  ? "var(--color-accent-600)"
                  : "var(--color-ink-200)"),
              display: "inline-block",
              position: "relative",
              flex: "0 0 14px",
            }}
          >
            {value === o.id && (
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
  );
}
