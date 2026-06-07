"use client";

export default function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: "var(--ink)" }}>{label}</div>
        {hint && (
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            {hint}
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{
          flex: "0 0 auto",
          width: 40,
          height: 23,
          padding: 0,
          border: 0,
          borderRadius: 999,
          position: "relative",
          cursor: disabled ? "not-allowed" : "pointer",
          background: checked ? "var(--accent)" : "var(--line-2, #cfcfcf)",
          opacity: disabled ? 0.5 : 1,
          transition: "background 0.18s ease",
          marginTop: 1,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 19 : 2,
            width: 19,
            height: 19,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
            transition: "left 0.18s ease",
          }}
        />
      </button>
    </div>
  );
}
