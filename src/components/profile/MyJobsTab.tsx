"use client";

import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { SAMPLE_JOBS } from "@/lib/sample-data";

const FILTERS = ["Aktif", "Beklemede", "Süresi dolan"];

export default function MyJobsTab() {
  const router = useRouter();
  const myJobs = SAMPLE_JOBS.slice(0, 4);
  const accent = "var(--color-accent-600)";

  return (
    <div>
      {/* Filter chips + Yeni ilan */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map((lbl, i) => (
            <button
              key={lbl}
              className={"chip" + (i === 0 ? " is-active" : "")}
              style={{ height: 32 }}
            >
              {lbl}
            </button>
          ))}
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => router.push("/ilan-ver")}
        >
          <Icon name="plus" size={14} /> Yeni ilan
        </button>
      </div>

      {/* İlanlar listesi */}
      <div
        style={{
          border: "1px solid var(--color-ink-100)",
          borderRadius: 14,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {myJobs.map((j, i) => (
          <div
            key={j.id}
            className="my-job-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto",
              gap: 18,
              alignItems: "center",
              padding: "20px 24px",
              borderTop: i > 0 ? "1px solid var(--color-ink-100)" : "none",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {j.title}
              </div>
              <div className="text-sm text-muted" style={{ marginTop: 3 }}>
                {j.company} · {j.posted}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 500 }}>
                {[7, 12, 3, 5][i] || 1}
              </div>
              <div className="text-sm text-muted">başvuru</div>
            </div>
            <span
              className="chip"
              style={{
                background: "rgba(31, 90, 69, 0.10)",
                color: accent,
                border: 0,
                height: 28,
              }}
            >
              ● Aktif
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => router.push(`/ilanlar/${j.id}`)}
            >
              Yönet
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
