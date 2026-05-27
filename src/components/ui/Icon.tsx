// Tasarım dosyasından birebir kopyalanmış ikonlar
// Stroke-based, hairline (1.4px)

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon({ name, size = 18, color = "currentColor", className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z" />
          <circle cx="12" cy="9" r="2.4" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M5 12.5 10 17 19 7.5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "msg":
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-12.3 6.7L4 20l1.3-4.7A8 8 0 1 1 21 12Z" />
        </svg>
      );
    case "bookmark":
      return (
        <svg {...common}>
          <path d="M7 4h10v17l-5-3.5L7 21V4Z" />
        </svg>
      );
    case "bookmark-filled":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={color}
          stroke={color}
          strokeWidth={1.4}
          strokeLinejoin="round"
          className={className}
        >
          <path d="M7 4h10v17l-5-3.5L7 21V4Z" />
        </svg>
      );
    default:
      return null;
  }
}
