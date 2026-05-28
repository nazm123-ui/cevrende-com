import AdminIcon from "@/components/admin/AdminIcon";
import Sparkline from "@/components/admin/Sparkline";

type Props = {
  label: string;
  value: number;
  delta?: number;
  deltaLabel?: string;
  series?: number[];
  accent?: string;
};

export default function Metric({
  label,
  value,
  delta,
  deltaLabel,
  series,
  accent = "var(--ink)",
}: Props) {
  const direction =
    delta === undefined
      ? null
      : delta > 0
        ? "up"
        : delta < 0
          ? "down"
          : "flat";

  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-row">
        <div className="metric-value num">
          {value.toLocaleString("tr-TR")}
        </div>
        {direction && deltaLabel && (
          <div className={"metric-delta " + direction}>
            {direction === "up" && (
              <AdminIcon name="arrow-up" size={12} strokeWidth={2} />
            )}
            {direction === "down" && (
              <AdminIcon name="arrow-down" size={12} strokeWidth={2} />
            )}
            <span>{deltaLabel}</span>
          </div>
        )}
      </div>
      {series && series.length > 0 && (
        <div className="metric-spark">
          <Sparkline data={series} color={accent} />
        </div>
      )}
    </div>
  );
}
