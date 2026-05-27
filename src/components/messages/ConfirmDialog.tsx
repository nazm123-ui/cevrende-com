"use client";

interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <div
      className="modal-backdrop"
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,17,16,.32)",
        backdropFilter: "blur(2px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid var(--color-ink-100)",
          width: "100%",
          maxWidth: 400,
          padding: 36,
          boxShadow: "0 30px 80px -20px rgba(15,17,16,.3)",
        }}
      >
        <h3 style={{ fontSize: 20, marginBottom: 10 }}>{title}</h3>
        <p
          style={{
            color: "var(--color-ink-500)",
            fontSize: 14.5,
            lineHeight: 1.55,
            marginBottom: 24,
          }}
        >
          {body}
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button className="btn btn-secondary" onClick={onCancel}>
            Vazgeç
          </button>
          <button
            className="btn"
            onClick={onConfirm}
            style={{
              background: danger ? "#B23A3A" : "var(--color-ink-900)",
              color: "#fff",
              border: `1px solid ${danger ? "#B23A3A" : "var(--color-ink-900)"}`,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
