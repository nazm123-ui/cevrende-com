"use client";

import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import type { Worker } from "@/lib/sample-data";

interface WorkerRowProps {
  worker: Worker;
}

export default function WorkerRow({ worker }: WorkerRowProps) {
  const router = useRouter();
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="card row-card"
      style={{
        padding: "22px 26px",
        background: "#fff",
        cursor: "pointer",
        transition: "border-color .15s ease",
      }}
      onClick={() => router.push(`/cevrendekiler/${worker.id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "var(--color-ink-900)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "var(--color-ink-100)";
      }}
    >
      {/* Üst meta — posted + location */}
      <div
        className="worker-head"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
          color: "var(--color-ink-500)",
          fontSize: 13.5,
          flexWrap: "wrap",
        }}
      >
        <span className="font-mono">{worker.posted}</span>
        <span style={{ color: "var(--color-ink-400)" }}>·</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon name="pin" size={13} /> {worker.neighborhood}, {worker.district}
        </span>
      </div>

      {/* Avatar + isim + headline + chips */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <Avatar initials={worker.initials} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: "-0.015em",
              color: "var(--color-ink-900)",
            }}
          >
            {worker.name}
          </div>
          <div
            style={{
              fontSize: 15,
              color: "var(--color-ink-500)",
              marginTop: 4,
            }}
          >
            {worker.headline}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            <span className="chip chip-muted">{worker.category}</span>
            <span className="chip chip-muted">{worker.available}</span>
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin: "20px 0 16px" }} />

      {/* Alt aksiyon butonları */}
      <div
        className="worker-actions"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          className="btn btn-secondary btn-sm"
          onClick={(e) => {
            stop(e);
            router.push(`/panel/mesajlar/${worker.id}`);
          }}
        >
          Mesajlaş
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={(e) => {
            stop(e);
            router.push(`/cevrendekiler/${worker.id}`);
          }}
        >
          <Icon name="phone" size={14} /> {worker.phone}
        </button>
      </div>
    </div>
  );
}
