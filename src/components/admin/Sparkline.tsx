type Props = {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
};

// Smooth bezier sparkline with optional gradient fill below + last-point dot.
// Birebir admin-panel/admin/shell.jsx port'u.
export default function Sparkline({
  data,
  color = "var(--ink)",
  width = 200,
  height = 32,
  fill = true,
}: Props) {
  if (data.length === 0) return null;
  const w = width;
  const h = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = Math.max(1, max - min);
  const stepX = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data.map<[number, number]>((v, i) => [
    i * stepX,
    h - 4 - ((v - min) / span) * (h - 8),
  ]);

  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` Q ${mx.toFixed(1)} ${y0.toFixed(1)} ${mx.toFixed(1)} ${(
      (y0 + y1) /
      2
    ).toFixed(1)}`;
    d += ` Q ${mx.toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(
      1,
    )}`;
  }
  const dFill = d + ` L ${w} ${h} L 0 ${h} Z`;
  const id = "spark-" + Math.random().toString(36).slice(2, 7);

  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.16" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={dFill} fill={`url(#${id})`} />
        </>
      )}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="2.4"
        fill={color}
      />
    </svg>
  );
}
