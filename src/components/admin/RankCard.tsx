export type RankRow = {
  id: string;
  name: string;
  sub?: string;
  count: number;
};

type Props = {
  title: string;
  sub?: string;
  rows: RankRow[];
  emptyText?: string;
};

export default function RankCard({ title, sub, rows, emptyText }: Props) {
  const maxVal = rows.length > 0 ? Math.max(...rows.map((r) => r.count), 1) : 1;

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          padding: "18px 22px 0",
        }}
      >
        <div>
          <h3 style={{ fontSize: 15.5 }}>{title}</h3>
          {sub && (
            <div
              style={{
                fontSize: 12.5,
                color: "var(--muted)",
                marginTop: 3,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: "10px 22px 18px" }}>
        {rows.length === 0 ? (
          <div className="empty" style={{ padding: "28px 12px" }}>
            {emptyText ?? "Henüz veri yok."}
          </div>
        ) : (
          rows.map((r, i) => (
            <div key={r.id} className="rank-row">
              <div className="rank-num">{String(i + 1).padStart(2, "0")}</div>
              <div style={{ minWidth: 0 }}>
                <div className="rank-name">{r.name}</div>
                {r.sub && <div className="rank-sub">{r.sub}</div>}
              </div>
              <div className="rank-bar">
                <span
                  style={{
                    width: Math.max(8, (r.count / maxVal) * 100) + "%",
                  }}
                />
              </div>
              <div className="rank-num-val">
                {r.count.toLocaleString("tr-TR")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
