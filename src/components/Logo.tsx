import Link from "next/link";

type Props = {
  size?: "sm" | "md";
};

export default function Logo({ size = "md" }: Props) {
  const dot = size === "sm" ? 18 : 22;
  const inner = size === "sm" ? 5 : 7;
  const text = size === "sm" ? "text-[15px]" : "text-[18px]";

  return (
    <Link
      href="/"
      aria-label="Çevrende ana sayfa"
      className="inline-flex items-center gap-2.5"
    >
      <span
        className="relative rounded-full bg-ink-900 inline-block shrink-0"
        style={{ width: dot, height: dot }}
      >
        <span
          className="absolute rounded-full bg-ink-50"
          style={{
            width: inner,
            height: inner,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </span>
      <span className={`${text} font-semibold tracking-tight text-ink-900`}>
        Çevrende
      </span>
    </Link>
  );
}
