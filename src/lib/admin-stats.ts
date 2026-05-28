// Sparkline ve delta hesaplama yardımcıları — son 14 gün üzerinden günlük
// kovalama yapar, son 7 günü önceki 7 güne karşılaştırır.

export const SERIES_DAYS = 14;

export function buildDailySeries(timestamps: Date[]): number[] {
  const series = new Array(SERIES_DAYS).fill(0) as number[];
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const dayMs = 24 * 60 * 60 * 1000;
  for (const t of timestamps) {
    const daysAgo = Math.floor(
      (startOfToday.getTime() - t.getTime()) / dayMs,
    );
    // idx 0 = en eski, SERIES_DAYS-1 = bugün
    const idx = SERIES_DAYS - 1 - daysAgo;
    if (idx >= 0 && idx < SERIES_DAYS) series[idx]++;
  }
  return series;
}

export type Delta = {
  delta: number; // -1 / 0 / +1 (yön)
  deltaLabel: string; // gösterilecek etiket
};

export function computeDelta(series: number[]): Delta {
  const half = Math.floor(series.length / 2);
  const recent = series.slice(half).reduce((a, b) => a + b, 0);
  const previous = series.slice(0, half).reduce((a, b) => a + b, 0);

  if (previous === 0 && recent === 0) {
    return { delta: 0, deltaLabel: "değişim yok" };
  }
  if (previous === 0) {
    return { delta: 1, deltaLabel: `+${recent} yeni` };
  }
  const pct = Math.round(((recent - previous) / previous) * 100);
  if (pct === 0) {
    return { delta: 0, deltaLabel: "±0% bu hafta" };
  }
  return {
    delta: pct > 0 ? 1 : -1,
    deltaLabel: `${pct > 0 ? "+" : ""}${pct}% bu hafta`,
  };
}

export function startOf14DayWindow(): Date {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - (SERIES_DAYS - 1),
  );
  return start;
}
