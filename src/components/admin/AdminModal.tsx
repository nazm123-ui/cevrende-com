"use client";

import { useEffect } from "react";

export default function AdminModal({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = 540,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 17, 16, 0.4)",
        padding: 16,
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth,
          padding: 22,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: subtitle ? 4 : 16,
          }}
        >
          <h3 style={{ fontSize: 16, margin: 0 }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs"
            aria-label="Kapat"
            style={{ marginTop: -4 }}
          >
            ✕
          </button>
        </div>
        {subtitle && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
