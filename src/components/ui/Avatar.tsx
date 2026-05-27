// Tasarımdan birebir: cream background, ink text, hairline border

interface AvatarProps {
  initials: string;
  size?: number;
  className?: string;
}

export default function Avatar({ initials, size = 44, className = "" }: AvatarProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#F4F2EB",
        color: "var(--color-ink-900)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        flex: `0 0 ${size}px`,
        border: "1px solid var(--color-ink-200)",
      }}
    >
      {initials}
    </div>
  );
}

// Backward-compat named export
export { Avatar };
