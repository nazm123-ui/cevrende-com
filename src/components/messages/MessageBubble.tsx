import type { Message } from "@/lib/sample-data";

interface MessageBubbleProps {
  msg: Message;
}

export default function MessageBubble({ msg }: MessageBubbleProps) {
  const mine = msg.from === "me";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: mine ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ maxWidth: "72%" }}>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            borderBottomRightRadius: mine ? 4 : 14,
            borderBottomLeftRadius: mine ? 14 : 4,
            background: mine ? "var(--color-ink-900)" : "#fff",
            color: mine ? "#fff" : "var(--color-ink-900)",
            border: mine
              ? "1px solid var(--color-ink-900)"
              : "1px solid var(--color-ink-100)",
            fontSize: 14.5,
            lineHeight: 1.5,
            letterSpacing: "-0.005em",
            wordWrap: "break-word",
          }}
        >
          {msg.text}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--color-ink-400)",
            marginTop: 6,
            textAlign: mine ? "right" : "left",
            padding: "0 6px",
          }}
        >
          {msg.time}
        </div>
      </div>
    </div>
  );
}
