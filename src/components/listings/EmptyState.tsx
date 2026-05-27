"use client";

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: "80px 24px",
        textAlign: "center",
        border: "1px dashed var(--color-ink-200)",
        borderRadius: 14,
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        Sonuç yok
      </div>
      <h3 style={{ marginBottom: 10 }}>Bu filtrelerle sonuç bulamadık.</h3>
      <p
        style={{
          color: "var(--color-ink-500)",
          marginBottom: 20,
        }}
      >
        Filtreleri sıfırla veya farklı bir bölge dene.
      </p>
      <button className="btn btn-secondary" onClick={onReset}>
        Filtreleri sıfırla
      </button>
    </div>
  );
}
