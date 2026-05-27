export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          border: "1px solid var(--color-ink-100)",
          borderRadius: 18,
          padding: 36,
          boxShadow:
            "0 1px 0 rgba(15,17,16,.02), 0 8px 24px -12px rgba(15,17,16,.10)",
        }}
      >
        {eyebrow && (
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {eyebrow}
          </div>
        )}
        <h3
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.012em",
            lineHeight: 1.2,
            margin: 0,
            color: "var(--color-ink-900)",
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            style={{
              color: "var(--color-ink-500)",
              fontSize: 14,
              marginTop: 8,
              marginBottom: 0,
              lineHeight: 1.55,
            }}
          >
            {subtitle}
          </p>
        )}
        <div style={{ marginTop: 24 }}>{children}</div>
      </div>
    </div>
  );
}
